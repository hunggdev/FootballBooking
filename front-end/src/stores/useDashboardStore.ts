import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getRecentBookings,
  getRecentActivities,
  getFeaturedOdds,
  getSystemAlerts,
  getRevenueSummary,
  getBookingTimeDistribution,
} from "@/services/dashboardService";

export function useDashboardStats() {
  return useQuery({ queryKey: ["dashboard", "stats"], queryFn: getDashboardStats });
}

export function useRecentBookings() {
  return useQuery({ queryKey: ["dashboard", "recent-bookings"], queryFn: getRecentBookings });
}

export function useRecentActivities() {
  return useQuery({ queryKey: ["dashboard", "activities"], queryFn: getRecentActivities });
}

export function useFeaturedOdds() {
  return useQuery({ queryKey: ["dashboard", "featured-odds"], queryFn: getFeaturedOdds });
}

export function useSystemAlerts() {
  return useQuery({ queryKey: ["dashboard", "alerts"], queryFn: getSystemAlerts });
}

export function useRevenueSummary() {
  return useQuery({ queryKey: ["dashboard", "revenue"], queryFn: getRevenueSummary });
}

export function useBookingTimeDistribution() {
  return useQuery({ queryKey: ["dashboard", "booking-time"], queryFn: getBookingTimeDistribution });
}
