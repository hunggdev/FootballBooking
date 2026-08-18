import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Clock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useFields } from "@/stores/useFieldStore";

import {
  FIELD_TYPE_LABEL,
  FIELD_TYPE_SLUG,
} from "@/types/field";

import type { FieldType } from "@/types/field";

import { Pagination } from "@/components/common/Pagination";

const WEEKDAY_LABEL = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

export default function FieldSlotGrid() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format("YYYY-MM-DD")
  );

  const [selectedType, setSelectedType] =
    useState<FieldType | "ALL">("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 4;

  const filterType =
    selectedType === "ALL" ? undefined : selectedType;

  const {
    data: fields = [],
    isLoading,
    error,
  } = useFields(filterType);

  const dateObj = dayjs(selectedDate);

  const dateLabel = `${WEEKDAY_LABEL[dateObj.day()]
    }, ${dateObj.format("DD/MM/YYYY")}`;

  const totalItems = fields.length;

  const totalPages = Math.ceil(
    totalItems / pageSize
  );

  const paginatedFields = fields.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const changeDate = (days: number) => {
    setSelectedDate(
      dayjs(selectedDate)
        .add(days, "day")
        .format("YYYY-MM-DD")
    );

    setCurrentPage(1);
  };

  const handleTypeChange = (
    type: FieldType | "ALL"
  ) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER & CONTROLS ================= */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-text-primary">
            <Sparkles className="h-6 w-6 text-brand-primary" />

            Khung lưới giờ đặt sân
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            Theo dõi danh sách khung giờ trống của từng
            loại sân và chọn suất đá phù hợp.
          </p>
        </div>

        {/* ================= DATE SELECTOR ================= */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeDate(-1)}
            className="h-9 gap-1 border-border bg-surface text-text-primary hover:bg-surface-hover hover:text-text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Hôm qua
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
              className="h-9 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-text-primary shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => changeDate(1)}
            className="h-9 gap-1 border-border bg-surface text-text-primary hover:bg-surface-hover hover:text-text-primary"
          >
            Ngày mai
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setSelectedDate(
                dayjs().format("YYYY-MM-DD")
              );
              setCurrentPage(1);
            }}
            className="h-9 border border-border bg-surface-hover text-xs text-text-primary hover:bg-surface-hover/80"
          >
            Hôm nay
          </Button>
        </div>
      </div>

      {/* ================= FILTER + LEGEND ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Type Filter */}
        <div className="flex gap-2 rounded-lg border border-border bg-surface-hover/30 p-1">
          {(
            [
              {
                value: "ALL",
                label: "Tất cả sân",
              },
              {
                value: "FIVE",
                label: "Sân 5 người",
              },
              {
                value: "SEVEN",
                label: "Sân 7 người",
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                handleTypeChange(tab.value)
              }
              className={`rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${selectedType === tab.value
                  ? "bg-brand-primary text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-status-success" />
            Còn trống
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-status-warning" />
            Đang giữ chỗ
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-text-muted" />
            Đã được đặt
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-status-danger" />
            Bảo trì
          </span>
        </div>
      </div>

      {/* ================= SELECTED DATE ================= */}
      <div className="text-sm font-semibold text-text-secondary">
        Lịch đặt sân cho ngày:{" "}
        <span className="font-bold text-text-primary">
          {dateLabel}
        </span>
      </div>

      {/* ================= LOADING ================= */}
      {isLoading && (
        <div className="flex items-center justify-center py-16 text-text-secondary">
          <Clock className="mr-2 h-5 w-5 animate-spin text-brand-primary" />

          Đang tải sơ đồ khung giờ các sân...
        </div>
      )}

      {/* ================= ERROR ================= */}
      {error && (
        <div className="rounded-xl border border-status-danger/20 bg-status-danger/10 p-6 text-center text-sm text-status-danger">
          Không thể tải thông tin khung giờ sân.
          Vui lòng kiểm tra lại kết nối.
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!isLoading &&
        !error &&
        fields.length === 0 ? (
        <Card className="border-border bg-surface py-12 text-center">
          <CardContent className="text-text-secondary">
            Chưa có sân bóng hoặc khung giờ nào
            trong hệ thống cho ngày này.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="space-y-6">
            {paginatedFields.map((field) => (
              <Card
                key={field.fieldId}
                className="overflow-hidden border-border bg-surface shadow-sm"
              >
                {/* ================= FIELD HEADER ================= */}
                <CardHeader className="border-b border-border bg-surface-hover/30 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      {/* Field image */}
                      {field.image ? (
                        <img
                          src={field.image}
                          alt={field.name}
                          className="h-12 w-16 rounded-md border border-border object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-md border border-border bg-surface-hover text-xs text-text-muted">
                          Sân bóng
                        </div>
                      )}

                      {/* Field information */}
                      <div>
                        <CardTitle className="text-lg font-bold text-text-primary">
                          {field.name}
                        </CardTitle>

                        <p className="text-xs text-text-secondary">
                          {field.description ||
                            "Sân bóng cỏ nhân tạo chất lượng cao"}
                        </p>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-brand-primary/40 bg-brand-primary/10 font-medium text-brand-primary"
                      >
                        {
                          FIELD_TYPE_LABEL[
                          field.fieldType
                          ]
                        }
                      </Badge>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            `/user/booking/${FIELD_TYPE_SLUG[
                            field.fieldType
                            ] ||
                            field.fieldType.toLowerCase()
                            }/${field.fieldId}?date=${selectedDate}`,
                            {
                              state: {
                                fieldId:
                                  field.fieldId,
                                bookingDate:
                                  selectedDate,
                              },
                            }
                          )
                        }
                        className="border-border bg-surface text-xs text-text-primary hover:bg-surface-hover hover:text-brand-primary"
                      >
                        Chi tiết sân
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* ================= FIELD SLOTS ================= */}
                {/*
                  Nếu muốn hiển thị trực tiếp danh sách slot
                  tại đây thì bỏ comment phần CardContent bên dưới.
                */}

                {/*
                <CardContent className="p-4">
                  {!field.slots ||
                  field.slots.length === 0 ? (
                    <p className="py-4 text-center text-xs text-text-muted">
                      Sân chưa được thiết lập khung giờ.
                    </p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {field.slots.map((slot: FieldSlot) => {
                        const isAvailable =
                          slot.status === "AVAILABLE";

                        const isMyHold =
                          Boolean(slot.isMyHold);

                        const isBooked =
                          slot.status === "BOOKED";

                        const isHold =
                          slot.status === "HOLD" &&
                          !isMyHold;

                        const isMaintenance =
                          slot.status === "MAINTENANCE";

                        const canClick =
                          isAvailable || isMyHold;

                        let badgeText = "Còn trống";

                        let styleClasses =
                          "border-status-success/40 bg-status-success/5 hover:bg-status-success/20 hover:border-status-success text-text-primary cursor-pointer shadow-xs";

                        if (isMyHold) {
                          badgeText = "Bạn đang giữ";

                          styleClasses =
                            "border-status-success bg-status-success/20 hover:bg-status-success/30 text-status-success font-bold cursor-pointer ring-2 ring-status-success/40 shadow-sm";
                        } else if (isBooked) {
                          badgeText = "Đã đặt";

                          styleClasses =
                            "border-border bg-surface-hover text-text-muted opacity-60 cursor-not-allowed";
                        } else if (isHold) {
                          badgeText = "Đang giữ";

                          styleClasses =
                            "border-status-warning/40 bg-status-warning/10 text-status-warning cursor-not-allowed opacity-80";
                        } else if (isMaintenance) {
                          badgeText = "Bảo trì";

                          styleClasses =
                            "border-status-danger/30 bg-status-danger/10 text-status-danger cursor-not-allowed";
                        }

                        return (
                          <button
                            key={slot.slotId}
                            type="button"
                            disabled={!canClick}
                            onClick={() =>
                              handleSlotClick(
                                field.fieldType,
                                field.fieldId,
                                slot.slotId
                              )
                            }
                            className={`flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${styleClasses}`}
                          >
                            <span className="text-xs font-semibold">
                              {formatTimeRange(
                                slot.starttime,
                                slot.endtime
                              )}
                            </span>

                            <span className="mt-1 text-xs font-bold text-status-success">
                              {Number(
                                slot.price
                              ).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              đ
                            </span>

                            <span className="mt-1 text-[10px] font-medium uppercase tracking-wider">
                              {badgeText}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
                */}
              </Card>
            ))}
          </div>

          {/* ================= PAGINATION ================= */}
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