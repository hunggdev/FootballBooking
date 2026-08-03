import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, ShieldCheck } from "lucide-react";
import type { Review } from "@/types/review";
import dayjs from "dayjs";

export function TestimonialCard({ review }: { review: Review }) {
  const userName = review.user?.fullName || "Khách hàng";
  const dateStr = review.createdAt ? dayjs(review.createdAt).format("DD/MM/YYYY") : "";
  const fieldName = review.field?.name;

  return (
    <Card className="border shadow-sm flex flex-col justify-between hover:border-emerald-500/30 transition-all">
      <CardHeader className="flex flex-row items-center gap-3 p-4 border-b bg-muted/10">
        <Avatar className="h-9 w-9 border border-emerald-500/30">
          <AvatarFallback className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            {userName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate">{userName}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {fieldName && <span className="font-medium text-emerald-500 truncate">{fieldName}</span>}
            {fieldName && <span>•</span>}
            <span>{dateStr}</span>
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3.5 w-3.5 ${
                star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2 flex-1">
        <p className="text-sm text-foreground/90 italic">
          "{review.comment || "Sân bóng chất lượng tuyệt vời, phục vụ chu đáo."}"
        </p>

        {review.reply && (
          <div className="mt-2 rounded-md border border-primary/20 bg-primary/5 p-2 text-xs">
            <p className="flex items-center gap-1 font-bold text-primary mb-0.5 text-[11px]">
              <ShieldCheck className="h-3 w-3" /> Phản hồi từ Quản lý sân:
            </p>
            <p className="text-muted-foreground text-[11px]">{review.reply}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
