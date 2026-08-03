export interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalFields: number;
  totalBookings: number;
  totalInvoices: number;
  totalRevenue: number;
  bookingStatus: BookingStatusCount[];
  topFields: TopFieldStat[];
}

export interface BookingStatusCount {
  status: "HOLD" | "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | string;
  _count: {
    status: number;
  };
}

export interface TopFieldStat {
  slotId: number;
  fieldName: string;
  bookingCount: number;
}
