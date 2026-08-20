import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Calendar, Search, ShieldCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { useFields } from "@/stores/useFieldStore";
import {
  FIELD_TYPE_LABEL,
  FIELD_TYPE_SLUG,
} from "@/types/field";

export function HeroSearchForm() {
  const navigate = useNavigate();
  const { data: fields } = useFields();

  const [selectedFieldId, setSelectedFieldId] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format("YYYY-MM-DD")
  );

  const handleSearch = () => {
    if (selectedFieldId !== "ALL") {
      const field = fields?.find(
        (f) => f.fieldId === Number(selectedFieldId)
      );

      if (field) {
        const slug =
          FIELD_TYPE_SLUG[field.fieldType] ||
          field.fieldType.toLowerCase();

        navigate(
          `/user/booking/${slug}/${field.fieldId}?date=${selectedDate}`
        );

        return;
      }
    }

    const typeQuery =
      selectedType !== "ALL"
        ? `&type=${selectedType}`
        : "";

    navigate(
      `/user/booking?date=${selectedDate}${typeQuery}`
    );
  };

  return (
    <Card
      className="
        overflow-hidden
        rounded-xl
        border-border
        bg-surface
        text-text-primary
        shadow-xl
        shadow-black/20
      "
    >
      {/* ================= HEADER ================= */}
      <CardHeader
        className="
          border-b
          border-border-subtle
          bg-surface-hover/50
          px-5
          py-4
        "
      >
        <CardTitle
          className="
            flex
            items-center
            gap-2.5
            text-lg
            font-bold
            text-text-primary
          "
        >
          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              bg-status-success-bg
            "
          >
            <Search className="h-4 w-4 text-brand-primary" />
          </span>

          Đặt sân ngay
        </CardTitle>

        <p className="mt-1 text-xs text-text-muted">
          Tìm sân phù hợp và đặt lịch nhanh chóng
        </p>
      </CardHeader>

      {/* ================= CONTENT ================= */}
      <CardContent className="flex flex-col gap-5 p-5">
        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="booking-date"
            className="
              flex
              items-center
              gap-1.5
              text-xs
              font-semibold
              text-text-primary
            "
          >
            <Calendar className="h-3.5 w-3.5 text-brand-primary" />
            Ngày đặt sân
          </Label>

          <input
            id="booking-date"
            type="date"
            value={selectedDate}
            min={dayjs().format("YYYY-MM-DD")}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDate(e.target.value);
              }
            }}
            className="
              h-10
              w-full
              rounded-md
              border
              border-border
              bg-deep
              px-3
              text-xs
              font-medium
              text-text-primary
              outline-none
              transition-colors
              hover:border-brand-primary/50
              focus:border-brand-primary
              focus:ring-2
              focus:ring-brand-primary/20
            "
          />
        </div>

        {/* Field Type */}
        <div className="flex flex-col gap-2">
          <Label
            className="
              text-xs
              font-semibold
              text-text-primary
            "
          >
            Loại sân bóng
          </Label>

          <Select
            value={selectedType}
            onValueChange={(val) => {
              if (val) setSelectedType(val);
            }}
          >
            <SelectTrigger
              className="
                h-10
                border-border
                bg-deep
                text-xs
                font-medium
                text-text-primary
                hover:border-brand-primary/50
                focus:border-brand-primary
                focus:ring-brand-primary/20
              "
            >
              <SelectValue placeholder="Tất cả loại sân" />
            </SelectTrigger>

            <SelectContent
              className="
                border-border
                bg-elevated
                text-text-primary
              "
            >
              <SelectItem value="ALL">
                Tất cả loại sân
              </SelectItem>

              <SelectItem value="FIVE">
                Sân 5 người
              </SelectItem>

              <SelectItem value="SEVEN">
                Sân 7 người
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Specific Field */}
        <div className="flex flex-col gap-2">
          <Label
            className="
              text-xs
              font-semibold
              text-text-primary
            "
          >
            Chọn sân cụ thể
          </Label>

          <Select
            value={selectedFieldId}
            onValueChange={(val) => {
              if (val) setSelectedFieldId(val);
            }}
          >
            <SelectTrigger
              className="
                h-10
                border-border
                bg-deep
                text-xs
                font-medium
                text-text-primary
                hover:border-brand-primary/50
                focus:border-brand-primary
                focus:ring-brand-primary/20
              "
            >
              <SelectValue placeholder="Tất cả sân" />
            </SelectTrigger>

            <SelectContent
              className="
                max-h-60
                border-border
                bg-elevated
                text-text-primary
              "
            >
              <SelectItem value="ALL">
                Tất cả sân
              </SelectItem>

              {fields?.map((field) => (
                <SelectItem
                  key={field.fieldId}
                  value={String(field.fieldId)}
                >
                  {field.name}{" "}
                  <span className="text-text-muted">
                    ({FIELD_TYPE_LABEL[field.fieldType]})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* CTA */}
        <Button
          onClick={handleSearch}
          className="
            mt-1
            h-11
            w-full
            rounded-lg
            bg-brand-primary
            font-bold
            text-white
            shadow-md
            shadow-brand-primary/20
            transition-all
            duration-200
            hover:bg-brand-primary-hover
            hover:shadow-lg
            hover:shadow-brand-primary/25
            active:scale-[0.98]
          "
        >
          Đặt sân ngay

          <span className="ml-1.5 text-brand-accent">
            →
          </span>
        </Button>

        {/* Hold info */}
        <div
          className="
            flex
            items-center
            justify-center
            gap-1.5
            rounded-md
            bg-status-success-bg
            px-3
            py-2
            text-center
          "
        >
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-primary" />

          <p className="text-[11px] leading-4 text-text-secondary">
            Tự động giữ chỗ{" "}
            <span className="font-semibold text-brand-primary">
              10 phút
            </span>{" "}
            khi chọn khung giờ.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}