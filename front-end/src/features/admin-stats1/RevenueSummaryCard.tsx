import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RevenueSummary } from "./types";

interface RevenueSummaryCardProps {
  data: RevenueSummary;
}

function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")}đ`;
}

export function RevenueSummaryCard({ data }: RevenueSummaryCardProps) {
  const rows: { label: string; value: number }[] = [
    { label: "Tổng giá trị hoá đơn", value: data.totalInvoiceAmount },
    { label: "Đã thanh toán", value: data.paidAmount },
    { label: "Còn lại", value: data.remainAmount },
    { label: "Tiền cọc đã thu", value: data.depositCollected },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Tổng hợp doanh thu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row, index) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium">{formatCurrency(row.value)}</span>
            </div>
            {index < rows.length - 1 && <Separator className="mt-3" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
