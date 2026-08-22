// src/features/admin-dashboard/DashboardOverviewPage.tsx
import { PageHeader } from "@/layouts/admin/PageHeader";
import { StatsSummary } from "./StatsSummary";
import { AnalyticsOverview } from "./AnalyticsOverview";
import { BookingsAndHighlights } from "./BookingsAndHighlights";
import {
  useOverviewStats,
  useChartStats,
  useRecentStats,
} from "@/stores/useDBStore";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardOverviewPage() {
  const {
    data: overviewStats,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useOverviewStats();
  const {
    data: chartStats,
    isLoading: chartLoading,
    refetch: refetchChart,
  } = useChartStats();
  const {
    data: recentStats,
    isLoading: recentLoading,
    refetch: refetchRecent,
  } = useRecentStats();

  const isRefreshing = overviewLoading || chartLoading || recentLoading;

  const handleRefresh = () => {
    refetchOverview();
    refetchChart();
    refetchRecent();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader
          title="Tổng quan hệ thống"
          subtitle="Theo dõi và quản lý dữ liệu hoạt động sân bóng thời gian thực"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-border bg-surface text-text-secondary hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-brand-primary cursor-pointer transition-all duration-200"
        >
          <RefreshCw
            className={`mr-2 h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-brand-primary" : ""}`}
          />
          {isRefreshing ? "Đang đồng bộ..." : "Làm mới dữ liệu"}
        </Button>
      </div>

      {/* Component 1: Hàng thẻ chỉ số tổng quan */}
      <StatsSummary overviewStats={overviewStats} isLoading={overviewLoading} />

      {/* Component 2: Biểu đồ doanh thu & tỷ lệ khung giờ */}
      <AnalyticsOverview
        chartStats={chartStats?.chart || []}
        bookingRateByTime={chartStats?.bookingRateByTime || null}
      />

      {/* Component 3: Bảng đặt sân mới nhất + Kèo đấu nổi bật + Đánh giá */}
      <BookingsAndHighlights
        bookings={recentStats?.recentBookings || []}
        matchs={recentStats?.featuredMatches || []}
        reviews={recentStats?.recentReviews || []}
      />
    </div>
  );
}
