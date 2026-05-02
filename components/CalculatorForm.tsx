"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductPicker } from "@/components/ProductPicker";
import { addHistory } from "@/lib/history";
import { formatINR } from "@/lib/utils";
import type { Product } from "@/lib/store";

export function CalculatorForm() {
  const [productName, setProductName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [qtyPaid, setQtyPaid] = useState("");
  const [qtyFree, setQtyFree] = useState("");
  const [gst, setGst] = useState("0");
  const [mrp, setMrp] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleSelectProduct = (p: Product) => {
    setSelected(p);
    setProductName(p.name);
    setItemPrice(p.ptr.toString());
    setQtyPaid(p.scheme_paid != null ? String(p.scheme_paid) : "");
    setQtyFree(p.scheme_free != null ? String(p.scheme_free) : "");
    setMrp(p.mrp != null ? String(p.mrp) : "");
  };

  const numItemPrice = parseFloat(itemPrice) || 0;
  const numPaid = parseInt(qtyPaid) || 0;
  const numFree = parseInt(qtyFree) || 0;
  const numGst = parseFloat(gst) || 0;
  const numMrp = parseFloat(mrp) || 0;
  const numTotal = numItemPrice * numPaid;

  const result = useMemo(() => {
    const totalReceived = numPaid + numFree;
    if (totalReceived <= 0 || numTotal <= 0) return null;
    const perUnit = numTotal / totalReceived;
    const perUnitWithGst = perUnit * (1 + numGst / 100);
    const totalSavings = numMrp > 0 ? numMrp * totalReceived - numTotal : 0;
    const discountPct = numMrp > 0 ? ((numMrp - perUnit) / numMrp) * 100 : 0;
    return { totalReceived, perUnit, perUnitWithGst, totalSavings, discountPct };
  }, [numTotal, numPaid, numFree, numGst, numMrp]);

  const canSave = !!productName.trim() && !!result && numPaid > 0 && numTotal > 0;

  useEffect(() => {
    if (!savedMsg) return;
    const t = setTimeout(() => setSavedMsg(null), 2500);
    return () => clearTimeout(t);
  }, [savedMsg]);

  const handleSave = () => {
    if (!canSave || !result) return;
    addHistory({
      product_name: productName.trim(),
      total_price: numTotal,
      qty_paid: numPaid,
      qty_free: numFree,
      gst_percent: numGst,
      per_unit_price: result.perUnit,
    });
    setSavedMsg("Saved to history.");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
      {/* Left card: Deal Details */}
      <div className="md:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant p-card_padding shadow-card flex flex-col gap-stack_gap">
        {savedMsg && (
          <div className="bg-secondary-fixed text-on-secondary-fixed-variant px-4 py-3 rounded-lg flex items-center gap-3 border border-secondary-fixed-dim border-opacity-30">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
            <span className="text-body-sm font-medium">{savedMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
          <div className="sm:col-span-2">
            <Label>Product</Label>
            <ProductPicker value={productName} onSelect={handleSelectProduct} />
          </div>

          <div className="sm:col-span-2">
            <Label>Product name</Label>
            <TextInput
              value={productName}
              onChange={(v) => {
                setProductName(v);
                setSelected(null);
              }}
              placeholder="e.g. Cofcross DX"
            />
          </div>

          <div>
            <Label>Price (₹)</Label>
            <TextInput
              type="number"
              value={itemPrice}
              onChange={setItemPrice}
              placeholder="45.20"
            />
          </div>

          <div>
            <Label>MRP (₹)</Label>
            <TextInput
              type="number"
              value={mrp}
              onChange={setMrp}
              placeholder="60.00"
            />
          </div>

          <div>
            <Label>Quantity Paid</Label>
            <TextInput
              type="number"
              value={qtyPaid}
              onChange={setQtyPaid}
              placeholder="16"
            />
          </div>

          <div>
            <Label>Quantity Free</Label>
            <TextInput
              type="number"
              value={qtyFree}
              onChange={setQtyFree}
              placeholder="4"
            />
          </div>

          <div className="sm:col-span-2">
            <Label>GST (%)</Label>
            <div className="relative w-full sm:w-1/2 sm:pr-2">
              <TextInput
                type="number"
                value={gst}
                onChange={setGst}
                placeholder="0"
              />
              <span className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 text-body-base text-outline pointer-events-none">
                %
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="h-element_height px-5 rounded-lg bg-primary text-on-primary text-body-sm font-semibold tracking-tight transition-shadow hover:shadow-card disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Calculation
          </button>
        </div>

        {selected && <ProductDetails product={selected} />}
      </div>

      {/* Right card: Result */}
      <div className="md:col-span-5 bg-surface-container-lowest rounded-xl border border-outline-variant p-card_padding shadow-card flex flex-col h-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

        <div className="border-b border-outline-variant pb-4 mb-5 mt-2">
          <h2 className="text-h2 text-primary">
            {numPaid > 0 || numFree > 0
              ? `Buy ${numPaid || 0} Get ${numFree || 0} Free`
              : "Live breakdown"}
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-1">
            Calculation Breakdown
          </p>
        </div>

        {result ? (
          <>
            <div className="flex flex-col gap-4 flex-grow">
              <BreakdownRow
                label="Total price"
                value={<Currency value={numTotal} />}
              />
              <BreakdownRow
                label="Total products"
                value={
                  <span className="text-body-base text-on-surface font-semibold">
                    {result.totalReceived}
                  </span>
                }
              />

              <div className="flex flex-col items-center justify-center bg-surface-container p-5 rounded-lg my-2 border border-outline-variant border-opacity-50">
                <span className="text-label-caps text-on-surface-variant uppercase mb-1">
                  Effective Price
                </span>
                <div className="text-currency text-primary text-[32px] leading-[40px] tracking-tight">
                  <Currency value={result.perUnit} bold />
                </div>
              </div>

              <BreakdownRow
                label={`Per product with ${numGst || 0}% GST`}
                value={<Currency value={result.perUnitWithGst} />}
              />

              {numMrp > 0 && (
                <>
                  <BreakdownRow
                    label="Total savings"
                    value={
                      <span className="text-currency text-secondary">
                        <Currency value={result.totalSavings} bold inheritColor />
                      </span>
                    }
                  />
                  <BreakdownRow
                    label="Discount"
                    value={
                      <span className="text-body-base text-secondary font-semibold">
                        {result.discountPct.toFixed(2)}%
                      </span>
                    }
                    last
                  />
                </>
              )}
            </div>

            <div className="mt-8 flex justify-center">
              <div className="bg-primary-fixed text-on-primary-fixed rounded-full px-5 py-2 inline-flex items-center gap-2 text-body-sm font-medium border border-primary-fixed-dim">
                <span aria-hidden="true">∑</span>
                <span>
                  {formatINR(numTotal)} ÷ {result.totalReceived} ={" "}
                  {formatINR(result.perUnit)} per unit
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-body-sm text-on-surface-variant">
            Enter price and quantities to see the breakdown.
          </p>
        )}
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-label-caps text-on-surface-variant uppercase mb-2 block">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-element_height px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
    />
  );
}

function BreakdownRow({
  label,
  value,
  last,
}: {
  label: string;
  value: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={
        "flex justify-between items-center" +
        (last
          ? ""
          : " border-b border-outline-variant border-opacity-40 pb-3")
      }
    >
      <span className="text-body-base text-on-surface-variant">{label}</span>
      {value}
    </div>
  );
}

function Currency({
  value,
  bold,
  inheritColor,
}: {
  value: number;
  bold?: boolean;
  inheritColor?: boolean;
}) {
  const [whole, decimal] = value.toFixed(2).split(".");
  const wholeFmt = parseInt(whole, 10).toLocaleString("en-IN");
  return (
    <span
      className={
        "text-currency " + (inheritColor ? "" : "text-on-surface")
      }
    >
      ₹<span className={bold ? "font-bold" : "font-bold"}>{wholeFmt}</span>.
      {decimal}
    </span>
  );
}

function ProductDetails({ product }: { product: Product }) {
  const items: { label: string; value: string | null }[] = [
    { label: "SC Code", value: product.sc_code },
    { label: "Division", value: product.division },
    { label: "Composition", value: product.composition },
    { label: "Form", value: product.form },
    { label: "Packing", value: product.packing },
    { label: "MRP", value: product.mrp != null ? formatINR(product.mrp) : null },
    { label: "PTR", value: formatINR(product.ptr) },
    { label: "PTS", value: product.pts != null ? formatINR(product.pts) : null },
    { label: "Scheme", value: product.scheme_raw },
    { label: "Gift", value: product.gift },
  ].filter((i) => i.value != null && i.value !== "");

  return (
    <div className="mt-4 bg-surface-container-low rounded-lg p-4 border border-outline-variant border-opacity-50">
      <div className="flex items-center gap-2 mb-3 text-on-surface-variant">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span className="text-label-caps uppercase">Product Data</span>
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {items.map((i) => (
          <div key={i.label}>
            <span className="text-body-sm text-outline block">{i.label}</span>
            <span className="text-body-sm text-on-surface font-medium break-words">
              {i.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
