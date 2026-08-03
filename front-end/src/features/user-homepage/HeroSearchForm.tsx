import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Calendar, Search, ShieldCheck } from "lucide-react";
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
import { useFields } from "@/stores/useFieldStore";
import { FIELD_TYPE_LABEL, FIELD_TYPE_SLUG } from "@/types/field";

export function HeroSearchForm() {
  const navigate = useNavigate();
  const { data: fields } = useFields();

  const [selectedFieldId, setSelectedFieldId] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedDate, setSelectedDate] = useState(() => dayjs().format("YYYY-MM-DD"));

  const handleSearch = () => {
    if (selectedFieldId !== "ALL") {
      const field = fields?.find((f) => f.fieldId === Number(selectedFieldId));
      if (field) {
        const slug = FIELD_TYPE_SLUG[field.fieldType] || field.fieldType.toLowerCase();
        navigate(`/user/booking/${slug}/${field.fieldId}?date=${selectedDate}`);
        return;
      }
    }

    const typeQuery = selectedType !== "ALL" ? `&type=${selectedType}` : "";
    navigate(`/user/booking?date=${selectedDate}${typeQuery}`);
  };

  return (
    <Card className="border bg-card shadow-lg backdrop-blur">
      <CardHeader className="pb-3 border-b bg-muted/20">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Search className="h-5 w-5 text-emerald-500" />
          Đặt ngay
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 pt-4">
        {/* Date Selector */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Ngày đặt sân
          </Label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-xs font-semibold shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Field Type */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold">Loại sân bóng</Label>
          <Select value={selectedType} onValueChange={(val) => val && setSelectedType(val)}>
            <SelectTrigger className="h-10 border">
              <SelectValue placeholder="Tất cả loại sân" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả loại sân</SelectItem>
              <SelectItem value="FIVE">Sân 5 người</SelectItem>
              <SelectItem value="SEVEN">Sân 7 người</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Specific Field */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold">Chọn sân cụ thể</Label>
          <Select value={selectedFieldId} onValueChange={(val) => val && setSelectedFieldId(val)}>
            <SelectTrigger className="h-10 border">
              <SelectValue placeholder="Tất cả sân" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả sân</SelectItem>
              {fields?.map((f) => (
                <SelectItem key={f.fieldId} value={String(f.fieldId)}>
                  {f.name} ({FIELD_TYPE_LABEL[f.fieldType]})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleSearch}
          className="w-full h-11 bg-emerald-600 font-bold text-white hover:bg-emerald-500 transition-all shadow-md mt-2 cursor-pointer"
        >
          Đặt ngay →
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Tự động giữ chỗ 10 phút khi chọn khung giờ.
        </p>
      </CardContent>
    </Card>
  );
}
