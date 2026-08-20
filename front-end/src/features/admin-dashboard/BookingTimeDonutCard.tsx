import type { DonutSlice } from "@/features/admin-dashboard/types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: DonutSlice[];
}

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function BookingTimeDonutCard({ data }: Props) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Phân bổ thời gian đặt sân</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="percentage"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((slice, index) => (
              <Cell
                key={slice.label} //
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
