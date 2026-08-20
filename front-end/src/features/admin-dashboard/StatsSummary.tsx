import { Card, CardContent } from "@/components/ui/card";
import type { OverviewStat } from "./dashboard";



interface StatsSummaryProps {
  overviewStats : OverviewStat
}

export function StatsSummary({overviewStats}: StatsSummaryProps) {
  const displayStats = [
  {
    id: "1",
    label: "Tổng doanh thu (tháng) ",
    value: overviewStats?.monthlyRevenue,
    helperText: "", 
  },
  {
    id: "2",
    label: "Lượt đặt sân (tháng)",
    value: overviewStats?.monthlyBookings,
    helperText: "", 
  },

  {
    id: "3",
    label: "Kèo đấu đang mở",
    value: overviewStats?.openMatches,
    helperText: "", 
  },

  {
    id: "4",
    label: "Khách hàng",
    value: overviewStats?.totalCustomers,
    helperText: "", 
  },

  {
    id: "5",
    label: "Đánh giá",
    value: overviewStats?.reviews.average,
    helperText: `Từ ${overviewStats?.reviews.total} đánh giá`,
  }
];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 lg:grid-cols-5">
      {displayStats.map((stat) => (
        <Card key={stat.id}>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 shrink-0 rounded-md border" />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.helperText}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
