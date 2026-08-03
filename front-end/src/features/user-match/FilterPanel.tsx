import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export function FilterPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Bộ lọc tìm kiếm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Ngày</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả các ngày" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả các ngày</SelectItem>
              <SelectItem value="today">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Khung giờ</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả khung giờ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả khung giờ</SelectItem>
              <SelectItem value="morning">Buổi sáng</SelectItem>
              <SelectItem value="evening">Buổi tối</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Hình thức</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả (5vs5, 7vs7, 11vs11)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="5vs5">5vs5</SelectItem>
              <SelectItem value="7vs7">7vs7</SelectItem>
              <SelectItem value="11vs11">11vs11</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Sân</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả sân" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả sân</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Giá tiền / đội</span>
          </div>
          <Slider defaultValue={[500000]} max={500000} step={10000} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0đ</span>
            <span>500.000đ+</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Số lượng người</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full">Tìm kèo</Button>
      </CardContent>
    </Card>
  );
}
