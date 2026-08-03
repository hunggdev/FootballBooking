import type { ActivityItem } from "@/features/admin-dashboard/types";

interface Props {
  activities: ActivityItem[];
}

export function RecentActivityFeed({ activities }: Props) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Hoạt động gần đây</h2>
      <ul className="space-y-3">
        {activities.map((a) => (
          <li key={a.id} className="flex items-center gap-3 border-b pb-2">
            <a.icon className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm">{a.description}</p>
              <p className="text-xs text-gray-500">{a.time}</p>
            </div>
          </li>
        ))}
        {activities.length === 0 && (
          <li className="text-center text-gray-500">Không có hoạt động nào</li>
        )}
      </ul>
    </div>
  );
}
