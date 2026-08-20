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
import { Eye, Pencil, Trash2, ImageOff } from "lucide-react";

import type { Service } from "@/types/service";

interface Props {
  services: Service[];
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  currentPage: number;
  pageSize: number;
}

export function ServiceTable({
  services,
  onView,
  onEdit,
  onDelete,
  currentPage,
  pageSize,
}: Props) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const currentServices = services.slice(startIndex, endIndex);

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
      <Card className="overflow-hidden border-0 bg-surface shadow-none">
        <CardContent className="p-0">
          <Table>
            {/* ================= HEADER ================= */}
            <TableHeader>
              <TableRow className="border-border/60 bg-elevated/30 hover:bg-elevated/30">
                <TableHead className="w-[9%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Ảnh
                </TableHead>

                <TableHead className="w-[14%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Tên dịch vụ
                </TableHead>

                <TableHead className="w-[20%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Mô tả
                </TableHead>

                <TableHead className="w-[11%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Giá
                </TableHead>

                <TableHead className="w-[9%] text-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Số lượng
                </TableHead>

                <TableHead className="w-[12%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Trạng thái
                </TableHead>

                <TableHead className="w-[11%] text-left text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Ngày tạo
                </TableHead>

                <TableHead className="w-[14%] text-right text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* ================= BODY ================= */}
            <TableBody>
              {currentServices.length === 0 && (
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableCell
                    colSpan={8}
                    className="py-12 text-center text-sm text-text-muted"
                  >
                    Chưa có dịch vụ.
                  </TableCell>
                </TableRow>
              )}

              {currentServices.map((service) => (
                <TableRow
                  key={service.serviceId}
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
                      {service.image ? (
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
                            src={service.image}
                            alt={service.name}
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

                          <span className="text-[9px]">No Image</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* ================= TÊN ================= */}
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
                      {service.name}
                    </span>
                  </TableCell>

                  {/* ================= MÔ TẢ ================= */}
                  <TableCell className="max-w-xs">
                    {service.description ? (
                      <span
                        title={service.description}
                        className="
                          block
                          max-w-[240px]
                          truncate
                          text-sm
                          text-text-secondary
                        "
                      >
                        {service.description}
                      </span>
                    ) : (
                      <span className="text-sm italic text-text-muted">
                        Không có mô tả
                      </span>
                    )}
                  </TableCell>

                  {/* ================= GIÁ ================= */}
                  <TableCell>
                    <span className="font-semibold text-text-primary">
                      {service.price.toLocaleString("vi-VN")} đ
                    </span>
                  </TableCell>

                  {/* ================= SỐ LƯỢNG ================= */}
                  <TableCell className="text-center">
                    <span
                      className="
                        inline-flex
                        min-w-8
                        items-center
                        justify-center
                        rounded-md
                        bg-elevated
                        px-2
                        py-1
                        text-xs
                        font-semibold
                        text-text-secondary
                      "
                    >
                      {service.quantity}
                    </span>
                  </TableCell>

                  {/* ================= TRẠNG THÁI ================= */}
                  <TableCell>
                    {service.status === "ACTIVE" ? (
                      <span
                        className="
                          inline-flex
                          items-center
                          rounded-md
                          border
                          border-status-success/20
                          bg-status-success-bg
                          px-2.5
                          py-1
                          text-[11px]
                          font-semibold
                          text-status-success
                        "
                      >
                        Đang hoạt động
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          items-center
                          rounded-md
                          border
                          border-status-danger/20
                          bg-status-danger-bg
                          px-2.5
                          py-1
                          text-[11px]
                          font-semibold
                          text-status-danger
                        "
                      >
                        Ngừng hoạt động
                      </span>
                    )}
                  </TableCell>

                  {/* ================= NGÀY TẠO ================= */}
                  <TableCell>
                    <span className="text-xs text-text-secondary">
                      {new Date(service.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </TableCell>

                  {/* ================= HÀNH ĐỘNG ================= */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        onClick={() => onView(service)}
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

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(service)}
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

                      <Button
                        size="sm"
                        onClick={() => onDelete(service)}
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
