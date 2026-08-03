import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Field } from "@/types/field";
import { FIELD_TYPE_LABEL, FIELD_TYPE_SLUG } from "@/types/field";

export function FieldCard({ field }: { field: Field }) {
  const navigate = useNavigate();
  const slug = FIELD_TYPE_SLUG[field.fieldType] || field.fieldType.toLowerCase();

  const minPrice = field.fieldSlots?.length
    ? Math.min(...field.fieldSlots.map((s) => Number(s.price)))
    : 150000;

  const handleNavigate = () => {
    navigate(`/user/booking/${slug}/${field.fieldId}`);
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden border transition-all hover:border-primary/50 hover:shadow-md"
      onClick={handleNavigate}
    >
      {/* Field Image */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {field.image ? (
          <img
            src={field.image}
            alt={field.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-emerald-950 to-slate-900 p-4 text-center">
            <span className="text-3xl">⚽</span>
            <span className="mt-1 text-xs font-semibold text-emerald-400">{field.name}</span>
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
            {FIELD_TYPE_LABEL[field.fieldType]}
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col gap-2 p-4">
        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
          {field.name}
        </h3>
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {field.description || "Sân bóng cỏ nhân tạo cao cấp, hệ thống chiếu sáng chuẩn thi đấu."}
        </p>
        <div className="mt-1 flex items-center justify-between text-sm">
          <span className="text-xs text-muted-foreground">Giá từ:</span>
          <span className="font-bold text-amber-500">
            {minPrice.toLocaleString("vi-VN")}đ/trận
          </span>
        </div>
      </CardContent>

      <CardFooter className="border-t p-3 bg-muted/20">
        <Button
          variant="outline"
          className="w-full text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
        >
          Xem chi tiết & Đặt sân →
        </Button>
      </CardFooter>
    </Card>
  );
}
