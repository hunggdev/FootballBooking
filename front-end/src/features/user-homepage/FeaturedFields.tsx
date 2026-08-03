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
    <section className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Sân nổi bật</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Danh sách các sân bóng chất lượng cao và phổ biến nhất trên hệ thống.
          </p>
        </div>
        <Button
          variant="link"
          className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          onClick={() => navigate("/user/booking")}
        >
          Xem tất cả sân →
        </Button>
      </div>

      {isLoading ? (
        <div className="flex py-12 justify-center items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Đang tải danh sách sân nổi bật...
        </div>
      ) : fields.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground border rounded-lg">
          Chưa có thông tin sân bóng nào.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedFields.map((field) => (
              <FieldCard key={field.fieldId} field={field} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            pageSize={pageSize}
          />
        </>
      )}
    </section>
  );
}
