/**
 * Parses "New Price list.xlsx" and seeds the products table.
 * Run: node scripts/seed-products.js
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const Database = require("better-sqlite3");

const XLSX_PATH = path.join(__dirname, "..", "New Price list.xlsx");
const DB_PATH = path.join(__dirname, "..", "data.db");

// --- Minimal ZIP reader: extracts named entries from a .xlsx (which is a zip)
function readZipEntries(buf, names) {
  const out = {};
  const wanted = new Set(names);
  // End of central directory record
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i >= buf.length - 65557; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("EOCD not found");
  const cdSize = buf.readUInt32LE(eocd + 12);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  const totalEntries = buf.readUInt16LE(eocd + 10);

  let p = cdOffset;
  for (let i = 0; i < totalEntries; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("Bad CD signature");
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.slice(p + 46, p + 46 + nameLen).toString("utf8");
    p += 46 + nameLen + extraLen + commentLen;

    if (!wanted.has(name)) continue;

    // Read local file header to find data start
    const lh = localOff;
    if (buf.readUInt32LE(lh) !== 0x04034b50) throw new Error("Bad LH");
    const lhNameLen = buf.readUInt16LE(lh + 26);
    const lhExtraLen = buf.readUInt16LE(lh + 28);
    const dataStart = lh + 30 + lhNameLen + lhExtraLen;
    const data = buf.slice(dataStart, dataStart + compSize);
    const content = method === 0 ? data : zlib.inflateRawSync(data);
    out[name] = content.toString("utf8");
  }
  return out;
}

function parseSharedStrings(xml) {
  // Each <si>...</si> contains one or more <t>...</t> fragments
  const strings = [];
  const siRe = /<si>([\s\S]*?)<\/si>/g;
  const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
  let m;
  while ((m = siRe.exec(xml))) {
    let combined = "";
    let t;
    tRe.lastIndex = 0;
    while ((t = tRe.exec(m[1]))) combined += decodeXml(t[1]);
    strings.push(combined);
  }
  return strings;
}

function decodeXml(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function colLetterToIndex(letters) {
  let n = 0;
  for (const c of letters) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
}

function parseSheet(xml, shared) {
  // Iterate <row ...>...</row>; in each, iterate <c r="A1" t="s"><v>..</v></c>
  const rows = [];
  const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g;
  const cellRe = /<c\s+r="([A-Z]+)(\d+)"(?:\s+s="\d+")?(?:\s+t="([^"]+)")?[^/]*?(?:\/>|>([\s\S]*?)<\/c>)/g;
  let r;
  while ((r = rowRe.exec(xml))) {
    const inner = r[1];
    const row = [];
    let c;
    cellRe.lastIndex = 0;
    while ((c = cellRe.exec(inner))) {
      const colIdx = colLetterToIndex(c[1]);
      const t = c[3];
      const body = c[4] || "";
      const vMatch = /<v>([\s\S]*?)<\/v>/.exec(body);
      const isMatch = /<is>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/is>/.exec(body);
      let value;
      if (t === "s" && vMatch) value = shared[parseInt(vMatch[1], 10)];
      else if (t === "inlineStr" && isMatch) value = decodeXml(isMatch[1]);
      else if (vMatch) value = vMatch[1];
      else value = "";
      row[colIdx] = value;
    }
    rows.push(row);
  }
  return rows;
}

function parseScheme(raw) {
  if (!raw) return { paid: null, free: null };
  const s = String(raw).trim();
  if (!s || /^na$/i.test(s)) return { paid: null, free: null };
  const m = /^(\d+)\s*\+\s*(\d+)$/.exec(s);
  if (!m) return { paid: null, free: null };
  return { paid: parseInt(m[1], 10), free: parseInt(m[2], 10) };
}

function main() {
  const buf = fs.readFileSync(XLSX_PATH);
  const entries = readZipEntries(buf, [
    "xl/sharedStrings.xml",
    "xl/worksheets/sheet1.xml",
  ]);
  const shared = parseSharedStrings(entries["xl/sharedStrings.xml"]);
  const rows = parseSheet(entries["xl/worksheets/sheet1.xml"], shared);

  // Column mapping (0-indexed): A=SC code, B=Product, C=Composition,
  // D=Form, E=Packing, F=MRP, G=PTR, H=PTS, I=Scheme, J=Gift, K=Division
  const COL_SC = 0;
  const COL_PRODUCT = 1;
  const COL_COMPOSITION = 2;
  const COL_FORM = 3;
  const COL_PACKING = 4;
  const COL_MRP = 5;
  const COL_PTR = 6;
  const COL_PTS = 7;
  const COL_SCHEME = 8;
  const COL_GIFT = 9;
  const COL_DIVISION = 10;

  const db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      ptr REAL NOT NULL,
      scheme_raw TEXT,
      scheme_paid INTEGER,
      scheme_free INTEGER,
      sc_code TEXT,
      composition TEXT,
      form TEXT,
      packing TEXT,
      mrp REAL,
      pts REAL,
      gift TEXT,
      division TEXT
    );
  `);
  for (const col of [
    "sc_code TEXT",
    "composition TEXT",
    "form TEXT",
    "packing TEXT",
    "mrp REAL",
    "pts REAL",
    "gift TEXT",
    "division TEXT",
  ]) {
    try { db.exec(`ALTER TABLE products ADD COLUMN ${col}`); } catch {}
  }

  const upsert = db.prepare(`
    INSERT INTO products (
      name, ptr, scheme_raw, scheme_paid, scheme_free,
      sc_code, composition, form, packing, mrp, pts, gift, division
    )
    VALUES (
      @name, @ptr, @raw, @paid, @free,
      @sc, @composition, @form, @packing, @mrp, @pts, @gift, @division
    )
    ON CONFLICT(name) DO UPDATE SET
      ptr = excluded.ptr,
      scheme_raw = excluded.scheme_raw,
      scheme_paid = excluded.scheme_paid,
      scheme_free = excluded.scheme_free,
      sc_code = excluded.sc_code,
      composition = excluded.composition,
      form = excluded.form,
      packing = excluded.packing,
      mrp = excluded.mrp,
      pts = excluded.pts,
      gift = excluded.gift,
      division = excluded.division
  `);

  let inserted = 0;
  let skipped = 0;
  const tx = db.transaction((records) => {
    for (const r of records) upsert.run(r);
  });

  const records = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;
    const name = (row[COL_PRODUCT] || "").toString().trim();
    const ptrRaw = row[COL_PTR];
    const ptr = ptrRaw === undefined || ptrRaw === "" ? NaN : parseFloat(ptrRaw);
    if (!name || !isFinite(ptr)) { skipped++; continue; }
    const schemeRaw = (row[COL_SCHEME] || "").toString().trim() || null;
    const { paid, free } = parseScheme(schemeRaw);
    const mrpRaw = row[COL_MRP];
    const ptsRaw = row[COL_PTS];
    const cleanStr = (v) => {
      const s = (v ?? "").toString().trim();
      return s === "" ? null : s;
    };
    records.push({
      name,
      ptr,
      raw: schemeRaw,
      paid,
      free,
      sc: cleanStr(row[COL_SC]),
      composition: cleanStr(row[COL_COMPOSITION]),
      form: cleanStr(row[COL_FORM]),
      packing: cleanStr(row[COL_PACKING]),
      mrp: mrpRaw === undefined || mrpRaw === "" ? null : parseFloat(mrpRaw),
      pts: ptsRaw === undefined || ptsRaw === "" ? null : parseFloat(ptsRaw),
      gift: cleanStr(row[COL_GIFT]),
      division: cleanStr(row[COL_DIVISION]),
    });
    inserted++;
  }

  tx(records);

  const total = db.prepare(`SELECT COUNT(*) AS c FROM products`).get().c;
  console.log(`Seeded ${inserted} rows (skipped ${skipped}). Total products in DB: ${total}.`);

  // Show a sample
  const sample = db.prepare(`SELECT name, ptr, scheme_raw, scheme_paid, scheme_free FROM products LIMIT 5`).all();
  console.table(sample);

  db.close();
}

main();
