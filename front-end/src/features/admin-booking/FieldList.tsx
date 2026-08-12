import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useAllFieldSlotsByDate } from "@/stores/useFieldStore";
import {
  SLUG_TO_FIELD_TYPE,
  FIELD_TYPE_LABEL,
  FIELD_TYPE_SLUG,
  type FieldSlot,
} from "@/types/field";
import { formatTimeRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/common/Pagination";

export default function FieldList() {
  const { typeSlug } = useParams<{ typeSlug: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format("YYYY-MM-DD"));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const fieldType = typeSlug ? SLUG_TO_FIELD_TYPE[typeSlug] : undefined;
  const { data: fieldsWithSlots = [], isLoading } = useAllFieldSlotsByDate(selectedDate, fieldType);

  const totalItems = fieldsWithSlots.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedFields = fieldsWithSlots.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const changeDate = (days: number) => {
    setSelectedDate(dayjs(selectedDate).add(days, "day").format("YYYY-MM-DD"));
    setCurrentPage(1);
  };

  const handleSlotClick = (fId: number, slotId: number) => {
    const slug = typeSlug || (fieldType ? FIELD_TYPE_SLUG[fieldType] : "san-5");
    navigate(`/user/booking/${slug}/${fId}?slotId=${slotId}&date=${selectedDate}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {fieldType ? FIELD_TYPE_LABEL[fieldType] : "Danh sách sân bóng"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Chọn khung giờ trống trực tiếp trên sơ đồ để tiến hành đặt sân.
          </p>
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => changeDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }
            }}
            className="h-9 rounded-md border bg-background px-3 text-xs font-medium shadow-xs"
          />
          <Button variant="outline" size="sm" onClick={() => changeDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Đang tải thông tin sân bóng và khung giờ...
        </p>
      )}

      {!isLoading && fieldsWithSlots.length === 0 && (
        <Card className="py-12 text-center text-muted-foreground">
          Chưa có sân nào thuộc loại này.
        </Card>
      )}

      {!isLoading && fieldsWithSlots.length > 0 && (
        <div className="space-y-6">
          <div className="space-y-6">
            {paginatedFields.map((field) => (
              <Card key={field.fieldId} className="overflow-hidden border shadow-sm">
                <CardHeader className="border-b bg-muted/20 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {field.image ? (
                        <img
                          src={field.image}
                          alt={field.name}
                          className="h-12 w-16 rounded-md object-cover border"
                        />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                          Sân bóng
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-lg font-bold">{field.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {field.description || "Sân cỏ nhân tạo chất lượng cao"}
                        </p>
                      </div>
                    </div>

                    <Badge variant="outline">{FIELD_TYPE_LABEL[field.fieldType]}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {field.slots?.map((slot: FieldSlot) => {
                      const isAvailable = slot.status === "AVAILABLE";
                      const isMyHold = Boolean(slot.isMyHold);
                      const canClick = isAvailable || isMyHold;

                      let badgeText = isAvailable ? "Còn trống" : "Đã đặt";
                      let styleClasses = isAvailable
                        ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/20 text-foreground cursor-pointer"
                        : "border-border bg-muted/40 text-muted-foreground opacity-60 cursor-not-allowed";

                      if (isMyHold) {
                        badgeText = "Bạn đang giữ";
                        styleClasses =
                          "border-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer ring-2 ring-emerald-500/40 shadow-sm";
                      } else if (slot.status === "HOLD") {
                        badgeText = "Đang giữ";
                        styleClasses = "border-amber-500/40 bg-amber-500/10 text-amber-500 cursor-not-allowed opacity-80";
                      }

                      return (
                        <button
                          key={slot.slotId}
                          type="button"
                          disabled={!canClick}
                          onClick={() => handleSlotClick(field.fieldId, slot.slotId)}
                          className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${styleClasses}`}
                        >
                          <span className="text-xs font-semibold">
                            {formatTimeRange(slot.starttime, slot.endtime)}
                          </span>
                          <span className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {Number(slot.price).toLocaleString("vi-VN")} đ
                          </span>
                          <span className="mt-1 text-[10px] uppercase font-medium">
                            {badgeText}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </div>
      )}
    </div>
  );
}