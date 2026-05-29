// Realistic mock data for device ↔ item compatibility mapping.
// Part-model codes follow alphanumeric service-part conventions (e.g. 12QW27A).

export type DeviceFamily = { id: string; name: string };
export type DeviceBrand = { id: string; name: string; familyId: string };
export type DeviceModel = { id: string; name: string; brandId: string };

export type ItemBrand = { id: string; name: string };
export type ItemPart = { id: string; name: string; itemBrandId: string };
export type ItemPartModel = { id: string; name: string; itemPartId: string };

export const deviceFamilies: DeviceFamily[] = [
  { id: "fam-laptop", name: "Laptop" },
  { id: "fam-phone", name: "Phone" },
  { id: "fam-tablet", name: "Tablet" },
  { id: "fam-watch", name: "Smartwatch" },
];

export const deviceBrands: DeviceBrand[] = [
  // Laptop
  { id: "br-apple-lap", name: "Apple", familyId: "fam-laptop" },
  { id: "br-dell-lap", name: "Dell", familyId: "fam-laptop" },
  { id: "br-hp-lap", name: "HP", familyId: "fam-laptop" },
  { id: "br-lenovo-lap", name: "Lenovo", familyId: "fam-laptop" },
  // Phone
  { id: "br-apple-ph", name: "Apple", familyId: "fam-phone" },
  { id: "br-samsung-ph", name: "Samsung", familyId: "fam-phone" },
  { id: "br-google-ph", name: "Google", familyId: "fam-phone" },
  // Tablet
  { id: "br-apple-tab", name: "Apple", familyId: "fam-tablet" },
  { id: "br-samsung-tab", name: "Samsung", familyId: "fam-tablet" },
  // Watch
  { id: "br-apple-w", name: "Apple", familyId: "fam-watch" },
  { id: "br-samsung-w", name: "Samsung", familyId: "fam-watch" },
];

export const deviceModels: DeviceModel[] = [
  // Apple laptops
  { id: "mod-mbp-14-m3", name: 'MacBook Pro 14" M3', brandId: "br-apple-lap" },
  { id: "mod-mbp-16-m3", name: 'MacBook Pro 16" M3', brandId: "br-apple-lap" },
  { id: "mod-mba-13-m2", name: 'MacBook Air 13" M2', brandId: "br-apple-lap" },
  { id: "mod-mba-15-m3", name: 'MacBook Air 15" M3', brandId: "br-apple-lap" },
  { id: "mod-mba-intel", name: "MacBook Air Intel (A1932)", brandId: "br-apple-lap" },
  // Dell
  { id: "mod-dell-xps13", name: "XPS 13 9340", brandId: "br-dell-lap" },
  { id: "mod-dell-xps15", name: "XPS 15 9530", brandId: "br-dell-lap" },
  { id: "mod-dell-lat", name: "Latitude 7440", brandId: "br-dell-lap" },
  // HP
  { id: "mod-hp-spec", name: "Spectre x360 14", brandId: "br-hp-lap" },
  { id: "mod-hp-eb", name: "EliteBook 840 G10", brandId: "br-hp-lap" },
  // Lenovo
  { id: "mod-lenovo-x1", name: "ThinkPad X1 Carbon Gen 11", brandId: "br-lenovo-lap" },
  { id: "mod-lenovo-yoga", name: "Yoga Slim 7i", brandId: "br-lenovo-lap" },
  // Apple phones
  { id: "mod-ip15", name: "iPhone 15", brandId: "br-apple-ph" },
  { id: "mod-ip15p", name: "iPhone 15 Pro", brandId: "br-apple-ph" },
  { id: "mod-ip15pm", name: "iPhone 15 Pro Max", brandId: "br-apple-ph" },
  { id: "mod-ip14", name: "iPhone 14", brandId: "br-apple-ph" },
  { id: "mod-ip13", name: "iPhone 13", brandId: "br-apple-ph" },
  // Samsung phones
  { id: "mod-s24", name: "Galaxy S24", brandId: "br-samsung-ph" },
  { id: "mod-s24u", name: "Galaxy S24 Ultra", brandId: "br-samsung-ph" },
  { id: "mod-s23", name: "Galaxy S23", brandId: "br-samsung-ph" },
  { id: "mod-zflip5", name: "Galaxy Z Flip 5", brandId: "br-samsung-ph" },
  // Google phones
  { id: "mod-px8", name: "Pixel 8", brandId: "br-google-ph" },
  { id: "mod-px8p", name: "Pixel 8 Pro", brandId: "br-google-ph" },
  // Tablets
  { id: "mod-ipad-pro13", name: 'iPad Pro 13" M4', brandId: "br-apple-tab" },
  { id: "mod-ipad-air11", name: 'iPad Air 11" M2', brandId: "br-apple-tab" },
  { id: "mod-ipad-10", name: "iPad (10th gen)", brandId: "br-apple-tab" },
  { id: "mod-tab-s9", name: "Galaxy Tab S9", brandId: "br-samsung-tab" },
  { id: "mod-tab-s9u", name: "Galaxy Tab S9 Ultra", brandId: "br-samsung-tab" },
  // Watches
  { id: "mod-aw-s9", name: "Apple Watch Series 9 45mm", brandId: "br-apple-w" },
  { id: "mod-aw-ult2", name: "Apple Watch Ultra 2", brandId: "br-apple-w" },
  { id: "mod-watch6", name: "Galaxy Watch 6 44mm", brandId: "br-samsung-w" },
];

// ---- Items (parts inventory) ----

export const itemBrands: ItemBrand[] = [
  { id: "ib-oem-apple", name: "Apple OEM" },
  { id: "ib-oem-samsung", name: "Samsung OEM" },
  { id: "ib-ifixit", name: "iFixit" },
  { id: "ib-aftermarket", name: "Aftermarket Pro" },
  { id: "ib-spigen", name: "Spigen" },
];

export const itemParts: ItemPart[] = [
  // Apple OEM
  { id: "p-apl-kbd", name: "Keyboard", itemBrandId: "ib-oem-apple" },
  { id: "p-apl-bat", name: "Battery", itemBrandId: "ib-oem-apple" },
  { id: "p-apl-disp", name: "Display Assembly", itemBrandId: "ib-oem-apple" },
  { id: "p-apl-cam", name: "Camera", itemBrandId: "ib-oem-apple" },
  { id: "p-apl-port", name: "Charging Port", itemBrandId: "ib-oem-apple" },
  // Samsung OEM
  { id: "p-sam-disp", name: "Display Assembly", itemBrandId: "ib-oem-samsung" },
  { id: "p-sam-bat", name: "Battery", itemBrandId: "ib-oem-samsung" },
  { id: "p-sam-cam", name: "Camera", itemBrandId: "ib-oem-samsung" },
  // iFixit
  { id: "p-if-kit", name: "Repair Kit", itemBrandId: "ib-ifixit" },
  { id: "p-if-bat", name: "Battery", itemBrandId: "ib-ifixit" },
  // Aftermarket
  { id: "p-af-disp", name: "Display Assembly", itemBrandId: "ib-aftermarket" },
  { id: "p-af-kbd", name: "Keyboard", itemBrandId: "ib-aftermarket" },
  // Spigen
  { id: "p-sp-sp", name: "Screen Protector", itemBrandId: "ib-spigen" },
  { id: "p-sp-case", name: "Case", itemBrandId: "ib-spigen" },
];

export const itemPartModels: ItemPartModel[] = [
  // Apple Keyboard
  { id: "pm-12QW27A", name: "12QW27A", itemPartId: "p-apl-kbd" },
  { id: "pm-12QW28B", name: "12QW28B", itemPartId: "p-apl-kbd" },
  { id: "pm-A2681K", name: "A2681-KBD", itemPartId: "p-apl-kbd" },
  // Apple Battery
  { id: "pm-A2389B", name: "A2389-BAT", itemPartId: "p-apl-bat" },
  { id: "pm-A2618B", name: "A2618-BAT", itemPartId: "p-apl-bat" },
  { id: "pm-A2780B", name: "A2780-BAT", itemPartId: "p-apl-bat" },
  // Apple Display
  { id: "pm-LCD15PM", name: "LCD-15PM-OEM", itemPartId: "p-apl-disp" },
  { id: "pm-LCD14PR", name: "LCD-14PR-OEM", itemPartId: "p-apl-disp" },
  { id: "pm-OLED13", name: "OLED-13M2-A", itemPartId: "p-apl-disp" },
  // Apple Camera
  { id: "pm-CAM48F", name: "CAM-48F-PRO", itemPartId: "p-apl-cam" },
  { id: "pm-CAM12U", name: "CAM-12U-STD", itemPartId: "p-apl-cam" },
  // Apple Port
  { id: "pm-USBC01", name: "USBC-01-A", itemPartId: "p-apl-port" },
  { id: "pm-LTNG07", name: "LTNG-07-B", itemPartId: "p-apl-port" },
  // Samsung display
  { id: "pm-S24DISP", name: "S24-DISP-OEM", itemPartId: "p-sam-disp" },
  { id: "pm-S24UDISP", name: "S24U-DISP-OEM", itemPartId: "p-sam-disp" },
  { id: "pm-TABS9D", name: "TABS9-DISP", itemPartId: "p-sam-disp" },
  // Samsung battery
  { id: "pm-EB-BS918", name: "EB-BS918ABY", itemPartId: "p-sam-bat" },
  { id: "pm-EB-BS921", name: "EB-BS921ABY", itemPartId: "p-sam-bat" },
  // Samsung camera
  { id: "pm-CAM200S24", name: "CAM-200-S24U", itemPartId: "p-sam-cam" },
  // iFixit
  { id: "pm-IF-PRO64", name: "IF-PRO-64BIT", itemPartId: "p-if-kit" },
  { id: "pm-IF-MAC18", name: "IF-MAC-18PC", itemPartId: "p-if-kit" },
  { id: "pm-IFBAT-IP15", name: "IFBAT-IP15", itemPartId: "p-if-bat" },
  { id: "pm-IFBAT-IP14", name: "IFBAT-IP14", itemPartId: "p-if-bat" },
  // Aftermarket
  { id: "pm-AM-DISP15", name: "AM-DISP-15PM", itemPartId: "p-af-disp" },
  { id: "pm-AM-DISP14", name: "AM-DISP-14", itemPartId: "p-af-disp" },
  { id: "pm-AM-KBD-MBP", name: "AM-KBD-MBP14", itemPartId: "p-af-kbd" },
  // Spigen
  { id: "pm-SP-GLAStR", name: "GLAStR-EZ-FIT", itemPartId: "p-sp-sp" },
  { id: "pm-SP-NEOFL", name: "NEO-FLEX-HD", itemPartId: "p-sp-sp" },
  { id: "pm-SP-PRVCY", name: "PRIVACY-GLAS", itemPartId: "p-sp-sp" },
  { id: "pm-SP-TGHARM", name: "TOUGH-ARMOR-MG", itemPartId: "p-sp-case" },
  { id: "pm-SP-ULTHY", name: "ULTRA-HYBRID-S", itemPartId: "p-sp-case" },
];
