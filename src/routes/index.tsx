import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Send, RotateCcw, CheckCircle2 } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MultiSelectChips } from "@/components/MultiSelectChips";
import { RelationshipPreview } from "@/components/RelationshipPreview";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Item ↔ Device Relationships" },
      {
        name: "description",
        content:
          "Map repair parts to device families, brands, and models with a guided multi-step workflow.",
      },
    ],
  }),
  component: Index,
});

const emptyState = {
  familyIds: [] as string[],
  brandIds: [] as string[],
  modelIds: [] as string[],
  selectedPartName: "",
  itemBrandId: "",
  itemPartId: "",
  itemPartModelIds: [] as string[],
};

function Index() {
  const [form, setForm] = useState(emptyState);
  const [savedEntries, setSavedEntries] = useState<SavedEntry[]>([]);

  // ----- Cascading device options -----
  const availableBrands = useMemo(
    () => deviceBrands.filter((b) => form.familyIds.includes(b.familyId)),
    [form.familyIds],
  );

  const brandOptionsWithFamily = useMemo(
    () =>
      availableBrands.map((b) => ({
        id: b.id,
        name: b.name,
        sublabel: deviceFamilies.find((f) => f.id === b.familyId)?.name,
      })),
    [availableBrands],
  );

  const availableModels = useMemo(
    () => deviceModels.filter((m) => form.brandIds.includes(m.brandId)),
    [form.brandIds],
  );

  const modelOptionsWithBrand = useMemo(
    () =>
      availableModels.map((m) => {
        const brand = deviceBrands.find((b) => b.id === m.brandId);
        return { id: m.id, name: m.name, sublabel: brand?.name };
      }),
    [availableModels],
  );

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

  // ----- Cascading cleanup helpers -----
  const setFamilies = (ids: string[]) => {
    const stillValidBrands = form.brandIds.filter((bid) =>
      deviceBrands.some((b) => b.id === bid && ids.includes(b.familyId)),
    );
    const stillValidModels = form.modelIds.filter((mid) =>
      deviceModels.some((m) => m.id === mid && stillValidBrands.includes(m.brandId)),
    );
    setForm({
      ...form,
      familyIds: ids,
      brandIds: stillValidBrands,
      modelIds: stillValidModels,
    });
  };

  const setBrands = (ids: string[]) => {
    const stillValidModels = form.modelIds.filter((mid) =>
      deviceModels.some((m) => m.id === mid && ids.includes(m.brandId)),
    );
    setForm({ ...form, brandIds: ids, modelIds: stillValidModels });
  };

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

  // ----- Validation -----
  const isValid =
    form.familyIds.length > 0 &&
    form.brandIds.length > 0 &&
    form.modelIds.length > 0 &&
    !!form.selectedPartName &&
    !!form.itemBrandId &&
    !!form.itemPartId &&
    form.itemPartModelIds.length > 0;

  const buildEntry = (): SavedEntry => ({
    ...form,
    familyNames: deviceFamilies
      .filter((f) => form.familyIds.includes(f.id))
      .map((f) => f.name),
    brandNames: deviceBrands
      .filter((b) => form.brandIds.includes(b.id))
      .map((b) => `${b.name} (${deviceFamilies.find((f) => f.id === b.familyId)?.name})`),
    modelNames: deviceModels
      .filter((m) => form.modelIds.includes(m.id))
      .map((m) => m.name),
    itemBrandName: itemBrands.find((b) => b.id === form.itemBrandId)?.name ?? "",
    itemPartName: itemParts.find((p) => p.id === form.itemPartId)?.name ?? "",
    itemPartModelNames: itemPartModels
      .filter((m) => form.itemPartModelIds.includes(m.id))
      .map((m) => m.name),
  });

  const handleAddMore = () => {
    if (!isValid) {
      toast.error("Complete every step before adding another entry.");
      return;
    }
    setSavedEntries((prev) => [...prev, buildEntry()]);
    setForm(emptyState);
    toast.success("Entry saved. Start the next one below.");
  };

  const handleSubmit = () => {
    const entries = isValid ? [...savedEntries, buildEntry()] : savedEntries;
    if (entries.length === 0) {
      toast.error("Add at least one complete entry before submitting.");
      return;
    }
    if (!isValid && savedEntries.length === 0) {
      toast.error("Current form is incomplete.");
      return;
    }
    console.log("Submitting relationships:", entries);
    toast.success(`Submitted ${entries.length} relationship${entries.length > 1 ? "s" : ""}.`);
    setSavedEntries([]);
    setForm(emptyState);
  };

  const handleReset = () => {
    setForm(emptyState);
  };

  const lastEntry = savedEntries[savedEntries.length - 1];

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />

      <SiteNav />
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <h2 className="text-2xl font-bold tracking-tight">Device-first workflow</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick devices top-down, then attach a part and its compatible models.
        </p>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        {lastEntry && (
          <RelationshipPreview entry={lastEntry} index={savedEntries.length - 1} />
        )}

        {savedEntries.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            {savedEntries.length} entr{savedEntries.length === 1 ? "y" : "ies"} ready
            to submit.
          </div>
        )}

        {/* Device selection — three cards side by side */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <StepHeader step={1} title="Device families" count={form.familyIds.length} />
              <CardDescription>Pick one or more categories.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <MultiSelectChips
                options={deviceFamilies}
                selected={form.familyIds}
                onChange={setFamilies}
              />
            </CardContent>
          </Card>

          <Card className={"flex flex-col " + (form.familyIds.length === 0 ? "opacity-60" : "")}>
            <CardHeader className="pb-3">
              <StepHeader step={2} title="Device brands" count={form.brandIds.length} />
              <CardDescription>Brands within the selected families.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <MultiSelectChips
                options={brandOptionsWithFamily}
                selected={form.brandIds}
                onChange={setBrands}
                emptyMessage="Select a device family first."
              />
            </CardContent>
          </Card>

          <Card className={"flex flex-col " + (form.brandIds.length === 0 ? "opacity-60" : "")}>
            <CardHeader className="pb-3">
              <StepHeader step={3} title="Device models" count={form.modelIds.length} />
              <CardDescription>Models for the selected brands.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <MultiSelectChips
                options={modelOptionsWithBrand}
                selected={form.modelIds}
                onChange={(ids) => setForm({ ...form, modelIds: ids })}
                emptyMessage="Select a device brand first."
              />
            </CardContent>
          </Card>
        </div>

        {/* Item selection — single row */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory item details</CardTitle>
            <CardDescription>
              Choose the part, then the make, then the compatible models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3 md:items-start">
                <div className="space-y-2">
                  <Label htmlFor="inventory-item-part" className="flex items-center gap-2">
                    <StepDot step={4} />
                    Inventory item part
                  </Label>
                  <Select value={form.selectedPartName} onValueChange={setSelectedPartName}>
                    <SelectTrigger id="inventory-item-part">
                      <SelectValue placeholder="Select a part" />
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

                <div className={"space-y-2 " + (!form.selectedPartName ? "opacity-60" : "")}>
                  <Label htmlFor="inventory-item-make" className="flex items-center gap-2">
                    <StepDot step={5} />
                    Inventory item make
                  </Label>
                  <Select
                    value={form.itemBrandId}
                    onValueChange={setItemBrand}
                    disabled={!form.selectedPartName}
                  >
                    <SelectTrigger id="inventory-item-make">
                      <SelectValue
                        placeholder={
                          form.selectedPartName ? "Select a make" : "Pick a part first"
                        }
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

                <div className={"space-y-2 " + (!form.itemPartId ? "opacity-60" : "")}>
                  <Label className="flex items-center gap-2">
                    <StepDot step={6} />
                    Inventory item part models
                    {form.itemPartModelIds.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {form.itemPartModelIds.length}
                      </Badge>
                    )}
                  </Label>
                  <div className="min-h-[40px] rounded-md border border-input bg-background p-2">
                    <MultiSelectChips
                      options={availablePartModels}
                      selected={form.itemPartModelIds}
                      onChange={(ids) => setForm({ ...form, itemPartModelIds: ids })}
                      emptyMessage={
                        form.itemPartId
                          ? "No models available."
                          : "Pick a part and make first."
                      }
                    />
                  </div>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>


        <div className="flex flex-wrap items-center justify-between gap-3 pb-12">
          <Button variant="ghost" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset form
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleAddMore}
              disabled={!isValid}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add more
            </Button>
            <Button onClick={handleSubmit} className="gap-2">
              <Send className="h-4 w-4" />
              Submit {savedEntries.length + (isValid ? 1 : 0) > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {savedEntries.length + (isValid ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StepDot({ step }: { step: number }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-semibold">
      {step}
    </span>
  );
}

function StepHeader({
  step,
  title,
  count,
}: {
  step: number;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <StepDot step={step} />
      <CardTitle className="text-base">{title}</CardTitle>
      {typeof count === "number" && count > 0 && (
        <Badge variant="secondary">{count}</Badge>
      )}
    </div>
  );
}

