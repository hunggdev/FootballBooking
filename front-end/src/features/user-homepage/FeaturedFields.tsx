import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FieldCard } from "./FieldCard";
import { useFields } from "@/stores/useFieldStore";
import { Loader2 } from "lucide-react";
import { Pagination } from "@/components/common/Pagination";

export function FeaturedFields() {
  const navigate = useNavigate();
  const { data: fields = [], isLoading } = useFields();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const totalItems = fields.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedFields = fields.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 space-y-7">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-brand-primary" />

            <span className="text-xs font-semibold uppercase tracking-wider text-brand-primary">
              Football Booking
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Sân bóng nổi bật
          </h2>

          <p className="mt-1.5 max-w-2xl text-sm text-text-secondary">
            Khám phá những sân bóng chất lượng cao và được yêu thích
            trên hệ thống.
          </p>
        </div>

        <Button
          variant="outline"
          className="
            shrink-0
            border-border
            bg-surface
            text-text-primary
            transition-all
            hover:border-brand-primary
            hover:bg-surface-hover
            hover:text-brand-primary
          "
          onClick={() => navigate("/user/booking")}
        >
          Xem tất cả sân
          <span className="ml-1.5 text-brand-accent">→</span>
        </Button>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div
          className="
            flex min-h-[280px]
            items-center justify-center
            rounded-xl
            border border-border
            bg-surface
          "
        >
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />

            <p className="text-sm text-text-secondary">
              Đang tải danh sách sân...
            </p>
          </div>
        </div>
      ) : fields.length === 0 ? (
        /* Empty */
        <div
          className="
            flex min-h-[220px]
            flex-col items-center justify-center
            rounded-xl
            border border-border
            bg-surface
            px-4
            text-center
          "
        >
          <div
            className="
              mb-3 flex h-12 w-12
              items-center justify-center
              rounded-full
              bg-status-info-bg
              text-status-info
            "
          >
            ⚽
          </div>

          <p className="text-sm font-medium text-text-primary">
            Chưa có sân bóng
          </p>

          <p className="mt-1 text-xs text-text-muted">
            Hiện tại chưa có thông tin sân bóng nào trên hệ thống.
          </p>
        </div>
      ) : (
        <>
          {/* Field cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedFields.map((field) => (
              <FieldCard
                key={field.fieldId}
                field={field}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-2">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={totalItems}
                pageSize={pageSize}
              />
            </div>
          )}
        </>
      )}
    </section>
  );
}