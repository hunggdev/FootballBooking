import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Service } from "@/types/service";

interface Props {
  services: Service[];
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

const statusLabel: Record<Service["status"], string> = {
  ACTIVE: "Đang hoạt động",
  INACTIVE: "Ngừng hoạt động",
};

const statusVariant: Record<
  Service["status"],
  "default" | "destructive"
> = {
  ACTIVE: "default",
  INACTIVE: "destructive",
};

export function ServiceTable({
  services,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Card className="mt-5">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tên dịch vụ</TableHead>
              <TableHead>Giá</TableHead>
              {/* Thêm tiêu đề cột Số lượng */}
              <TableHead>Số lượng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {services.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6} // Đã sửa từ 5 thành 6 vì thêm 1 cột
                  className="text-center py-10 text-muted-foreground"
                >
                  Chưa có dịch vụ.
                </TableCell>
              </TableRow>
            )}

            {services.map((service) => (
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

                <TableCell className="font-medium">
                  {service.name}
                </TableCell>

                <TableCell>
                  {Number(service.price).toLocaleString("vi-VN")} đ
                </TableCell>

                {/* Thêm ô hiển thị Số lượng */}
                <TableCell>
                  {service.quantity}
                </TableCell>

                <TableCell>
                  <Badge
                    variant={statusVariant[service.status]}
                  >
                    {statusLabel[service.status]}
                  </Badge>
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
                    disabled={service.status === "INACTIVE"}
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