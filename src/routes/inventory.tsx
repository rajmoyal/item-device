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
  const [selectedPartName, setSelectedPartName] = useState("");
  const [make, setMake] = useState(""); // This is itemBrandId
  const [partId, setPartId] = useState("");
  const [partModelId, setPartModelId] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [costEach, setCostEach] = useState("0.00");
  const [isSalvage, setIsSalvage] = useState("");
  const [vendor, setVendor] = useState("");
  const [location, setLocation] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [worksWithOthers, setWorksWithOthers] = useState(false);
  const [compat, setCompat] = useState<CompatibilityValue>({
    familyIds: [],
    brandIds: [],
    modelIds: [],
  });

  // ----- Cascading item options (Part first, then Make, then Models) -----
  const uniquePartNames = useMemo(() => {
    const names = itemParts.map((p) => p.name);
    return Array.from(new Set(names));
  }, []);

  const availableItemMakes = useMemo(() => {
    if (!selectedPartName) return [];
    const matchingParts = itemParts.filter((p) => p.name === selectedPartName);
    const brandIds = Array.from(new Set(matchingParts.map((p) => p.itemBrandId)));
    return itemBrands.filter((b) => brandIds.includes(b.id));
  }, [selectedPartName]);

  const availablePartModels = useMemo(() => {
    if (!partId) return [];
    return itemPartModels.filter((m) => m.itemPartId === partId);
  }, [partId]);

  const handleSelectedPartNameChange = (name: string) => {
    setSelectedPartName(name);
    setMake("");
    setPartId("");
    setPartModelId("");
  };

  const handleMakeChange = (brandId: string) => {
    setMake(brandId);
    const matchedPart = itemParts.find(
      (p) => p.name === selectedPartName && p.itemBrandId === brandId
    );
    if (matchedPart) {
      setPartId(matchedPart.id);
    } else {
      setPartId("");
    }
    setPartModelId("");
  };

  const handleSave = () => {
    if (!selectedPartName || !make || !partId || !quantity || !costEach || !vendor || !isSalvage) {
      toast.error("Please fill all required fields.");
      return;
    }
    const payload = {
      make,
      partId,
      partModelId,
      partNumber,
      quantity: Number(quantity),
      costEach: Number(costEach),
      isSalvage: isSalvage === "Yes",
      vendor,
      location,
      lowQty: 5, // Read-only info quantity threshold
      invoiceNumber,
      invoiceDate,
      compatibility: worksWithOthers ? compat : null,
    };
    console.log("Inventory item:", payload);
    toast.success("Inventory item saved.");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const reset = () => {
    setSelectedPartName("");
    setMake("");
    setPartId("");
    setPartModelId("");
    setPartNumber("");
    setQuantity("0");
    setCostEach("0.00");
    setIsSalvage("");
    setVendor("");
    setLocation("");
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
            <CardTitle className="text-base">Inventory item details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Row 1 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Inventory item part" required>
                <Select value={selectedPartName} onValueChange={handleSelectedPartNameChange}>
                  <SelectTrigger><SelectValue placeholder="Select Part" /></SelectTrigger>
                  <SelectContent>
                    {uniquePartNames.map((name) => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Inventory item make" required>
                <Select value={make} onValueChange={handleMakeChange} disabled={!selectedPartName}>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedPartName ? "Select Make" : "Pick part first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableItemMakes.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Inventory item model">
                <Select value={partModelId} onValueChange={setPartModelId} disabled={!partId}>
                  <SelectTrigger>
                    <SelectValue placeholder={partId ? "Select Model" : "Pick make first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePartModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Part Number">
                <Input value={partNumber} onChange={(e) => setPartNumber(e.target.value)} placeholder="Enter Part Number" />
              </Field>
              <Field label="Quantity" required>
                <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </Field>
              <Field label="Cost Each" required>
                <Input type="number" step="0.01" value={costEach} onChange={(e) => setCostEach(e.target.value)} />
              </Field>
            </div>

            {/* Row 3 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Is this salvage part or not?" required>
                <Select value={isSalvage} onValueChange={setIsSalvage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Vendor" required>
                <Select value={vendor} onValueChange={setVendor}>
                  <SelectTrigger><SelectValue placeholder="Select Vendor" /></SelectTrigger>
                  <SelectContent>
                    {vendors.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Location #">
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="A-1" />
              </Field>
            </div>

            {/* Row 4 */}
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Invoice Number">
                <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="Enter Invoice Number" />
              </Field>
              <Field label="Invoice Date">
                <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </Field>
              <div />
            </div>

            {/* Low Quantity Threshold Info Banner */}
            {selectedPartName && make && partModelId && (
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-foreground transition-all duration-300">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold font-mono">
                  i
                </div>
                <div>
                  <span className="font-semibold text-primary">Low Quantity Threshold:</span> The threshold for {selectedPartName.toLowerCase()} with {itemBrands.find((b) => b.id === make)?.name ?? ""} make with {itemPartModels.find((m) => m.id === partModelId)?.name ?? ""} model is 5.
                </div>
              </div>
            )}

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
