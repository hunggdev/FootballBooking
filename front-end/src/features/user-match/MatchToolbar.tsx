import { Search, PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { MatchTabValue } from "./types";

interface MatchToolbarProps {
  filter: string;
  onFilterChange: (value: MatchTabValue) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onClick: () => void;
  onChangePage: (value: number) => void;
}

export function MatchToolbar({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  onClick,
  onChangePage
}: MatchToolbarProps) {
  return (
    <div className="space-y-4">
      <Tabs value={filter} onValueChange={(v) => {onFilterChange(v as MatchTabValue); onChangePage(1);}}>
        <TabsList className="border">
          <TabsTrigger value="OPEN">Kèo đang mở</TabsTrigger>
          <TabsTrigger value="MINE">Kèo của tôi</TabsTrigger>
          <TabsTrigger value="JOINED">Kèo đã tham gia</TabsTrigger>
          <TabsTrigger value="FINISHED">Kèo đã kết thúc</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm theo tên kèo, địa điểm, sân..."
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="border" onClick={onClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo kèo đấu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
