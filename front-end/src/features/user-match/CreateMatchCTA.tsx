import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CreateMatchCTA() {
  return (
    <Card className="border-border bg-surface text-text-primary">
      <CardContent className="space-y-3 p-4">
        <div>
          <p className="text-sm font-medium text-text-primary">
            Tạo kèo đấu của riêng bạn
          </p>

          <p className="text-xs text-text-muted">
            Rủ đồng đội – Tìm đối thủ – Dễ dàng &amp; nhanh chóng
          </p>
        </div>

        <Button
          className="
            w-full
            bg-brand-primary
            text-white
            hover:bg-brand-primary-hover
          "
        >
          <Plus className="mr-1 h-4 w-4" />
          Tạo kèo ngay
        </Button>
      </CardContent>
    </Card>
  );
}