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
  return(
    <Card className="mt-5">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ảnh</TableHead>
              <TableHead>Tên sân</TableHead>
              <TableHead>Loại sân</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentFields.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  Chưa có sân bóng.
                </TableCell>
              </TableRow>
            )}
            {currentFields.map((field) => (
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

                <TableCell className="font-medium">{field.name}</TableCell>

                <TableCell>{fieldTypeLabel[field.fieldType]}</TableCell>

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
