import { deviceModels, deviceBrands, deviceFamilies } from "./mock-data";

export function formatList(list: string[], connector = "and"): string {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} ${connector} ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, ${connector} ${list[list.length - 1]}`;
}

export function getRelationshipDescription(entry: {
  itemPartName?: string;
  itemBrandName?: string;
  itemPartModelNames?: string[];
  modelIds?: string[];
}): string {
  const partName = entry.itemPartName || "";
  const brandName = entry.itemBrandName || "";
  const modelNames = entry.itemPartModelNames || [];
  const modelIds = entry.modelIds || [];

  if (!partName && !brandName && modelNames.length === 0 && modelIds.length === 0) {
    return "";
  }

  // 1. Format inventory item models
  const modelLabel = modelNames.length > 1 ? "models" : "model";
  const formattedModels = modelNames.length > 0 ? `${modelLabel} ${formatList(modelNames, "and")}` : "";

  // 2. Format device compatibility strings (e.g., Apple MacBook Air 15" M3 Laptop)
  const deviceStrings = modelIds
    .map((id) => {
      const model = deviceModels.find((m) => m.id === id);
      if (!model) return "";
      const brand = deviceBrands.find((b) => b.id === model.brandId);
      const family = deviceFamilies.find((f) => f.id === brand?.familyId);
      const bName = brand ? brand.name : "";
      const mName = model.name;
      const fName = family ? family.name : "";

      // Avoid repeating brand name if it's already in the model name
      const cleanModelName = mName.toLowerCase().startsWith(bName.toLowerCase())
        ? mName
        : `${bName} ${mName}`;

      return `${cleanModelName} ${fName}`.trim();
    })
    .filter(Boolean);

  const formattedDevices = deviceStrings.length > 0 ? formatList(deviceStrings, "and") : "";

  // 3. Assemble the sentence:
  // "[Part] of [Make] make with [models] can be used with the [devices]"
  const partSegment = partName ? `${partName}` : "Inventory item";
  const makeSegment = brandName ? `of ${brandName} make` : "of unknown make";
  const modelSegment = formattedModels ? `with ${formattedModels}` : "";
  const canBeUsedSegment = formattedDevices ? `can be used with the ${formattedDevices}` : "";

  const finalSentence = `${partSegment} ${makeSegment} ${modelSegment} ${canBeUsedSegment}`.replace(/\s+/g, " ").trim();
  
  if (finalSentence.endsWith(".")) return finalSentence;
  return `${finalSentence}.`;
}
