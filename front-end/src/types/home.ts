// src/components/home/types.ts
// Dùng chung cho các component trong module "home"

export interface FieldItem {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  rating: number;
  status: "available" | "almost-full" | "full";
  capacity: string;
  hasLight: boolean;
  isArtificialGrass: boolean;
}

export interface EventItem {
  id: string;
  day: string;
  month: string;
  title: string;
  location: string;
  participants: string;
  statusLabel: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface QuickFeatureItem {
  id: string;
  title: string;
  subtitle: string;
}
