import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Field } from "@/types/field";
import { FIELD_TYPE_LABEL, FIELD_TYPE_SLUG } from "@/types/field";

export function FieldCard({ field }: { field: Field }) {
  const navigate = useNavigate();

  const slug =
    FIELD_TYPE_SLUG[field.fieldType] ||
    field.fieldType.toLowerCase();

  const minPrice = field.fieldSlots?.length
    ? Math.min(...field.fieldSlots.map((s) => Number(s.price)))
    : 150000;

  const handleNavigate = () => {
    navigate(`/user/booking/${slug}/${field.fieldId}`);
  };

  return (
    <Card
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-xl
        border-border
        bg-surface
        text-text-primary
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-brand-primary/60
        hover:bg-surface-hover
        hover:shadow-lg
        hover:shadow-black/20
      "
      onClick={handleNavigate}
    >
      {/* ================= IMAGE ================= */}
      <div className="relative h-44 w-full overflow-hidden bg-surface-hover">
        {field.image ? (
          <img
            src={field.image}
            alt={field.name}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              w-full
              flex-col
              items-center
              justify-center
              bg-gradient-to-br
              from-elevated
              to-deep
              p-4
              text-center
            "
          >
            <span className="text-4xl opacity-90">⚽</span>

            <span
              className="
                mt-2
                text-xs
                font-semibold
                text-text-secondary
              "
            >
              {field.name}
            </span>
          </div>
        )}

        {/* Overlay nhẹ */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-black/40
            via-transparent
            to-transparent
          "
        />

        {/* Field type */}
        <div className="absolute right-3 top-3">
          <Badge
            className="
              border-0
              bg-brand-primary
              px-2.5
              py-1
              text-xs
              font-semibold
              text-white
              shadow-md
              hover:bg-brand-primary-hover
            "
          >
            {FIELD_TYPE_LABEL[field.fieldType]}
          </Badge>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <CardContent className="flex flex-col gap-2.5 p-4">
        {/* Name */}
        <h3
          className="
            line-clamp-1
            text-base
            font-bold
            text-text-primary
            transition-colors
            duration-200
            group-hover:text-brand-primary
          "
        >
          {field.name}
        </h3>

        {/* Description */}
        <p
          className="
            line-clamp-2
            min-h-9
            text-xs
            leading-5
            text-text-secondary
          "
        >
          {field.description ||
            "Sân bóng cỏ nhân tạo cao cấp, hệ thống chiếu sáng chuẩn thi đấu."}
        </p>

        {/* Price */}
        <div
          className="
            mt-1
            flex
            items-end
            justify-between
            gap-2
            border-t
            border-border-subtle
            pt-3
          "
        >
          <span className="text-xs text-text-muted">
            Giá từ
          </span>

          <span className="text-sm font-bold text-brand-accent">
            {minPrice.toLocaleString("vi-VN")}đ
            <span className="ml-1 text-[11px] font-medium text-text-muted">
              /trận
            </span>
          </span>
        </div>
      </CardContent>

      {/* ================= FOOTER ================= */}
      <CardFooter
        className="
          border-t
          border-border-subtle
          bg-deep/40
          p-3
        "
      >
        <Button
          variant="outline"
          className="
            w-full
            border-border
            bg-surface
            text-xs
            font-semibold
            text-text-primary
            transition-all
            duration-200
            hover:border-brand-primary
            hover:bg-brand-primary
            hover:text-white
            group-hover:border-brand-primary/70
          "
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
        >
          Xem chi tiết & Đặt sân
          <span className="ml-1.5 text-brand-accent">
            →
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}