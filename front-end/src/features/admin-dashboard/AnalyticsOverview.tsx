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
  bookingRateByTime: BookingRateByTime;
}

export function AnalyticsOverview({
  chartStats,
  bookingRateByTime,
}: ChartStatsProps) {
  const [range, setRange] = useState<"7d" | "30d">("7d");

  /**
   * Format ngày
   *
   * 7d  -> 16/08
   * 30d -> 16
   */
  const formatDate = (
    date: string,
    range: "7d" | "30d"
  ) => {
    // Nếu backend trả YYYY-MM-DD
    // dùng split để tránh lỗi timezone
    const parts = date.split("-");

    if (parts.length === 3) {
      const day = parts[2];
      const month = parts[1];

      return range === "7d"
        ? `${day}/${month}`
        : day;
    }

    // Fallback nếu date không phải YYYY-MM-DD
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");

    return range === "7d"
      ? `${day}/${month}`
      : day;
  };

  /**
   * Format doanh thu
   *
   * 500000  -> 500.000 ₫
   * 1200000 -> 1.200.000 ₫
   */
  const formatRevenue = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
  };

  /**
   * Format số tiền trên Y-axis
   *
   * 1000      -> 1K
   * 1000000   -> 1M
   */
  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }

    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(0)}K`;
    }

    return value.toString();
  };

  /**
   * Đảm bảo dữ liệu được sắp xếp theo ngày
   */
  const sortedChartStats = [...(chartStats ?? [])].sort(
    (a, b) => {
      return (
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
      );
    }
  );

  /**
   * Lấy dữ liệu theo range
   *
   * 7d  -> 7 ngày cuối
   * 30d -> toàn bộ 30 ngày
   */
  const filteredChartStats =
    range === "7d"
      ? sortedChartStats.slice(-7)
      : sortedChartStats;

  /**
   * Dữ liệu Pie Chart
   */
  const TimeSlotLabels = [
    {
      key: "morning",
      label: "Sáng",
      percent: bookingRateByTime?.morning || 0,
      color: "#22c55e",
    },
    {
      key: "noon",
      label: "Trưa",
      percent: bookingRateByTime?.noon || 0,
      color: "#f59e0b",
    },
    {
      key: "afternoon",
      label: "Chiều",
      percent: bookingRateByTime?.afternoon || 0,
      color: "#f0a35e",
    },
    {
      key: "evening",
      label: "Tối",
      percent: bookingRateByTime?.evening || 0,
      color: "#ef4444",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* =====================================================
          BIỂU ĐỒ DOANH THU
      ===================================================== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">
            Doanh thu{" "}
            {range === "7d"
              ? "7 ngày qua"
              : "30 ngày qua"}
          </CardTitle>

          <Select
            value={range}
            onValueChange={(value) =>
              setRange(value as "7d" | "30d")
            }
          >
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="7d">
                7 ngày qua
              </SelectItem>

              <SelectItem value="30d">
                30 ngày qua
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <div className="h-56 w-full">
            {filteredChartStats.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Chưa có dữ liệu doanh thu
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={filteredChartStats}
                  margin={{
                    top: 10,
                    right: 5,
                    left: 0,
                    bottom: 5,
                  }}
                  barCategoryGap={
                    range === "30d"
                      ? "15%"
                      : "25%"
                  }
                >
                  {/* Grid ngang */}
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                  />

                  {/* Trục X */}
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      formatDate(
                        date,
                        range
                      )
                    }
                    tick={{
                      fontSize: 10,
                    }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                  />

                  {/* Trục Y */}
                  <YAxis
                    tick={{
                      fontSize: 10,
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={45}
                    tickFormatter={formatYAxis}
                  />

                  {/* Tooltip */}
                  <Tooltip
                    cursor={{
                      opacity: 0.08,
                    }}
                    formatter={(value) => [
                      formatRevenue(
                        Number(value)
                      ),
                      "Doanh thu",
                    ]}
                    labelFormatter={(date) =>
                      formatDate(
                        String(date),
                        range
                      )
                    }
                  />

                  {/* Cột doanh thu */}
                  <Bar
                    dataKey="revenue"
                    name="Doanh thu"
                    radius={[
                      4,
                      4,
                      0,
                      0,
                    ]}
                    maxBarSize={
                      range === "30d"
                        ? 18
                        : 40
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          TỶ LỆ ĐẶT SÂN THEO KHUNG GIỜ
      ===================================================== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Tỷ lệ đặt sân theo khung giờ
          </CardTitle>
        </CardHeader>

        <CardContent className="flex items-center gap-4">
          {/* Pie Chart */}
          <div className="h-[220px] w-[220px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={TimeSlotLabels}
                  dataKey="percent"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={78}
                  paddingAngle={0}
                  stroke="none"
                >
                  {TimeSlotLabels.map(
                    (item) => (
                      <Cell
                        key={item.key}
                        fill={item.color}
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Tỷ lệ",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {TimeSlotLabels.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className="h-2 w-2 rounded-full border"
                    style={{
                      backgroundColor:
                        s.color,
                    }}
                  />

                  {s.label}
                </span>

                <span className="font-medium">
                  {s.percent}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}