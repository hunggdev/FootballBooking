// src/components/home/TopBar.tsx
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const notifications = [
  { id: "1", text: "#KH1032 vừa đặt Sân A lúc 18:00-19:00", time: "2 phút trước" },
  { id: "2", text: "#KH0987 vừa giữ chỗ Sân B lúc 20:00-21:00", time: "4 phút trước" },
  { id: "3", text: "#KH1104 vừa xác nhận đặt sân lúc 17:10", time: "" },
];

export function TopBar() {
  return (
    <div className="w-full border-b">
      <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-2 text-xs">
        <Badge variant="outline" className="shrink-0">
          LIVE
        </Badge>
        {notifications.map((item, idx) => (
          <div key={item.id} className="flex shrink-0 items-center gap-4">
            {idx !== 0 && <Separator orientation="vertical" className="h-4" />}
            <span className="whitespace-nowrap">
              {item.text}
              {item.time && <span className="ml-1 opacity-60">{item.time}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
