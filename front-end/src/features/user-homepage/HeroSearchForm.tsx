import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Calendar, Search, ShieldCheck, ArrowRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
import { FIELD_TYPE_LABEL, FIELD_TYPE_SLUG } from "@/types/field";

export function HeroSearchForm() {
  const navigate = useNavigate();
  const { data: fields } = useFields();

  const [selectedFieldId, setSelectedFieldId] = useState<string>("ALL");

  const [selectedType, setSelectedType] = useState<string>("ALL");

  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format("YYYY-MM-DD"),
  );

  // Lọc sân theo loại sân
  const filteredFields =
    selectedType === "ALL"
      ? fields
      : fields?.filter((field) => field.fieldType === selectedType);

  const handleTypeChange = (value: string) => {
    setSelectedType(value);

    // Reset sân cụ thể khi đổi loại sân
    setSelectedFieldId("ALL");
  };

  const handleSearch = () => {
    if (selectedFieldId !== "ALL") {
      const field = fields?.find((f) => f.fieldId === Number(selectedFieldId));

      if (field) {
        const slug =
          FIELD_TYPE_SLUG[field.fieldType] || field.fieldType.toLowerCase();

        navigate(`/user/booking/${slug}/${field.fieldId}?date=${selectedDate}`);

        return;
      }
    }

    const typeQuery = selectedType !== "ALL" ? `&type=${selectedType}` : "";

    navigate(`/user/booking?date=${selectedDate}${typeQuery}`);
  };

  return (
    <Card
      className="
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
        text-text-primary
        shadow-2xl
        shadow-black/20
      "
    >
      {/* ================= HEADER ================= */}
      <CardHeader
        className="
          border-b
          border-border-subtle
          bg-elevated/30
          px-6
          py-4
        "
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-status-success-bg
              ring-1
              ring-brand-primary/10
            "
          >
            <Search className="h-5 w-5 text-brand-primary" />
          </div>

          {/* Title */}
          <div className="min-w-0">
            <CardTitle
              className="
                text-lg
                font-bold
                tracking-tight
                text-text-primary
              "
            >
              Đặt sân ngay
            </CardTitle>

            <p className="mt-0.5 text-xs text-text-muted">
              Tìm sân phù hợp và đặt lịch nhanh chóng
            </p>
          </div>
        </div>
      </CardHeader>

      {/* ================= CONTENT ================= */}
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {/* ================= DATE ================= */}
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="booking-date"
              className="
                flex
                items-center
                gap-1.5
                text-xs
                font-semibold
                text-text-secondary
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
                h-11
                w-full
                rounded-lg
                border
                border-border
                bg-deep
                px-3
                text-sm
                font-medium
                text-text-primary
                outline-none
                transition-all
                duration-200
                hover:border-brand-primary/40
                focus:border-brand-primary
                focus:ring-2
                focus:ring-brand-primary/20
              "
            />
          </div>

          {/* ================= SELECTS ================= */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* FIELD TYPE */}
            <div className="flex flex-col gap-2">
              <Label
                className="
                  text-xs
                  font-semibold
                  text-text-secondary
                "
              >
                Loại sân bóng
              </Label>

              <Select value={selectedType} onValueChange={handleTypeChange}>
                <SelectTrigger
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border-border
                    bg-deep
                    text-sm
                    font-medium
                    text-text-primary
                    transition-colors
                    hover:border-brand-primary/40
                    focus:border-brand-primary
                    focus:ring-brand-primary/20 
                  "
                >
                  <SelectValue>
                    {selectedType === "ALL"
                      ? "Tất cả"
                      : FIELD_TYPE_LABEL[selectedType]}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  className="
                    border-border
                    bg-elevated
                    text-text-primary
                  "
                >
                  <SelectItem value="ALL">Tất cả</SelectItem>

                  <SelectItem value="FIVE">Sân 5 người</SelectItem>

                  <SelectItem value="SEVEN">Sân 7 người</SelectItem>

                  <SelectItem value="ELEVEN">Sân 11 người</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SPECIFIC FIELD */}
            <div className="flex flex-col gap-2">
              <Label
                className="
                  text-xs
                  font-semibold
                  text-text-secondary
                "
              >
                Chọn sân cụ thể
              </Label>

              <Select
                value={selectedFieldId}
                onValueChange={setSelectedFieldId}
              >
                <SelectTrigger
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border-border
                    bg-deep
                    text-sm
                    font-medium
                    text-text-primary
                    transition-colors
                    hover:border-brand-primary/40
                    focus:border-brand-primary
                    focus:ring-brand-primary/20
                  "
                >
                  <SelectValue>
                    {selectedFieldId === "ALL"
                      ? "Tất cả sân"
                      : filteredFields?.find(
                          (field) => String(field.name) === selectedFieldId,
                        )?.name}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent
                  className="
                    max-h-60
                    border-border
                    bg-elevated
                    text-text-primary
                  "
                >
                  <SelectItem value="ALL">Tất cả sân</SelectItem>

                  {filteredFields?.map((field) => (
                    <SelectItem key={field.fieldId} value={String(field.name)}>
                      {field.name}

                      <span className="ml-1 text-text-muted">
                        ({FIELD_TYPE_LABEL[field.fieldType]})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ================= CTA ================= */}
          <Button
            type="button"
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
              shadow-brand-primary/15
              transition-all
              duration-200
              hover:bg-brand-primary-hover
              hover:shadow-lg
              hover:shadow-brand-primary/20
              active:scale-[0.985]
            "
          >
            Đặt sân ngay
            <ArrowRight className="ml-2 h-4 w-4 text-brand-accent" />
          </Button>

          {/* ================= HOLD INFO ================= */}
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-brand-primary/10
              bg-status-success-bg/50
              px-3
              py-2
            "
          >
            <ShieldCheck
              className="
                h-3.5
                w-3.5
                shrink-0
                text-brand-primary
              "
            />

            <p
              className="
                text-[11px]
                leading-4
                text-text-muted
              "
            >
              Tự động giữ chỗ{" "}
              <span className="font-semibold text-brand-primary">10 phút</span>{" "}
              khi chọn khung giờ.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
