import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Monitor,
  Ban,
  CircleCheck,
  Clock3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { StatsGrid } from "@/features/admin-dashboard/StatsGrid";
import type { StatItem } from "@/features/admin-dashboard/types";

const iconMap: Record<string, LucideIcon> = {
  customers: Users,
  totalUserInThisMonth: UserPlus,
  online: Monitor,
  bannedCustomers: Ban,
  activeCustomers: CircleCheck,
  inactiveCustomers: Clock3,
};

const labelMap: Record<string, string> = {
  customers: "Khách hàng",
  totalUserInThisMonth: "Mới tháng này",
  online: "Đang online",
  bannedCustomers: "Bị khóa",
  activeCustomers: "Đang hoạt động",
  inactiveCustomers: "Không hoạt động",
};

export default function StatsBar() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/customers/stats",
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Không thể lấy thống kê");
        }

        const data = await res.json();

        const statsArray: StatItem[] = Object.entries(data).map(
          ([key, value]) => ({
            id: key,
            label: labelMap[key] ?? key,
            value: Number(value),
            icon: iconMap[key] ?? Users,
          })
        );

        setStats(statsArray);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="
              h-28
              animate-pulse
              rounded-xl
              border
              border-border
              bg-surface
            "
          />
        ))}
      </div>
    );
  }

  return <StatsGrid stats={stats} />;
}