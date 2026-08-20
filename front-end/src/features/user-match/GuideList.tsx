import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GuideItem } from "./types";

interface GuideListProps {
  items: GuideItem[];
}

export function GuideList({ items }: GuideListProps) {
  return (
    <Card className="border-border bg-surface text-text-primary">
      <CardHeader>
        <CardTitle className="text-sm text-text-primary">
          Hướng dẫn
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="
              flex
              items-start
              gap-3
              border-b
              border-border
              pb-3
              last:border-0
              last:pb-0
            "
          >
            <div
              className="
                mt-0.5
                h-5
                w-5
                shrink-0
                rounded-full
                border-2
                border-brand-primary
                bg-brand-primary/10
              "
            />

            <div>
              <p className="text-sm font-medium text-text-primary">
                {item.title}
              </p>

              <p className="text-xs text-text-muted">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}