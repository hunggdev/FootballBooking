// src/features/admin-dashboard/AnalyticsOverview.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface ChartStats {
  date: string;
  revenue: number;
  bookings: number;
}

interface BookingRateByTime {
  morning: number;
  noon: number;
  afternoon: number;
  evening: number;
}

interface ChartStatsProps {
  chartStats: ChartStats[];
  bookingRateByTime: BookingRateByTime | null;
}

export function AnalyticsOverview({
  chartStats,
  bookingRateByTime,
}: ChartStatsProps) {
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const formatDate = (date: string, range: "7d" | "30d") => {
    const parts = date.split("-");
    if (parts.length === 3) {
      const day = parts[2];
      const month = parts[1];
      return range === "7d" ? `${day}/${month}` : day;
    }
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return range === "7d" ? `${day}/${month}` : day;
  };

  const formatRevenue = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  };

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const sortedChartStats = [...(chartStats ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const filteredChartStats =
    range === "7d" ? sortedChartStats.slice(-7) : sortedChartStats;

  const totalRevenue = filteredChartStats.reduce(
    (acc, curr) => acc + Number(curr.revenue || 0),
    0,
  );

  const TimeSlotLabels = [
    {
      key: "morning",
      label: "Sáng (06:00 - 11:00)",
      shortLabel: "Sáng",
      percent: bookingRateByTime?.morning || 0,
      color: "#22a55a",
      bgClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      key: "noon",
      label: "Trưa (11:00 - 14:00)",
      shortLabel: "Trưa",
      percent: bookingRateByTime?.noon || 0,
      color: "#f5a623",
      bgClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    {
      key: "afternoon",
      label: "Chiều (14:00 - 18:00)",
      shortLabel: "Chiều",
      percent: bookingRateByTime?.afternoon || 0,
      color: "#38bdf8",
      bgClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    },
    {
      key: "evening",
      label: "Tối (18:00 - 23:00)",
      shortLabel: "Tối",
      percent: bookingRateByTime?.evening || 0,
      color: "#a855f7",
      bgClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* ================= BIỂU ĐỒ DOANH THU ================= */}
      <Card className="rounded-xl border border-border bg-surface shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary/15 text-brand-primary border border-brand-primary/20">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-text-primary">
                Biểu đồ doanh thu
              </CardTitle>
              <p className="text-[11px] text-text-muted mt-0.5">
                Tổng:{" "}
                <span className="font-semibold text-brand-accent">
                  {formatRevenue(totalRevenue)}
                </span>{" "}
                ({range === "7d" ? "7 ngày gần nhất" : "30 ngày gần nhất"})
              </p>
            </div>
          </div>

          <Select
            value={range}
            onValueChange={(value) => setRange(value as "7d" | "30d")}
          >
            <SelectTrigger className="h-8 w-32 border-border bg-elevated text-xs text-text-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-elevated text-text-primary">
              <SelectItem
                value="7d"
                className="text-text-secondary focus:text-text-primary"
              >
                7 ngày qua
              </SelectItem>
              <SelectItem
                value="30d"
                className="text-text-secondary focus:text-text-primary"
              >
                30 ngày qua
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="h-64 w-full">
            {filteredChartStats.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-text-muted">
                Chưa có dữ liệu doanh thu trong khoảng thời gian này
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredChartStats}
                  margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
                  barCategoryGap={range === "30d" ? "15%" : "25%"}
                >
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#22a55a" stopOpacity={0.9} />
                      <stop
                        offset="100%"
                        stopColor="#22a55a"
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255, 255, 255, 0.06)"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => formatDate(date, range)}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={{ stroke: "#232f42" }}
                  />

                  <YAxis
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    width={50}
                    tickFormatter={formatYAxis}
                  />

                  <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.04)" }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-elevated/95 p-3 shadow-xl backdrop-blur-md">
                            <p className="text-xs font-semibold text-text-muted mb-1">
                              Ngày: {formatDate(String(label), range)}
                            </p>
                            <p className="text-sm font-bold text-brand-accent">
                              {formatRevenue(Number(payload[0].value))}
                            </p>
                            {/* {payload[0].payload?.bookings !== undefined && (
                              <p className="text-[11px] text-text-secondary mt-0.5">
                                Lượt đặt: {payload[0].payload.bookings} đơn
                              </p>
                            )} */}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Bar
                    dataKey="revenue"
                    name="Doanh thu"
                    fill="url(#revenueGradient)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={range === "30d" ? 18 : 36}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ================= TỶ LỆ ĐẶT SÂN THEO KHUNG GIỜ ================= */}
      <Card className="rounded-xl border border-border bg-surface shadow-sm">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-accent/15 text-brand-accent border border-brand-accent/20">
              <PieChartIcon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-text-primary">
                Tỷ lệ đặt sân theo khung giờ
              </CardTitle>
              <p className="text-[11px] text-text-muted mt-0.5">
                Phân bố nhu cầu đặt sân trong ngày
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Pie Chart */}
            <div className="relative h-56 w-56 shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TimeSlotLabels}
                    dataKey="percent"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={84}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {TimeSlotLabels.map((item) => (
                      <Cell key={item.key} fill={item.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border border-border bg-elevated/95 p-2.5 shadow-xl backdrop-blur-md">
                            <p className="text-xs font-semibold text-text-primary">
                              {data.label}
                            </p>
                            <p
                              className="text-sm font-bold mt-0.5"
                              style={{ color: data.color }}
                            >
                              Tỷ lệ: {data.percent}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="pointer-events-none absolute flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                  Khung giờ
                </span>
                <span className="text-xs font-semibold text-text-primary">
                  Sôi động
                </span>
              </div>
            </div>

            {/* Legend & Breakdown Bars */}
            <div className="flex-1 w-full space-y-3">
              {TimeSlotLabels.map((s) => (
                <div
                  key={s.key}
                  className="flex flex-col gap-1 rounded-lg border border-border/50 bg-elevated/40 p-2.5 transition-colors hover:border-border"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-text-primary">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </span>
                    <span
                      className="font-bold text-xs"
                      style={{ color: s.color }}
                    >
                      {s.percent}%
                    </span>
                  </div>

                  {/* Progress track */}
                  <div className="h-1.5 w-full rounded-full bg-border/80 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${s.percent}%`,
                        backgroundColor: s.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
