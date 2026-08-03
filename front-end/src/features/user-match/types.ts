export type MatchStatus = "open" | "hot" | "new" | "upcoming" | "closed";

export interface MatchTeam {
  name: string;
  memberCount: number;
}

export interface Match {
  id: string;
  status?: MatchStatus;
  format: string; // "5vs5" | "7vs7" | "11vs11"
  venueName: string;
  teamA: MatchTeam;
  teamB: MatchTeam;
  date: string;
  timeRange: string;
  location: string;
  pricePerTeam: number;
  currentPlayers: number;
  maxPlayers: number;
}

export interface Tournament {
  id: string;
  day: string;
  month: string;
  title: string;
  venue: string;
  teamCount: number;
  statusLabel: string;
}

export interface GuideItem {
  id: string;
  title: string;
  description: string;
}

export type MatchTabValue = "OPEN" | "MINE" | "JOINED" | "FINISHED";
