import type { Match, Tournament, GuideItem } from "./types";

export const mockMatches: Match[] = [
  {
    id: "1",
    status: "hot",
    format: "5vs5",
    venueName: "Sân S",
    teamA: { name: "AE Thanh Khê FC", memberCount: 5 },
    teamB: { name: "Team Quận Liên Chiểu", memberCount: 5 },
    date: "Thứ 3, 14/07/2026",
    timeRange: "20:00 - 21:00",
    location: "Sân S - Quận Thanh Khê, Đà Nẵng",
    pricePerTeam: 200000,
    currentPlayers: 8,
    maxPlayers: 10,
  },
  {
    id: "2",
    status: "hot",
    format: "7vs7",
    venueName: "Sân A Plus",
    teamA: { name: "FC Đam Mê", memberCount: 5 },
    teamB: { name: "Chiến Binh Sân Cỏ", memberCount: 5 },
    date: "Thứ 3, 14/07/2026",
    timeRange: "21:00 - 22:00",
    location: "Sân A Plus - Quận Liên Chiểu, Đà Nẵng",
    pricePerTeam: 250000,
    currentPlayers: 6,
    maxPlayers: 14,
  },
  {
    id: "3",
    status: "new",
    format: "5vs5",
    venueName: "Sân B",
    teamA: { name: "Đà Nẵng All Star", memberCount: 5 },
    teamB: { name: "Kết Nối FC", memberCount: 5 },
    date: "Thứ 4, 15/07/2026",
    timeRange: "18:00 - 19:00",
    location: "Sân B - Quận Hải Châu, Đà Nẵng",
    pricePerTeam: 180000,
    currentPlayers: 4,
    maxPlayers: 10,
  },
];

export const mockTournaments: Tournament[] = [
  {
    id: "t1",
    day: "25",
    month: "JUL",
    title: "Giải bóng đá sân 7 mở rộng 2026",
    venue: "Sân S - Quận Thanh Khê",
    teamCount: 32,
    statusLabel: "Đang mở đăng ký",
  },
  {
    id: "t2",
    day: "15",
    month: "AUG",
    title: "Giải bóng đá giao hữu các CLB",
    venue: "Sân A Plus - Quận Liên Chiểu",
    teamCount: 16,
    statusLabel: "Sắp diễn ra",
  },
];

export const guideItems: GuideItem[] = [
  { id: "g1", title: "Cách tạo kèo đấu", description: "Hướng dẫn chi tiết cách tạo kèo" },
  { id: "g2", title: "Quy định kèo đấu", description: "Đọc quy định để đảm bảo quyền lợi" },
  { id: "g3", title: "An toàn & Fair Play", description: "Cùng xây dựng cộng đồng văn minh" },
];
