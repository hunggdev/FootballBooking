// src/components/home/HeroSearchForm.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const filters = [
  { id: "field", label: "Chọn sân", placeholder: "Tất cả sân" },
  { id: "date", label: "Ngày đặt", placeholder: "Thứ 3, 14/07/2026" },
  { id: "time", label: "Khung giờ", placeholder: "Tất cả khung giờ" },
  { id: "type", label: "Loại sân", placeholder: "Tất cả loại sân" },
];

export function HeroSearchForm() {
  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-base">Tìm sân và đặt ngay</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {filters.map((filter) => (
          <div key={filter.id} className="flex flex-col gap-1.5">
            <Label className="text-xs">{filter.label}</Label>
            <Select>
              <SelectTrigger className="border">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option-1">Tùy chọn 1</SelectItem>
                <SelectItem value="option-2">Tùy chọn 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button variant="outline" className="w-full border">
          Tìm kiếm sân
        </Button>
      </CardContent>
    </Card>
  );
}
