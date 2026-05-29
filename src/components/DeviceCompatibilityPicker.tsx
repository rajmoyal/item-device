import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelectChips } from "@/components/MultiSelectChips";
import { deviceFamilies, deviceBrands, deviceModels } from "@/lib/mock-data";

export type CompatibilityValue = {
  familyIds: string[];
  brandIds: string[];
  modelIds: string[];
};

export function DeviceCompatibilityPicker({
  value,
  onChange,
}: {
  value: CompatibilityValue;
  onChange: (v: CompatibilityValue) => void;
}) {
  const setFamilies = (familyIds: string[]) => {
    const brandIds = value.brandIds.filter((bid) =>
      deviceBrands.some((b) => b.id === bid && familyIds.includes(b.familyId)),
    );
    const modelIds = value.modelIds.filter((mid) =>
      deviceModels.some((m) => m.id === mid && brandIds.includes(m.brandId)),
    );
    onChange({ familyIds, brandIds, modelIds });
  };

  const setBrands = (brandIds: string[]) => {
    const modelIds = value.modelIds.filter((mid) =>
      deviceModels.some((m) => m.id === mid && brandIds.includes(m.brandId)),
    );
    onChange({ ...value, brandIds, modelIds });
  };

  const toggleModel = (id: string) =>
    onChange({
      ...value,
      modelIds: value.modelIds.includes(id)
        ? value.modelIds.filter((x) => x !== id)
        : [...value.modelIds, id],
    });

  const selectedFamilies = useMemo(
    () => deviceFamilies.filter((f) => value.familyIds.includes(f.id)),
    [value.familyIds],
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Device Families</Label>
        <div className="rounded-md border bg-background p-2 min-h-[42px]">
          <MultiSelectChips
            options={deviceFamilies}
            selected={value.familyIds}
            onChange={setFamilies}
            emptyMessage="Select one or more device families."
          />
        </div>
      </div>

      {selectedFamilies.map((family) => {
        const familyBrands = deviceBrands.filter((b) => b.familyId === family.id);
        const selectedFamilyBrands = familyBrands.filter((b) => value.brandIds.includes(b.id));

        return (
          <div key={family.id} className="rounded-md border bg-card p-3 space-y-3">
            <div className="font-semibold text-sm">{family.name}</div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Device Brand</Label>
              <div className="rounded-md border bg-background p-2 min-h-[42px]">
                <MultiSelectChips
                  options={familyBrands}
                  selected={value.brandIds}
                  onChange={(ids) => {
                    const others = value.brandIds.filter(
                      (id) => !familyBrands.some((b) => b.id === id),
                    );
                    setBrands([
                      ...others,
                      ...ids.filter((id) => familyBrands.some((b) => b.id === id)),
                    ]);
                  }}
                  emptyMessage="No brands."
                />
              </div>
            </div>

            {selectedFamilyBrands.map((brand) => {
              const brandModels = deviceModels.filter((m) => m.brandId === brand.id);
              return (
                <div key={brand.id} className="space-y-1.5">
                  <div className="text-sm font-medium">{brand.name}</div>
                  {brandModels.length === 0 ? (
                    <p className="text-xs italic text-muted-foreground">No models.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {brandModels.map((m) => {
                        const checked = value.modelIds.includes(m.id);
                        return (
                          <label
                            key={m.id}
                            className={
                              "flex items-center gap-1.5 rounded border px-2 py-1 text-xs cursor-pointer transition-colors " +
                              (checked
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-accent")
                            }
                          >
                            <Checkbox checked={checked} onCheckedChange={() => toggleModel(m.id)} />
                            <span>{m.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
