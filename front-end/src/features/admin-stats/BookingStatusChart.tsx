import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { BookingStatusCount } from "./types";

interface Props {
  data: BookingStatusCount[];
}

const statusLabel: Record<string, string> = {
  HOLD: "Đang giữ chỗ",
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

const statusColor: Record<string, string> = {
  HOLD: "#f59e0b",
  PENDING: "#3b82f6",
  CONFIRMED: "#22c55e",
  COMPLETED: "#10b981",
  CANCELLED: "#ef4444",
};

export function BookingStatusChart({ data }: Props) {
  const safeData = data || [];
  const chartData = safeData.map((item) => ({
    name: statusLabel[item.status] || item.status || "Không xác định",
    value: item._count?.status ?? 0,
    status: item.status,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Tỷ lệ trạng thái đặt sân</h2>
      {total === 0 ? (
        <p className="text-sm text-gray-500">Chưa có dữ liệu đặt sân.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.status || index} fill={statusColor[entry.status] || "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
