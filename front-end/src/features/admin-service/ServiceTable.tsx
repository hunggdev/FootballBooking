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

import type { Service } from "@/types/service";

interface Props {
  services: Service[];
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export function ServiceTable({ services, onView, onEdit, onDelete }: Props) {
  return (
    <Card className="mt-5">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tên dịch vụ</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-muted-foreground"
                >
                  Chưa có dịch vụ.
                </TableCell>
              </TableRow>
            )}
            {services.map((service: Service) => (
              <TableRow key={service.serviceId}>
                <TableCell>
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-14 w-20 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="flex h-14 w-20 items-center justify-center rounded-md border text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </TableCell>

                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {service.description ?? (
                    <span className="text-muted-foreground">Không có mô tả</span>
                  )}
                </TableCell>
                <TableCell>
                  {service.price.toLocaleString("vi-VN")} đ
                </TableCell>
                <TableCell>{service.quantity}</TableCell>
                <TableCell>
                  {service.status === "ACTIVE" ? (
                    <span className="text-green-600 font-semibold">Đang hoạt động</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Ngừng hoạt động</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(service.createdAt).toLocaleString("vi-VN")}
                </TableCell>

                <TableCell className="space-x-2 text-right">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onView(service)}
                  >
                    Xem
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(service)}
                  >
                    Sửa
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(service)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
