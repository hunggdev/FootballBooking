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

import type { Field } from "@/types/field";

interface Props {
  fields: Field[];
  onView: (field: Field) => void;
  onEdit: (field: Field) => void;
  onDelete: (field: Field) => void;
}

const statusLabel: Record<Field["status"], string> = {
  ACTIVE: "Đang hoạt động",
  MAINTENANCE: "Bảo trì",
  INACTIVE: "Ngừng hoạt động",
};

const statusVariant: Record<
  Field["status"],
  "default" | "secondary" | "destructive"
> = {
  ACTIVE: "default",
  MAINTENANCE: "secondary",
  INACTIVE: "destructive",
};

const fieldTypeLabel: Record<Field["fieldType"], string> = {
  FIVE: "Sân 5 người",
  SEVEN: "Sân 7 người",
};

export function FieldsTable({
  fields,
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
              <TableHead>Tên sân</TableHead>
              <TableHead>Loại sân</TableHead>
              <TableHead>Giá / giờ</TableHead>
              <TableHead>Khung giờ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {fields.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  Chưa có sân bóng.
                </TableCell>
              </TableRow>
            )}
            {fields.map((field) => (
              <TableRow key={field.fieldId}>
                <TableCell>

                  {field.image ? (
                    <img
                      src={field.image}
                      alt={field.name}
                      className="h-14 w-20 rounded-md object-cover border"
                    />
                  ) : (
                    <div className="flex h-14 w-20 items-center justify-center rounded-md border text-xs text-muted-foreground">
                      No Image
                    </div>
                  )}
                </TableCell>

                <TableCell className="font-medium">
                  {field.name}
                </TableCell>

                <TableCell>
                  {fieldTypeLabel[field.fieldType]}
                </TableCell>

                <TableCell>
                  {Number(field.pricePerHour).toLocaleString("vi-VN")} đ
                </TableCell>

                <TableCell>
                  {field.openTime} - {field.closeTime}
                </TableCell>

                <TableCell>

                  <Badge
                    variant={statusVariant[field.status]}
                  >
                    {statusLabel[field.status]}
                  </Badge>

                </TableCell>

                <TableCell className="space-x-2 text-right">

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onView(field)}
                  >
                    Xem
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(field)}
                  >
                    Sửa
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={field.status === "INACTIVE"}
                    onClick={() => onDelete(field)}
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