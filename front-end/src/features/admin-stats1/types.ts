// Các union type bám theo enum trong schema.prisma để tránh lệch dữ liệu khi nối API thật.
export type BookingStatus = "HOLD" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type MatchStatus = "OPEN" | "MATCHED" | "FINISHED" | "CANCELLED";
export type FieldType = "FIVE" | "SEVEN" | "ELEVEN";

export interface OverviewStat {
  id: string;
  label: string;
  value: string;
  helperText?: string;
}

export interface BookingStatusCount {
  status: BookingStatus;
  label: string;
  count: number;
}

export interface MatchStatusCount {
  status: MatchStatus;
  label: string;
  count: number;
}

/**
 * Tổng hợp từ model Invoice:
 * totalInvoiceAmount = SUM(totalAmount)
 * paidAmount         = SUM(totalAmount) WHERE status = PAID
 * remainAmount       = SUM(remainAmount)
 * depositCollected   = SUM(deposit)
 */
export interface RevenueSummary {
  totalInvoiceAmount: number;
  paidAmount: number;
  remainAmount: number;
  depositCollected: number;
}

export interface AdminStatsData {
  overview: OverviewStat[];
  bookingStatusCounts: BookingStatusCount[];
  matchStatusCounts: MatchStatusCount[];
  revenueSummary: RevenueSummary;
}
