import { Badge } from "@/components/ui/badge";
import { FIELD_TYPE_LABEL } from "@/types/field";
import type { Field } from "@/types/field";

interface FieldHeaderProps {
  name: string;
  description?: string | null;
  fieldType: Field["fieldType"];
}

export function FieldHeader({ name, description, fieldType }: FieldHeaderProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {description ?? "Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng."}
          </p>
        </div>
        <Badge variant="outline">{FIELD_TYPE_LABEL[fieldType]}</Badge>
      </div>
    </div>
  );
}