import { StatCard } from "./StatCard";
import { BookingStatusBreakdown } from "./BookingStatusBreakdown";
import { MatchStatusBreakdown } from "./MatchStatusBreakdown";
import { RevenueSummaryCard } from "./RevenueSummaryCard";
import { mockAdminStats } from "./mockAdminStats";
import type { AdminStatsData } from "./types";

interface ManageStatsProps {
  /** Cho phép truyền dữ liệu thật từ API; mặc định dùng mock để xem trước UI. */
  data?: AdminStatsData;
}

export function ManageStats({ data = mockAdminStats }: ManageStatsProps) {
  return (
    <div className="space-y-4">
      {/* Hàng KPI tổng quan: người dùng, đặt sân, sân, kèo đấu, đánh giá, thông báo */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {data.overview.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Hàng phân bổ trạng thái + doanh thu */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BookingStatusBreakdown data={data.bookingStatusCounts} />
        <MatchStatusBreakdown data={data.matchStatusCounts} />
        <RevenueSummaryCard data={data.revenueSummary} />
      </div>
    </div>
  );
}
