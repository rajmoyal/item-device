import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import type { SavedEntry } from "@/lib/relationship-types";

export function RelationshipPreview({ entry, index }: { entry: SavedEntry; index: number }) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Saved entry #{index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
        <Row label="Item" value={`${entry.itemBrandName} — ${entry.itemPartName}`} />
        <Row label="Part models" chips={entry.itemPartModelNames} />
        <Row label="Device families" chips={entry.familyNames} />
        <Row label="Device brands" chips={entry.brandNames} />
        <Row label="Device models" chips={entry.modelNames} className="md:col-span-2" />
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  value,
  chips,
  className,
}: {
  label: string;
  value?: string;
  chips?: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      {value && <div className="mt-1 font-medium">{value}</div>}
      {chips && (
        <div className="mt-1 flex flex-wrap gap-1">
          {chips.map((c) => (
            <Badge key={c} variant="secondary" className="font-mono text-[11px]">
              {c}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}