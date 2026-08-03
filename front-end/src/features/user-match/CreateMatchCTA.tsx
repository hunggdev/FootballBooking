import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CreateMatchCTA() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div>
          <p className="text-sm font-medium">Tạo kèo đấu của riêng bạn</p>
          <p className="text-xs text-muted-foreground">
            Rủ đồng đội – Tìm đối thủ – Dễ dàng &amp; nhanh chóng
          </p>
        </div>
        <Button className="w-full">
          <Plus className="mr-1 h-4 w-4" />
          Tạo kèo ngay
        </Button>
      </CardContent>
    </Card>
  );
}
