import { Badge } from "@/components/ui/badge";
import { FIELD_TYPE_LABEL } from "@/types/field";
import type { Field } from "@/types/field";

interface FieldHeaderProps {
  name: string;
  description?: string | null;
  fieldType: Field["fieldType"];
}

export function FieldHeader({
  name,
  description,
  fieldType,
}: FieldHeaderProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {name}
          </h1>

          <p className="mt-1 text-sm text-text-secondary">
            {description ??
              "Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng."}
          </p>
        </div>

        <Badge
          variant="outline"
          className="border-brand-primary/40 bg-brand-primary/10 text-brand-primary"
        >
          {FIELD_TYPE_LABEL[fieldType]}
        </Badge>
      </div>
    </div>
  );
}