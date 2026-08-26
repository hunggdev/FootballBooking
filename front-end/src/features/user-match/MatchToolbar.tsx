import { Search, PlusCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  onChangePage,
}: MatchToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Tabs */}
      <Tabs
        value={filter}
        onValueChange={(value) => {
          onFilterChange(value as MatchTabValue);
          onChangePage(1);
        }}
      >
        <TabsList className="h-auto border border-border bg-surface p-1">
          <TabsTrigger
            value="OPEN"
            className="
              text-text-secondary
              transition-colors
              hover:bg-surface-hover
              hover:text-text-primary
              data-[state=active]:bg-brand-primary
              data-[state=active]:text-white
              data-[state=active]:hover:bg-brand-primary-hover
            "
          >
            Kèo đang mở
          </TabsTrigger>

          <TabsTrigger
            value="MINE"
            className="
              text-text-secondary
              transition-colors
              hover:bg-surface-hover
              hover:text-text-primary
              data-[state=active]:bg-brand-primary
              data-[state=active]:text-white
              data-[state=active]:hover:bg-brand-primary-hover
            "
          >
            Kèo của tôi
          </TabsTrigger>

          <TabsTrigger
            value="JOINED"
            className="
              text-text-secondary
              transition-colors
              hover:bg-surface-hover
              hover:text-text-primary
              data-[state=active]:bg-brand-primary
              data-[state=active]:text-white
              data-[state=active]:hover:bg-brand-primary-hover
            "
          >
            Kèo đang tham gia
          </TabsTrigger>

          <TabsTrigger
            value="FINISHED"
            className="
              text-text-secondary
              transition-colors
              hover:bg-surface-hover
              hover:text-text-primary
              data-[state=active]:bg-brand-primary
              data-[state=active]:text-white
              data-[state=active]:hover:bg-brand-primary-hover
            "
          >
            Kèo đã kết thúc
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Search + Create */}
      <Card className="border-border bg-surface">
        <CardContent className="flex flex-col gap-3 p-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-text-muted
              "
            />

            <Input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm theo tên người tạo..."
              className="
                border-border
                bg-surface
                pl-9
                text-text-primary
                placeholder:text-text-muted
                transition-colors
                hover:border-brand-primary/50
                focus-visible:border-brand-primary
                focus-visible:ring-1
                focus-visible:ring-brand-primary
              "
            />
          </div>

          {/* Create button */}
          <Button
            type="button"
            onClick={onClick}
            className="
              bg-brand-primary
              text-white
              transition-colors
              hover:bg-brand-primary-hover
            "
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo kèo đấu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}