// src/components/account/AccountInfoList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types/user";

interface InfoRow {
  label: string;
  value: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN");
}

export function AccountInfoList({ user }: { user: User }) {
  const rows: InfoRow[] = [
    { label: "Họ và tên", value: user.fullName },
    { label: "Email", value: user.email },
    { label: "Số điện thoại", value: user.phone ?? "Chưa cập nhật" },
    { label: "Ngày tham gia", value: formatDate(user.createdAt) },
  ];

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rows.map((row, idx) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-4 py-1 text-sm">
              <span className="opacity-60">{row.label}</span>
              <span className="font-medium">{row.value}</span>
            </div>
            {idx !== rows.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
