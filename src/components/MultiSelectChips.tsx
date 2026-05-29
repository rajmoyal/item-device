import { Check } from "lucide-react";

type Option = { id: string; name: string; sublabel?: string };

export function MultiSelectChips({
  options,
  selected,
  onChange,
  emptyMessage,
}: {
  options: Option[];
  selected: string[];
  onChange: (ids: string[]) => void;
  emptyMessage?: string;
}) {
  if (options.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        {emptyMessage ?? "No options available."}
      </p>
    );
  }

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const checked = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => toggle(o.id)}
            className={
              "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors " +
              (checked
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:bg-accent")
            }
          >
            {checked && <Check className="h-3 w-3" />}
            <span>{o.name}</span>
            {o.sublabel && (
              <span className={checked ? "opacity-80" : "text-muted-foreground"}>
                · {o.sublabel}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}