// src/components/account/AccountInfoList.tsx

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types/user";

interface InfoRow {
  label: string;
  value: string;
}

function formatDate(iso?: string) {
  if (!iso) return "--";
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
    <Card className="border-border bg-surface text-text-primary">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-text-primary">
          Thông tin cá nhân
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {rows.map((row, idx) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-4 py-1 text-sm">
              <span className="text-text-secondary">
                {row.label}
              </span>

              <span className="font-medium text-text-primary">
                {row.value}
              </span>
            </div>

            {idx !== rows.length - 1 && (
              <Separator className="bg-border-subtle" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}