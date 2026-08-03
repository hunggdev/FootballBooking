import type { TopFieldStat } from "./types";

interface Props {
  data: TopFieldStat[];
}

export function TopFieldsCard({ data }: Props) {
  const safeData = data || [];
  const maxCount = safeData.length > 0
    ? Math.max(1, ...safeData.map((item) => item.bookingCount || 0))
    : 1;

  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Top sân được đặt nhiều nhất</h2>
      {safeData.length === 0 ? (
        <p className="text-sm text-gray-500">Chưa có dữ liệu đặt sân.</p>
      ) : (
        <ul className="space-y-3">
          {safeData.map((item, index) => (
            <li key={item.slotId ?? index} className="flex items-center gap-3">
              <span className="w-6 text-sm font-semibold text-gray-500">
                #{index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{item.fieldName || "Không xác định"}</span>
                  <span className="text-gray-500">{item.bookingCount || 0} lượt</span>
                </div>
                <div className="h-2 w-full rounded bg-gray-100">
                  <div
                    className="h-2 rounded bg-blue-500"
                    style={{ width: `${((item.bookingCount || 0) / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
