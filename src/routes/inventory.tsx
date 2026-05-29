import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Save, X } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DeviceCompatibilityPicker,
  type CompatibilityValue,
} from "@/components/DeviceCompatibilityPicker";
import { itemBrands, itemParts, itemPartModels } from "@/lib/mock-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Add Inventory — Item ↔ Device Relationships" },
      {
        name: "description",
        content:
          "Add a new inventory item with quantity, vendor, and optional device compatibility.",
      },
    ],
  }),
  component: InventoryPage,
});

const vendors = ["SmartTech Supply", "iFix Wholesale", "PartHub", "GadgetSource"];

function InventoryPage() {
  const [make, setMake] = useState("");
  const [partId, setPartId] = useState("");
  const [partModelId, setPartModelId] = useState("");
  const [generation, setGeneration] = useState("");
  const [modelNumber, setModelNumber] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [costEach, setCostEach] = useState("0.00");
  const [lowQty, setLowQty] = useState("0");
  const [vendor, setVendor] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [worksWithOthers, setWorksWithOthers] = useState(false);
  const [compat, setCompat] = useState<CompatibilityValue>({
    familyIds: [],
    brandIds: [],
    modelIds: [],
  });

  const availableParts = useMemo(
    () => itemParts.filter((p) => p.itemBrandId === make),
    [make],
  );
  const availablePartModels = useMemo(
    () => itemPartModels.filter((m) => m.itemPartId === partId),
    [partId],
  );

  const handleSave = () => {
    if (!make || !partId || !quantity || !costEach || !vendor) {
      toast.error("Please fill all required fields.");
      return;
    }
    const payload = {
      make,
      partId,
      partModelId,
      generation,
      modelNumber,
      partNumber,
      quantity: Number(quantity),
      costEach: Number(costEach),
      lowQty: Number(lowQty),
      vendor,
      invoiceNumber,
      invoiceDate,
      compatibility: worksWithOthers ? compat : null,
    };
    console.log("Inventory item:", payload);
    toast.success("Inventory item saved.");
  };

  const reset = () => {
    setMake("");
    setPartId("");
    setPartModelId("");
    setGeneration("");
    setModelNumber("");
    setPartNumber("");
    setQuantity("0");
    setCostEach("0.00");
    setLowQty("0");
    setVendor("");
    setInvoiceNumber("");
    setInvoiceDate("");
    setWorksWithOthers(false);
    setCompat({ familyIds: [], brandIds: [], modelIds: [] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <SiteNav />

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add Inventory Item</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter inventory details and optionally map this part to additional compatible devices.
          </p>
        </div>

        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-base">Item Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Row 1 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Make" required>
                <Select value={make} onValueChange={(v) => { setMake(v); setPartId(""); setPartModelId(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select Make" /></SelectTrigger>
                  <SelectContent>
                    {itemBrands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Model">
                <Select value={partModelId} onValueChange={setPartModelId} disabled={!partId}>
                  <SelectTrigger>
                    <SelectValue placeholder={partId ? "Select Model" : "Pick part first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePartModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Generation">
                <Input value={generation} onChange={(e) => setGeneration(e.target.value)} placeholder="Enter Generation" />
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Model Number">
                <Input value={modelNumber} onChange={(e) => setModelNumber(e.target.value)} placeholder="Enter Model Number" />
              </Field>
              <Field label="Part" required>
                <Select value={partId} onValueChange={(v) => { setPartId(v); setPartModelId(""); }} disabled={!make}>
                  <SelectTrigger>
                    <SelectValue placeholder={make ? "Select Part" : "Pick make first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableParts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Part Number">
                <Input value={partNumber} onChange={(e) => setPartNumber(e.target.value)} placeholder="Enter Part Number" />
              </Field>
            </div>

            {/* Row 3 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Quantity" required>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </Field>
              <Field label="Cost Each" required>
                <Input type="number" step="0.01" value={costEach} onChange={(e) => setCostEach(e.target.value)} />
              </Field>
              <Field label="Low Quantity Threshold" required>
                <Input type="number" value={lowQty} onChange={(e) => setLowQty(e.target.value)} />
              </Field>
            </div>

            {/* Row 4 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Vendor" required>
                <Select value={vendor} onValueChange={setVendor}>
                  <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                  <SelectContent>
                    {vendors.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Invoice Number">
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="Enter Invoice Number" />
              </Field>
              <Field label="Invoice Date">
                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </Field>
            </div>

            {/* Compatibility toggle */}
            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <Checkbox
                checked={worksWithOthers}
                onCheckedChange={(c) => setWorksWithOthers(c === true)}
              />
              <span className="text-sm font-semibold">
                Does this part work with other devices?
              </span>
            </label>

            {worksWithOthers && (
              <div className="rounded-md border bg-muted/20 p-4">
                <h3 className="text-sm font-semibold mb-3">Device Compatibility</h3>
                <DeviceCompatibilityPicker value={compat} onChange={setCompat} />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 pb-12">
          <Button variant="outline" onClick={reset} className="gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
