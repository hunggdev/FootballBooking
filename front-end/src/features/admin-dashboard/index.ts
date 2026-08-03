// src/components/admin/index.ts

// layout
export * from "@/layouts/admin/AdminLayout";
export * from "@/layouts/admin/Sidebar";
export * from "@/layouts/admin/AdminTopHeader";
export * from "@/layouts/admin/PageHeader";

// dashboard
export * from "@/features/admin-dashboard/DashboardOverview";
export * from "@/features/admin-dashboard/StatCard";
export * from "@/features/admin-dashboard/StatsGrid";
export * from "@/features/admin-dashboard/RevenueChartCard";
export * from "@/features/admin-dashboard/BookingTimeDonutCard";
export * from "@/features/admin-dashboard/RecentActivityFeed";
export * from "@/features/admin-dashboard/RecentBookingsTable";
export * from "@/features/admin-dashboard/FeaturedOddsList";
export * from "@/features/admin-dashboard/SystemAlertsList";

// các module khác sẽ mở sau khi BE hoàn thiện
// export * from "./customers/CustomersPage";
// export * from "./customers/CustomersTable";
// export * from "./fields/FieldsPage";
// export * from "./fields/FieldsTable";
// export * from "./fields/FieldTimeSlots";
// export * from "./services/ServicesPage";
// export * from "./services/ServicesTable";
// export * from "./odds/OddsPage";
// export * from "./odds/OddsTable";
// export * from "./revenue/RevenuePage";
// export * from "./revenue/RevenueSummaryCards";
// export * from "./revenue/RevenueChartPlaceholder";
// export * from "./revenue/RevenueBreakdownTable";

export * from "./types";
