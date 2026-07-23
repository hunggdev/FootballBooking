// src/components/home/FeaturedFields.tsx
import { Button } from "@/components/ui/button";
import { FieldCard } from "./FieldCard";
import type { FieldItem } from "@/types/home.ts";

const fields: FieldItem[] = [
  {
    id: "1",
    name: "Sân S",
    address: "Quận Thanh Khê, Đà Nẵng",
    pricePerHour: 200000,
    rating: 4.8,
    status: "available",
    capacity: "7 người",
    hasLight: true,
    isArtificialGrass: true,
  },
  {
    id: "2",
    name: "Sân A Plus",
    address: "Quận Liên Chiểu, Đà Nẵng",
    pricePerHour: 180000,
    rating: 4.6,
    status: "available",
    capacity: "7 người",
    hasLight: true,
    isArtificialGrass: true,
  },
  {
    id: "3",
    name: "Sân B Champions",
    address: "Quận Hải Châu, Đà Nẵng",
    pricePerHour: 250000,
    rating: 4.7,
    status: "almost-full",
    capacity: "11 người",
    hasLight: true,
    isArtificialGrass: true,
  },
  {
    id: "4",
    name: "Sân C Sport",
    address: "Quận Cẩm Lệ, Đà Nẵng",
    pricePerHour: 160000,
    rating: 4.5,
    status: "available",
    capacity: "5 người",
    hasLight: true,
    isArtificialGrass: true,
  },
];

export function FeaturedFields() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sân nổi bật</h2>
        <Button variant="link" className="text-sm">
          Xem tất cả sân →
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field) => (
          <FieldCard key={field.id} field={field} />
        ))}
      </div>
    </section>
  );
}
