import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAllFieldSlotsByDate, useFields } from "@/stores/useFieldStore";
import { FIELD_TYPE_LABEL, FIELD_TYPE_SLUG } from "@/types/field";
import type { FieldType, FieldSlot } from "@/types/field";
import { formatTimeRange } from "@/lib/utils";
import { Pagination } from "@/components/common/Pagination";

const WEEKDAY_LABEL = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export default function FieldSlotGrid() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format("YYYY-MM-DD"));
  const [selectedType, setSelectedType] = useState<FieldType | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const filterType = selectedType === "ALL" ? undefined : selectedType;
  const { data: fields = [], isLoading, error } = useFields(filterType);

  const dateObj = dayjs(selectedDate);
  const dateLabel = `${WEEKDAY_LABEL[dateObj.day()]}, ${dateObj.format("DD/MM/YYYY")}`;

  const totalItems = fields.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedFields = fields.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
);

  const changeDate = (days: number) => {
    setSelectedDate(dayjs(selectedDate).add(days, "day").format("YYYY-MM-DD"));
    setCurrentPage(1);
  };

  const handleTypeChange = (type: FieldType | "ALL") => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  // const handleSlotClick = (fieldType: FieldType, fieldId: number, slotId: number) => {
  //   const slug = FIELD_TYPE_SLUG[fieldType] || fieldType.toLowerCase();
  //   navigate(`/user/booking/${slug}/${fieldId}?slotId=${slotId}&date=${selectedDate}`);
  // };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Sparkles className="h-6 w-6 text-primary" />
            Khung lưới giờ đặt sân
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi danh sách khung giờ trống của từng loại sân và chọn suất đá phù hợp.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeDate(-1)}
            className="h-9 gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Hôm qua
          </Button>

          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }
              }}
              className="h-9 rounded-md border border-input bg-background px-3 text-xs font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => changeDate(1)}
            className="h-9 gap-1"
          >
            Ngày mai <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedDate(dayjs().format("YYYY-MM-DD"));
              setCurrentPage(1);
            }}
            className="h-9 text-xs"
          >
            Hôm nay
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Status Legend */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Type Filter */}
        <div className="flex gap-2 rounded-lg border bg-muted/30 p-1">
          {(
            [
              { value: "ALL", label: "Tất cả sân" },
              { value: "FIVE", label: "Sân 5 người" },
              { value: "SEVEN", label: "Sân 7 người" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => handleTypeChange(tab.value)}
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                selectedType === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Còn trống
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Đang giữ chỗ
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" /> Đã được đặt
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Bảo trì
          </span>
        </div>
      </div>

      <div className="text-sm font-semibold text-muted-foreground">
        Lịch đặt sân cho ngày: <span className="text-foreground font-bold">{dateLabel}</span>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Clock className="mr-2 h-5 w-5 animate-spin" /> Đang tải sơ đồ khung giờ các sân...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-500">
          Không thể tải thông tin khung giờ sân. Vui lòng kiểm tra lại kết nối.
        </div>
      )}

      {/* Grid of Fields & Time Slots */}
      {!isLoading && !error && fields.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent className="text-muted-foreground">
            Chưa có sân bóng hoặc khung giờ nào trong hệ thống cho ngày này.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="space-y-6">
            {paginatedFields.map((field) => (
              <Card key={field.fieldId} className="overflow-hidden border shadow-sm">
                <CardHeader className="border-b bg-muted/20 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
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
                          {field.description || "Sân bóng cỏ nhân tạo chất lượng cao"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-medium">
                        {FIELD_TYPE_LABEL[field.fieldType]}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/user/booking/${FIELD_TYPE_SLUG[field.fieldType] || field.fieldType.toLowerCase()}/${field.fieldId}?date=${selectedDate}`,
                            {
                              state: {
                                fieldId: field.fieldId,
                                bookingDate: selectedDate,
                              },
                            }
                          )
                        }
                        className="text-xs"
                      >
                        Chi tiết sân
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* <CardContent className="p-4">
                  {!field.slots || field.slots.length === 0 ? (
                    <p className="py-4 text-center text-xs text-muted-foreground">
                      Sân chưa được thiết lập khung giờ.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {field.slots.map((slot: FieldSlot) => {
                        const isAvailable = slot.status === "AVAILABLE";
                        const isMyHold = Boolean(slot.isMyHold);
                        const isBooked = slot.status === "BOOKED";
                        const isHold = slot.status === "HOLD" && !isMyHold;
                        const isMaintenance = slot.status === "MAINTENANCE";
                        const canClick = isAvailable || isMyHold;

                        let badgeText = "Còn trống";
                        let styleClasses =
                          "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/20 hover:border-emerald-500 text-foreground cursor-pointer shadow-xs";

                        if (isMyHold) {
                          badgeText = "Bạn đang giữ";
                          styleClasses =
                            "border-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer ring-2 ring-emerald-500/40 shadow-sm";
                        } else if (isBooked) {
                          badgeText = "Đã đặt";
                          styleClasses =
                            "border-border bg-muted/40 text-muted-foreground opacity-60 cursor-not-allowed";
                        } else if (isHold) {
                          badgeText = "Đang giữ";
                          styleClasses =
                            "border-amber-500/40 bg-amber-500/10 text-amber-500 cursor-not-allowed opacity-80";
                        } else if (isMaintenance) {
                          badgeText = "Bảo trì";
                          styleClasses =
                            "border-red-500/30 bg-red-500/10 text-red-500 cursor-not-allowed";
                        }

                        return (
                          <button
                            key={slot.slotId}
                            type="button"
                            disabled={!canClick}
                            onClick={() => handleSlotClick(field.fieldType, field.fieldId, slot.slotId)}
                            className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${styleClasses}`}
                          >
                            <span className="text-xs font-semibold">
                              {formatTimeRange(slot.starttime, slot.endtime)}
                            </span>
                            <span className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              {Number(slot.price).toLocaleString("vi-VN")} đ
                            </span>
                            <span className="mt-1 text-[10px] uppercase tracking-wider opacity-80 font-medium">
                              {badgeText}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent> */}
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
