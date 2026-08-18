import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem =
    totalItems && pageSize
      ? (currentPage - 1) * pageSize + 1
      : null;

  const endItem =
    totalItems && pageSize
      ? Math.min(currentPage * pageSize, totalItems)
      : null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
      {/* THÔNG TIN PHÂN TRANG */}
      {totalItems && startItem && endItem ? (
        <p className="text-xs text-text-secondary">
          Đang hiển thị{" "}
          <span className="font-semibold text-text-primary">
            {startItem} - {endItem}
          </span>{" "}
          trên tổng số{" "}
          <span className="font-semibold text-text-primary">
            {totalItems}
          </span>{" "}
          sân
        </p>
      ) : (
        <p className="text-xs text-text-primary">
          Trang{" "}
          <span className="font-semibold text-text-primary">
            {currentPage}
          </span>{" "}
          /{" "}
          <span className="font-semibold text-text-primary">
            {totalPages}
          </span>
        </p>
      )}

      {/* CÁC NÚT PHÂN TRANG */}
      <div className="flex items-center gap-1.5">
        {/* PREVIOUS */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="
            h-8 gap-1
            border-border
            bg-surface
            px-2.5
            text-xs
            text-text-secondary
            hover:border-brand-primary/40
            hover:bg-brand-primary/10
            hover:text-brand-primary
            disabled:border-border
            disabled:bg-elevated
            disabled:text-text-muted
          "
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Trước
        </Button>

        {/* PAGE NUMBERS */}
        {Array.from(
          { length: totalPages },
          (_, i) => i + 1
        ).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`
              h-8 w-8
              p-0
              text-xs
              font-semibold
              transition-all duration-200

              ${
                page === currentPage
                  ? `
                    border-brand-primary
                    bg-brand-primary
                    text-white
                    hover:bg-brand-primary-hover
                  `
                  : `
                    border-border
                    bg-surface
                    text-text-secondary
                    hover:border-brand-primary/40
                    hover:bg-brand-primary/10
                    hover:text-brand-primary
                  `
              }
            `}
          >
            {page}
          </Button>
        ))}

        {/* NEXT */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="
            h-8 gap-1
            border-border
            bg-surface
            px-2.5
            text-xs
            text-text-secondary
            hover:border-brand-primary/40
            hover:bg-brand-primary/10
            hover:text-brand-primary
            disabled:border-border
            disabled:bg-elevated
            disabled:text-text-muted
          "
        >
          Sau
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}