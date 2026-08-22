// src/components/common/Pagination.tsx
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  showFirstLast?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  showFirstLast = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem =
    totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem =
    totalItems && pageSize
      ? Math.min(currentPage * pageSize, totalItems)
      : null;

  // Smart page range with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Đang ở những trang đầu
    if (currentPage <= 2) {
      pages.push(1);
      pages.push(2);
      pages.push("...");
      pages.push(totalPages);
      return pages;
    }

    // Đang ở những trang cuối
    if (currentPage >= totalPages - 1) {
      pages.push(1);
      pages.push("...");
      pages.push(totalPages - 1);
      pages.push(totalPages);
      return pages;
    }

    // Đang ở giữa
    pages.push(1);
    pages.push("...");
    pages.push(currentPage);
    pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/50 select-none">
      {/* Information text */}
      <div className="text-xs text-text-muted">
        {totalItems && startItem && endItem ? (
          <p>
            Hiển thị{" "}
            <span className="font-semibold text-text-primary">
              {startItem} - {endItem}
            </span>{" "}
            trên tổng số{" "}
            <span className="font-semibold text-brand-primary">
              {totalItems}
            </span>{" "}
            mục
          </p>
        ) : (
          <p>
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
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* First page button */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            className="h-8 w-8 p-0 border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-surface-hover hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Trang đầu"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Previous page button */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5 text-xs gap-1 border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-surface-hover hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Trước</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="h-8 w-6 flex items-center justify-center text-text-muted text-xs tracking-widest"
                >
                  •••
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <Button
                key={`page-${pageNum}`}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 text-xs p-0 font-semibold transition-all duration-150 cursor-pointer rounded-lg ${
                  isActive
                    ? "bg-[image:var(--token-gradient-brand)] text-white border-transparent shadow-[0_2px_8px_rgba(34,165,90,0.3)] hover:opacity-95 hover:text-white"
                    : "border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next page button */}
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5 text-xs gap-1 border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-surface-hover hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none transition-all duration-150 cursor-pointer"
        >
          <span className="hidden xs:inline">Sau</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        {/* Last page button */}
        {showFirstLast && (
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            className="h-8 w-8 p-0 border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-surface-hover hover:text-text-primary disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            title="Trang cuối"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
