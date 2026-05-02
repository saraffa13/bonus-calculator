"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatINR } from "@/lib/utils";
import { saveCalc } from "@/app/actions";
import { ProductPicker } from "@/components/ProductPicker";
import type { Product } from "@/lib/db";

export function CalculatorForm() {
  const [productName, setProductName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [qtyPaid, setQtyPaid] = useState("");
  const [qtyFree, setQtyFree] = useState("");
  const [gst, setGst] = useState("0");
  const [mrp, setMrp] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelectProduct = (p: Product) => {
    setSelected(p);
    setProductName(p.name);
    setItemPrice(p.ptr.toString());
    if (p.scheme_paid != null) setQtyPaid(String(p.scheme_paid));
    else setQtyPaid("");
    if (p.scheme_free != null) setQtyFree(String(p.scheme_free));
    else setQtyFree("");
    if (p.mrp != null) setMrp(String(p.mrp));
    else setMrp("");
  };

  const numItemPrice = parseFloat(itemPrice) || 0;
  const numPaid = parseInt(qtyPaid) || 0;
  const numFree = parseInt(qtyFree) || 0;
  const numGst = parseFloat(gst) || 0;
  const numMrp = parseFloat(mrp) || 0;
  const numTotal = numItemPrice * numPaid;

  const result = useMemo(() => {
    const totalReceived = numPaid + numFree;
    if (totalReceived <= 0 || numTotal <= 0) {
      return null;
    }
    const perUnit = numTotal / totalReceived;
    const perUnitWithGst = perUnit * (1 + numGst / 100);
    const totalSavings = numMrp > 0 ? numMrp * totalReceived - numTotal : 0;
    const discountPct =
      numMrp > 0 ? ((numMrp - perUnit) / numMrp) * 100 : 0;
    return {
      totalReceived,
      perUnit,
      perUnitWithGst,
      totalSavings,
      discountPct,
    };
  }, [numTotal, numPaid, numFree, numGst, numMrp]);

  const canSave =
    !!productName.trim() && !!result && numPaid > 0 && numTotal > 0;

  const handleSave = () => {
    if (!canSave || !result) return;
    setSavedMsg(null);
    startTransition(async () => {
      await saveCalc({
        productName: productName.trim(),
        totalPrice: numTotal,
        qtyPaid: numPaid,
        qtyFree: numFree,
        gstPercent: numGst,
        perUnitPrice: result.perUnit,
      });
      setSavedMsg("Saved to history.");
      setTimeout(() => setSavedMsg(null), 2500);
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Deal details</CardTitle>
          <CardDescription>
            Enter the offer to get the real per-unit price.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Pick a product">
            <ProductPicker
              value={productName}
              onSelect={handleSelectProduct}
            />
          </Field>

          <Field label="Product name">
            <Input
              placeholder="e.g. Maggi Noodles"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                setSelected(null);
              }}
            />
          </Field>

          <Field label="Price per item (₹)">
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="100"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantity paid for">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="3"
                value={qtyPaid}
                onChange={(e) => setQtyPaid(e.target.value)}
              />
            </Field>
            <Field label="Quantity free">
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                placeholder="3"
                value={qtyFree}
                onChange={(e) => setQtyFree(e.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="GST % (optional)">
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="0"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
              />
            </Field>
            <Field label="MRP per unit (optional)">
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                placeholder="0"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
              />
            </Field>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={!canSave || isPending}
            >
              {isPending ? "Saving..." : "Save Calculation"}
            </Button>
            {savedMsg && (
              <span className="text-sm text-green-600">{savedMsg}</span>
            )}
          </div>

          {selected && <ProductDetails product={selected} />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Result</CardTitle>
          <CardDescription>
            {numPaid > 0 && numFree >= 0
              ? `Buy ${numPaid} Get ${numFree} Free`
              : "Live breakdown"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-3">
              <Row
                label="Total price paid"
                value={formatINR(numTotal)}
              />
              <Row
                label="Total products received"
                value={`${result.totalReceived}`}
              />
              <Row
                label="Effective price per product"
                value={formatINR(result.perUnit)}
                highlight
              />
              <Row
                label={`Per product (incl. ${numGst}% GST)`}
                value={formatINR(result.perUnitWithGst)}
              />
              {numMrp > 0 && (
                <>
                  <Row
                    label="Total savings vs MRP"
                    value={formatINR(result.totalSavings)}
                  />
                  <Row
                    label="Discount %"
                    value={`${result.discountPct.toFixed(2)}%`}
                  />
                </>
              )}
              <div className="mt-4 rounded-md bg-muted p-3 text-xs text-muted-foreground">
                {formatINR(numTotal)} ÷ {result.totalReceived} ={" "}
                {formatINR(result.perUnit)} per unit
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Enter price and quantities to see the breakdown.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

function ProductDetails({ product }: { product: Product }) {
  const items: { label: string; value: string | number | null }[] = [
    { label: "SC code", value: product.sc_code },
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
    <div className="mt-4 rounded-md border bg-muted/40 p-4">
      <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {items.map((i) => (
          <div key={i.label} className="flex gap-2">
            <dt className="text-muted-foreground min-w-20">{i.label}:</dt>
            <dd className="font-medium break-words">{i.value as React.ReactNode}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed pb-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={
          highlight
            ? "text-xl font-semibold text-primary"
            : "text-base font-medium"
        }
      >
        {value}
      </span>
    </div>
  );
}
