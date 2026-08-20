import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsSummary } from "./StatsSummary";
import { AnalyticsOverview } from "./AnalyticsOverview";
import { BookingsAndHighlights } from "./BookingsAndHighlights";

import {
  useOverviewStats,
  useChartStats,
  useRecentStats,
} from "@/stores/useDBStore";

export default function DashboardOverviewPage() {
  const { data: overviewStats, isLoading: overviewLoading } = useOverviewStats();
  const { data: chartStats, isLoading: chartLoading } = useChartStats();
  const { data: recentStats, isLoading: recentLoading } = useRecentStats();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tổng quan hệ thống</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi và quản lý hoạt động của hệ thống
          </p>
        </div>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Tùy chỉnh
        </Button>
      </div>

      {/* Component 1: hàng thẻ thống kê */}
      <StatsSummary overviewStats={overviewStats} />

      {/* Component 2: doanh thu + tỷ lệ khung giờ + hoạt động gần đây */}
      <AnalyticsOverview
        chartStats={chartStats?.chart || []}
        bookingRateByTime={chartStats?.bookingRateByTime || null} 
        />

      {/* Component 3: bảng đặt sân + kèo đấu nổi bật + cảnh báo hệ thống */}
      <BookingsAndHighlights
        bookings={recentStats?.recentBookings || []}
        matchs={recentStats?.featuredMatches || []} 
        reviews={recentStats?.recentReviews || []} 
      />
    </div>
  );
}
