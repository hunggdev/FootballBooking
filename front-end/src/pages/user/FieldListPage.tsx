import FieldList from "@/features/admin-booking/FieldList";

export default function FieldListPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold tracking-tight text-text-primary">
        Danh sách sân
      </h1>
      <FieldList />
    </div>
  );
}
