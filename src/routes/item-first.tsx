import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Send, RotateCcw, CheckCircle2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RelationshipPreview } from "@/components/RelationshipPreview";
import {
  DeviceCompatibilityPicker,
  type CompatibilityValue,
} from "@/components/DeviceCompatibilityPicker";
import {
  deviceFamilies,
  deviceBrands,
  deviceModels,
  itemBrands,
  itemParts,
  itemPartModels,
} from "@/lib/mock-data";
import type { SavedEntry } from "@/lib/relationship-types";
import { getRelationshipDescription } from "@/lib/compatibility-helper";

export const Route = createFileRoute("/item-first")({
  head: () => ({
    meta: [
      { title: "Item-first — Item ↔ Device Relationships" },
      {
        name: "description",
        content:
          "Pick the item make and part first, then attach compatible device families, brands, and models.",
      },
    ],
  }),
  component: ItemFirstPage,
});

type Form = {
  selectedPartName: string;
  itemBrandId: string;
  itemPartId: string;
  itemPartModelIds: string[];
  compat: CompatibilityValue;
};

const empty: Form = {
  selectedPartName: "",
  itemBrandId: "",
  itemPartId: "",
  itemPartModelIds: [],
  compat: { familyIds: [], brandIds: [], modelIds: [] },
};

function ItemFirstPage() {
  const [form, setForm] = useState<Form>(empty);
  const [saved, setSaved] = useState<SavedEntry[]>([]);

  // ----- Cascading item options (Part first, then Make, then Models) -----
  const uniquePartNames = useMemo(() => {
    const names = itemParts.map((p) => p.name);
    return Array.from(new Set(names));
  }, []);

  const availableItemMakes = useMemo(() => {
    if (!form.selectedPartName) return [];
    const matchingParts = itemParts.filter((p) => p.name === form.selectedPartName);
    const brandIds = Array.from(new Set(matchingParts.map((p) => p.itemBrandId)));
    return itemBrands.filter((b) => brandIds.includes(b.id));
  }, [form.selectedPartName]);

  const availablePartModels = useMemo(() => {
    if (!form.itemPartId) return [];
    return itemPartModels.filter((m) => m.itemPartId === form.itemPartId);
  }, [form.itemPartId]);

  const setSelectedPartName = (name: string) => {
    setForm({
      ...form,
      selectedPartName: name,
      itemBrandId: "",
      itemPartId: "",
      itemPartModelIds: [],
    });
  };

  const setItemBrand = (brandId: string) => {
    const matchedPart = itemParts.find(
      (p) => p.name === form.selectedPartName && p.itemBrandId === brandId
    );
    setForm({
      ...form,
      itemBrandId: brandId,
      itemPartId: matchedPart ? matchedPart.id : "",
      itemPartModelIds: [],
    });
  };

  const togglePartModel = (id: string) =>
    setForm({
      ...form,
      itemPartModelIds: form.itemPartModelIds.includes(id)
        ? form.itemPartModelIds.filter((x) => x !== id)
        : [...form.itemPartModelIds, id],
    });

  const isValid =
    !!form.selectedPartName &&
    !!form.itemBrandId &&
    !!form.itemPartId &&
    form.itemPartModelIds.length > 0 &&
    form.compat.familyIds.length > 0 &&
    form.compat.brandIds.length > 0 &&
    form.compat.modelIds.length > 0;

  const buildEntry = (): SavedEntry => ({
    familyIds: form.compat.familyIds,
    brandIds: form.compat.brandIds,
    modelIds: form.compat.modelIds,
    itemBrandId: form.itemBrandId,
    itemPartId: form.itemPartId,
    itemPartModelIds: form.itemPartModelIds,
    familyNames: deviceFamilies
      .filter((f) => form.compat.familyIds.includes(f.id))
      .map((f) => f.name),
    brandNames: deviceBrands
      .filter((b) => form.compat.brandIds.includes(b.id))
      .map((b) => `${b.name} (${deviceFamilies.find((f) => f.id === b.familyId)?.name})`),
    modelNames: deviceModels
      .filter((m) => form.compat.modelIds.includes(m.id))
      .map((m) => m.name),
    itemBrandName: itemBrands.find((b) => b.id === form.itemBrandId)?.name ?? "",
    itemPartName: itemParts.find((p) => p.id === form.itemPartId)?.name ?? "",
    itemPartModelNames: itemPartModels
      .filter((m) => form.itemPartModelIds.includes(m.id))
      .map((m) => m.name),
  });

  const handleAddMore = () => {
    if (!isValid) {
      toast.error("Complete the form before adding another entry.");
      return;
    }
    setSaved((prev) => [...prev, buildEntry()]);
    setForm(empty);
    toast.success("Entry saved.");
  };

  const handleSubmit = () => {
    const entries = isValid ? [...saved, buildEntry()] : saved;
    if (entries.length === 0) {
      toast.error("Add at least one complete entry.");
      return;
    }
    console.log("Submitting (item-first):", entries);
    toast.success(`Submitted ${entries.length} relationship${entries.length > 1 ? "s" : ""}.`);
    setSaved([]);
    setForm(empty);
  };

  const last = saved[saved.length - 1];

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      <SiteNav />

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Item-first workflow</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the item first, then map it to compatible devices.
          </p>
        </div>

        {last && <RelationshipPreview entry={last} index={saved.length - 1} />}
        {saved.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {saved.length} entr{saved.length === 1 ? "y" : "ies"} ready to submit.
          </div>
        )}

        {/* Item selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory item details</CardTitle>
            <CardDescription>Select the part, the make, and the compatible models.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Inventory item part</Label>
                  <Select value={form.selectedPartName} onValueChange={setSelectedPartName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select part" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniquePartNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Inventory item make</Label>
                  <Select
                    value={form.itemBrandId}
                    onValueChange={setItemBrand}
                    disabled={!form.selectedPartName}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={form.selectedPartName ? "Select make" : "Pick part first"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableItemMakes.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>
                    Inventory item part models
                    {form.itemPartModelIds.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {form.itemPartModelIds.length}
                      </Badge>
                    )}
                  </Label>
                  <div className="rounded-md border bg-background p-2 min-h-[40px] flex flex-wrap gap-1.5">
                    {!form.itemPartId && (
                      <p className="text-sm italic text-muted-foreground">
                        Pick a part and make first.
                      </p>
                    )}
                    {form.itemPartId && availablePartModels.length === 0 && (
                      <p className="text-sm italic text-muted-foreground">No models.</p>
                    )}
                    {availablePartModels.map((m) => {
                      const checked = form.itemPartModelIds.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => togglePartModel(m.id)}
                          className={
                            "rounded-full border px-2.5 py-1 text-xs font-mono transition-colors " +
                            (checked
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background hover:bg-accent")
                          }
                        >
                          {m.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Brand & Model Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Device Brand &amp; Model Selection</CardTitle>
            <CardDescription>
              Add the device families, brands, and specific models this item supports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DeviceCompatibilityPicker
              value={form.compat}
              onChange={(compat) => setForm({ ...form, compat })}
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3 pb-12">
          <Button variant="ghost" onClick={() => setForm(empty)} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleAddMore} disabled={!isValid} className="gap-2">
              <Plus className="h-4 w-4" />
              Add more
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Submit
              {saved.length + (isValid ? 1 : 0) > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {saved.length + (isValid ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
