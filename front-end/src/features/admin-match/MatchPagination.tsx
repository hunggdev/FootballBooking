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

  return (
    <Pagination className="mt-5">
      <PaginationContent className="gap-1.5">
        {/* PREVIOUS */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            className={`
              border border-border
              bg-surface
              text-text-secondary
              transition-all duration-200
              hover:-translate-y-px
              hover:border-brand-primary/30
              hover:bg-brand-primary/10
              hover:text-brand-primary
              ${currentPage === 1 ? "pointer-events-none opacity-40" : ""}
            `}
          />
        </PaginationItem>

        {/* PAGE NUMBERS */}
        {Array.from({ length: Math.min(totalPages, 4) }).map((_, i) => {
          const page = i + 1;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page);
                }}
                className={`
                  h-9
                  min-w-9
                  border
                  text-xs
                  font-semibold
                  transition-all duration-200

                  ${
                    page === currentPage
                      ? `
                        border-brand-primary
                        bg-brand-primary
                        text-white
                        shadow-[0_0_12px_rgba(34,165,90,0.18)]
                      `
                      : `
                        border-border
                        bg-surface
                        text-text-secondary
                        hover:-translate-y-px
                        hover:border-brand-primary/30
                        hover:bg-brand-primary/10
                        hover:text-brand-primary
                      `
                  }
                `}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* ELLIPSIS */}
        {totalPages > 4 && (
          <PaginationItem>
            <PaginationEllipsis className="text-text-muted" />
          </PaginationItem>
        )}

        {/* NEXT */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            className={`
              border border-border
              bg-surface
              text-text-secondary
              transition-all duration-200
              hover:-translate-y-px
              hover:border-brand-primary/30
              hover:bg-brand-primary/10
              hover:text-brand-primary
              ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-40"
                  : ""
              }
            `}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}