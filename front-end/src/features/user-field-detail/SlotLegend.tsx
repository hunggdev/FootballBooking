export function SlotLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-status-success" /> Còn trống
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-status-warning" /> Đang được giữ
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-status-danger" /> Đã đặt
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-text-muted/40" /> Đóng
      </span>
    </div>
  );
}