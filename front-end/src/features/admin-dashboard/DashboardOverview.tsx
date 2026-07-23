// src/components/admin/dashboard/DashboardOverview.tsx
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/layouts/admin/PageHeader";
import { StatsGrid } from "./StatsGrid";
import { RevenueChartCard } from "./RevenueChartCard";
import { BookingTimeDonutCard } from "./BookingTimeDonutCard";
import { RecentActivityFeed } from "./RecentActivityFeed";
import { RecentBookingsTable } from "./RecentBookingsTable";
import { FeaturedOddsList } from "./FeaturedOddsList";
import { SystemAlertsList } from "./SystemAlertsList";

export function DashboardOverview() {
  return (
    <>
      <PageHeader
        title="Tổng quan hệ thống"
        subtitle="Theo dõi và quản lý hoạt động của hệ thống"
        action={
          <Button variant="outline" className="border">
            <Settings2 className="mr-2 h-4 w-4" />
            Tùy chỉnh
          </Button>
        }
      />

      <StatsGrid />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RevenueChartCard />
        </div>
        <div className="lg:col-span-1">
          <BookingTimeDonutCard />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentBookingsTable />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-1">
          <FeaturedOddsList />
          <SystemAlertsList />
        </div>
      </div>
    </>
  );
}
