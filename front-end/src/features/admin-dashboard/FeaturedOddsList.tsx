// src/features/admin-dashboard/FeaturedOddsList.tsx
import type { FeaturedOdds } from "@/features/admin-dashboard/types";

interface Props {
  odds: FeaturedOdds[];
}

export function FeaturedOddsList({ odds }: Props) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Kèo nổi bật</h2>
      <ul className="space-y-3">
        {odds.map((o) => (
          <li
            key={o.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div>
              <p className="text-sm font-medium">{o.title}</p>
              <p className="text-xs text-gray-500">{o.location}</p>
              <p className="text-xs text-gray-500">{o.participants}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                o.status === "open"
                  ? "bg-green-100 text-green-600"
                  : o.status === "almost-full"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {o.status}
            </span>
          </li>
        ))}
        {odds.length === 0 && (
          <li className="text-center text-gray-500">Không có kèo nổi bật</li>
        )}
      </ul>
    </div>
  );
}
