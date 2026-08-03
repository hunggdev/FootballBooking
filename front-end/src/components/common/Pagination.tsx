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

  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
      {totalItems && startItem && endItem ? (
        <p className="text-xs text-muted-foreground">
          Đang hiển thị <span className="font-semibold text-foreground">{startItem} - {endItem}</span> trên tổng số <span className="font-semibold text-foreground">{totalItems}</span> sân
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Trang <span className="font-semibold text-foreground">{currentPage}</span> / <span className="font-semibold text-foreground">{totalPages}</span>
        </p>
      )}

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5 text-xs gap-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Trước
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={`h-8 w-8 text-xs p-0 font-semibold ${
              page === currentPage
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : ""
            }`}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5 text-xs gap-1"
        >
          Sau <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
