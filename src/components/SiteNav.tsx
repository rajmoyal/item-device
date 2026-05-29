import { Link } from "@tanstack/react-router";
import { Boxes, Layers, PackagePlus } from "lucide-react";

const links = [
  { to: "/", label: "Device-first", icon: Layers },
  { to: "/item-first", label: "Item-first", icon: Boxes },
  { to: "/inventory", label: "Add Inventory", icon: PackagePlus },
] as const;

export function SiteNav() {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary text-primary-foreground grid place-items-center font-bold">
            S
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">SmartTech</div>
            <div className="text-xs text-muted-foreground">Parts ↔ Devices</div>
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-1.5"
              activeProps={{
                className:
                  "px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground inline-flex items-center gap-1.5",
              }}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
