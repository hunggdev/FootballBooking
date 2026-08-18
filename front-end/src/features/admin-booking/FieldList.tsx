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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/common/Pagination";

export default function FieldList() {
  const { typeSlug } = useParams<{ typeSlug: string }>();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format("YYYY-MM-DD")
  );
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 4;

  const fieldType = typeSlug
    ? SLUG_TO_FIELD_TYPE[typeSlug]
    : undefined;

  const {
    data: fieldsWithSlots = [],
    isLoading,
  } = useAllFieldSlotsByDate(selectedDate, fieldType);

  const totalItems = fieldsWithSlots.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedFields = fieldsWithSlots.slice(
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

  const handleSlotClick = (
    fId: number,
    slotId: number
  ) => {
    const slug =
      typeSlug ||
      (fieldType
        ? FIELD_TYPE_SLUG[fieldType]
        : "san-5");

    navigate(
      `/user/booking/${slug}/${fId}?slotId=${slotId}&date=${selectedDate}`
    );
  };

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">

        {/* Header */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              {fieldType
                ? FIELD_TYPE_LABEL[fieldType]
                : "Danh sách sân bóng"}
            </h1>

            <p className="mt-1 text-sm text-text-secondary">
              Chọn khung giờ trống trực tiếp trên sơ đồ
              để tiến hành đặt sân.
            </p>
          </div>

          {/* Date navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeDate(-1)}
              className="border-border bg-surface text-text-primary hover:bg-surface-hover"
            >
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
              className="
                h-9
                rounded-md
                border
                border-border
                bg-surface
                px-3
                text-xs
                font-medium
                text-text-primary
                shadow-xs
                outline-none
                focus:border-brand-primary
                focus:ring-1
                focus:ring-brand-primary/30
              "
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => changeDate(1)}
              className="border-border bg-surface text-text-primary hover:bg-surface-hover"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <p className="py-12 text-center text-sm text-text-secondary">
            Đang tải thông tin sân bóng và khung giờ...
          </p>
        )}

        {/* Empty */}
        {!isLoading && fieldsWithSlots.length === 0 && (
          <Card className="border-border bg-surface py-12 text-center text-text-secondary">
            Chưa có sân nào thuộc loại này.
          </Card>
        )}

        {/* Field list */}
        {!isLoading && fieldsWithSlots.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-6">
              {paginatedFields.map((field) => (
                <Card
                  key={field.fieldId}
                  className="overflow-hidden border-border bg-surface shadow-sm"
                >
                  <CardHeader className="border-b border-border bg-surface-hover/20 pb-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {field.image ? (
                          <img
                            src={field.image}
                            alt={field.name}
                            className="h-12 w-16 rounded-md border border-border object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 items-center justify-center rounded-md border border-border bg-background text-xs text-text-secondary">
                            Sân bóng
                          </div>
                        )}

                        <div>
                          <CardTitle className="text-lg font-bold text-text-primary">
                            {field.name}
                          </CardTitle>

                          <p className="text-xs text-text-secondary">
                            {field.description ||
                              "Sân cỏ nhân tạo chất lượng cao"}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="border-brand-primary/40 bg-brand-primary/10 text-brand-primary"
                      >
                        {FIELD_TYPE_LABEL[field.fieldType]}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                      {field.slots?.map(
                        (slot: FieldSlot) => {
                          const isAvailable =
                            slot.status === "AVAILABLE";

                          const isMyHold =
                            Boolean(slot.isMyHold);

                          const canClick =
                            isAvailable || isMyHold;

                          let badgeText = isAvailable
                            ? "Còn trống"
                            : "Đã đặt";

                          let styleClasses = isAvailable
                            ? `
                              border-brand-primary/40
                              bg-brand-primary/5
                              text-text-primary
                              hover:bg-brand-primary/15
                              hover:border-brand-primary/70
                              cursor-pointer
                            `
                            : `
                              border-border
                              bg-surface-hover/40
                              text-text-secondary
                              opacity-60
                              cursor-not-allowed
                            `;

                          if (isMyHold) {
                            badgeText = "Bạn đang giữ";

                            styleClasses = `
                              border-brand-primary
                              bg-brand-primary/15
                              text-brand-primary
                              hover:bg-brand-primary/25
                              font-bold
                              cursor-pointer
                              ring-2
                              ring-brand-primary/30
                              shadow-sm
                            `;
                          } else if (
                            slot.status === "HOLD"
                          ) {
                            badgeText = "Đang giữ";

                            styleClasses = `
                              border-status-warning/40
                              bg-status-warning/10
                              text-status-warning
                              cursor-not-allowed
                              opacity-80
                            `;
                          }

                          return (
                            <button
                              key={slot.slotId}
                              type="button"
                              disabled={!canClick}
                              onClick={() =>
                                handleSlotClick(
                                  field.fieldId,
                                  slot.slotId
                                )
                              }
                              className={`
                                flex
                                flex-col
                                items-center
                                justify-center
                                rounded-lg
                                border
                                p-3
                                text-center
                                transition-all
                                ${styleClasses}
                              `}
                            >
                              <span className="text-xs font-semibold text-text-primary">
                                {formatTimeRange(
                                  slot.starttime,
                                  slot.endtime
                                )}
                              </span>

                              <span className="mt-1 text-xs font-bold text-brand-primary">
                                {Number(
                                  slot.price
                                ).toLocaleString(
                                  "vi-VN"
                                )}{" "}
                                đ
                              </span>

                              <span className="mt-1 text-[10px] font-medium uppercase text-text-secondary">
                                {badgeText}
                              </span>
                            </button>
                          );
                        }
                      )}
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
    </div>
  );
}