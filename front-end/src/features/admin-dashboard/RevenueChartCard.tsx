// src/features/admin-dashboard/RevenueChartCard.tsx
import type { RevenueSummary } from "@/features/admin-dashboard/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: RevenueSummary[];
}

export function RevenueChartCard({ data }: Props) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
