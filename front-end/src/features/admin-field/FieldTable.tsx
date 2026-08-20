import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageOff, Eye, Pencil, Trash2 } from "lucide-react";

import type { Field, FieldType } from "@/types/field";

interface Props {
  fields: Field[];
  onView: (field: Field) => void;
  onEdit: (field: Field) => void;
  onDelete: (field: Field) => void;
  currentPage?: number;
  pageSize?: number;
}

const fieldTypeLabel: Record<FieldType, string> = {
  FIVE: "Sân 5 người",
  SEVEN: "Sân 7 người",
  ELEVEN: "Sân 11 người",
};

const fieldTypeBadge: Record<FieldType, string> = {
  FIVE: "border-status-success/20 bg-status-success-bg text-status-success",
  SEVEN: "border-status-info/20 bg-status-info-bg text-status-info",
  ELEVEN: "border-status-indigo/20 bg-status-indigo/15 text-status-indigo",
};

export function FieldsTable({
  fields,
  onView,
  onEdit,
  onDelete,
  currentPage = 1,
  pageSize = 10,
}: Props) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentFields = fields.slice(startIndex, endIndex);

  return (
    <div
      className="
        mt-5
        rounded-xl
        bg-[#2d3a4f]
        p-px
        transition-all
        duration-300
        hover:bg-[image:var(--token-gradient-brand)]
      "
    >
      
    <Card className="overflow-hidden border-border/50 bg-surface shadow-lg shadow-black/10">
      <CardContent className="p-0">
        <Table>
          {/* ================= HEADER ================= */}
          <TableHeader>
            <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
              <TableHead className="w-[15%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Ảnh
              </TableHead>

              <TableHead className="w-[25%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Tên sân
              </TableHead>

              <TableHead className="w-[25%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Loại sân
              </TableHead>

              <TableHead className="w-[35%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ================= BODY ================= */}
          <TableBody>
            {currentFields.length === 0 && (
              <TableRow className="border-border/60 hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-sm text-text-muted"
                >
                  Chưa có sân bóng.
                </TableCell>
              </TableRow>
            )}

            {currentFields.map((field) => (
              <TableRow
                key={field.fieldId}
                className="
                  group
                  border-border/50
                  transition-colors
                  duration-200
                  hover:bg-surface-hover/60
                "
              >
                {/* ================= ẢNH ================= */}
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {field.image ? (
                      <div
                        className="
                          overflow-hidden
                          rounded-lg
                          border
                          border-border
                          bg-elevated
                          transition-all
                          duration-300
                          group-hover:border-brand-primary/40
                          group-hover:shadow-[0_0_14px_rgba(34,165,90,0.12)]
                        "
                      >
                        <img
                          src={field.image}
                          alt={field.name}
                          className="
                            h-12
                            w-[68px]
                            object-cover
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        />
                      </div>
                    ) : (
                      <div
                        className="
                          flex
                          h-12
                          w-[68px]
                          flex-col
                          items-center
                          justify-center
                          gap-1
                          rounded-lg
                          border
                          border-border
                          bg-elevated
                          text-text-muted
                          transition-all
                          duration-300
                          group-hover:border-brand-primary/40
                          group-hover:bg-surface-hover
                        "
                      >
                        <ImageOff className="h-4 w-4" />

                        <span className="text-[9px]">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* ================= TÊN SÂN ================= */}
                <TableCell>
                  <span
                    className="
                      font-semibold
                      text-text-primary
                      transition-colors
                      duration-200
                      group-hover:text-white
                    "
                  >
                    {field.name}
                  </span>
                </TableCell>

                {/* ================= LOẠI SÂN ================= */}
                <TableCell>
                  <span
                    className={`
                      inline-flex
                      items-center
                      rounded-md
                      border
                      px-2.5
                      py-1
                      text-[11px]
                      font-semibold
                      ${fieldTypeBadge[field.fieldType]}
                    `}
                  >
                    {fieldTypeLabel[field.fieldType]}
                  </span>
                </TableCell>

                {/* ================= HÀNH ĐỘNG ================= */}
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    {/* XEM */}
                    <Button
                      size="sm"
                      onClick={() => onView(field)}
                      className="
                        h-8
                        border
                        border-status-info/20
                        bg-status-info-bg
                        px-2.5
                        text-xs
                        font-medium
                        text-status-info
                        shadow-none
                        transition-all
                        duration-200
                        hover:-translate-y-px
                        hover:border-status-info/30
                        hover:bg-status-info/20
                      "
                    >
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      Xem
                    </Button>

                    {/* SỬA */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(field)}
                      className="
                        h-8
                        border-border
                        bg-transparent
                        px-2.5
                        text-xs
                        font-medium
                        text-text-secondary
                        shadow-none
                        transition-all
                        duration-200
                        hover:-translate-y-px
                        hover:border-brand-accent/40
                        hover:bg-brand-accent/10
                        hover:text-brand-accent
                      "
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Sửa
                    </Button>

                    {/* XÓA */}
                    <Button
                      size="sm"
                      onClick={() => onDelete(field)}
                      className="
                        h-8
                        border
                        border-status-danger/20
                        bg-status-danger-bg
                        px-2.5
                        text-xs
                        font-medium
                        text-status-danger
                        shadow-none
                        transition-all
                        duration-200
                        hover:-translate-y-px
                        hover:border-status-danger/30
                        hover:bg-status-danger/20
                      "
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Xóa
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  );
}