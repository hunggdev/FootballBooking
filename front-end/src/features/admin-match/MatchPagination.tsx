import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MatchPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function MatchPagination({
  currentPage,
  totalPages,
  onPageChange,
}: MatchPaginationProps) {
  if (totalPages <= 1) return null;

  // Smart page range with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Pagination className="pt-4 border-t border-border/50">
      <PaginationContent className="gap-1.5">
        {/* PREVIOUS */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text="Trước"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={`border border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-surface-hover hover:text-text-primary text-xs ${
              currentPage <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"
            }`}
          />
        </PaginationItem>

        {/* PAGE NUMBERS */}
        {pages.map((p, idx) => {
          if (p === "...") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis className="text-text-muted text-xs" />
              </PaginationItem>
            );
          }

          const pageNum = Number(p);
          const isActive = pageNum === currentPage;

          return (
            <PaginationItem key={`page-${pageNum}`}>
              <PaginationLink
                href="#"
                isActive={isActive}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(pageNum);
                }}
                className={`h-8 w-8 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-[image:var(--token-gradient-brand)] text-white border-transparent shadow-[0_2px_8px_rgba(34,165,90,0.3)] hover:opacity-95"
                    : "border border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-surface-hover hover:text-text-primary"
                }`}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* NEXT */}
        <PaginationItem>
          <PaginationNext
            href="#"
            text="Sau"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={`border border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-surface-hover hover:text-text-primary text-xs ${
              currentPage >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}