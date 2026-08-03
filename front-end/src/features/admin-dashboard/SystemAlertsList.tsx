import type { SystemAlert } from "@/features/admin-dashboard/types";
import { Button } from "@/components/ui/button";

interface Props {
  alerts: SystemAlert[];
}

export function SystemAlertsList({ alerts }: Props) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Cảnh báo hệ thống</h2>
      <ul className="space-y-3">
        {alerts.map((a) => (
          <li
            key={a.id}
            className={`flex items-center justify-between border-b pb-2 ${
              a.urgent ? "bg-red-50" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <a.icon className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                {a.subtitle && (
                  <p className="text-xs text-gray-500">{a.subtitle}</p>
                )}
              </div>
            </div>
            <Button
              variant={a.urgent ? "destructive" : "outline"}
              size="sm"
            >
              {a.actionLabel}
            </Button>
          </li>
        ))}
        {alerts.length === 0 && (
          <li className="text-center text-gray-500">Không có cảnh báo nào</li>
        )}
      </ul>
    </div>
  );
}
