// src/services/dashboardService.ts
import axios from "axios";
import type {
  StatItem,
  BookingRow,
  ActivityItem,
  FeaturedOdds,
  SystemAlert,
  RevenueSummary,
  DonutSlice,
} from "@/features/admin-dashboard/types";

const API_URL = "/api/dashboard";

export async function getDashboardStats(): Promise<StatItem[]> {
  const res = await axios.get(`${API_URL}/stats`);
  return res.data;
}

export async function getRecentBookings(): Promise<BookingRow[]> {
  const res = await axios.get(`${API_URL}/recent-bookings`);
  return res.data;
}

export async function getRecentActivities(): Promise<ActivityItem[]> {
  const res = await axios.get(`${API_URL}/activities`);
  return res.data;
}

export async function getFeaturedOdds(): Promise<FeaturedOdds[]> {
  const res = await axios.get(`${API_URL}/featured-odds`);
  return res.data;
}

export async function getSystemAlerts(): Promise<SystemAlert[]> {
  const res = await axios.get(`${API_URL}/alerts`);
  return res.data;
}

export async function getRevenueSummary(): Promise<RevenueSummary[]> {
  const res = await axios.get(`${API_URL}/revenue`);
  return res.data;
}

export async function getBookingTimeDistribution(): Promise<DonutSlice[]> {
  const res = await axios.get(`${API_URL}/booking-time`);
  return res.data;
}
