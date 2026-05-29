import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import type { SavedEntry } from "@/lib/relationship-types";
import { getRelationshipDescription } from "@/lib/compatibility-helper";

export function RelationshipPreview({ entry, index }: { entry: SavedEntry; index: number }) {
  const description = getRelationshipDescription({
    itemPartName: entry.itemPartName,
    itemBrandName: entry.itemBrandName,
    itemPartModelNames: entry.itemPartModelNames,
    modelIds: entry.modelIds,
  });

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Saved entry #{index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
        <Row label="Inventory Item" value={`${entry.itemBrandName} — ${entry.itemPartName}`} />
        <Row label="Inventory Item Part Models" chips={entry.itemPartModelNames} />
        <Row label="Device families" chips={entry.familyNames} />
        <Row label="Device brands" chips={entry.brandNames} />
        <Row label="Device models" chips={entry.modelNames} className="md:col-span-2" />
        {description && (
          <div className="md:col-span-2 border-t border-primary/20 pt-3 mt-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Compatibility Description</div>
            <div className="mt-1 font-medium text-foreground italic">"{description}"</div>
          </div>
        )}
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