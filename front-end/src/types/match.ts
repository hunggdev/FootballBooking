import type { User } from "./user";

export interface Match {
    matchId: number,
    userId: number,
    user: User,
    minAge: number,
    maxAge: number,
    fieldType: string,
    timeNote: string,
    description: string,
    costRule: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    isMine: boolean,
    isJoined: boolean, 
    participants: MatchParticipant | null,
}

export interface MatchParticipant {
    participantId: number,
    joinedAt: string,
    user: User,
}

export interface CreateMatchPayload {
    minAge: number,
    maxAge: number,
    fieldType: string,
    timeNote: string,
    description: string,
    costRule: string,
}

export interface UpdateMatchPayload {
    minAge: number | null,
    maxAge: number | null,
    fieldType: string,
    timeNote: string,
    description: string,
    costRule: string,
    status: string,
}

export interface Stats {
    matches: number,
    totalMatchInThisMonth: number,
    matchOpen: number,
    matchMatched: number,
    matchFinished: number,
    matchCancelled: number,
}

export const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: {
    label: "Đang tìm đối",
    className:
      "border-status-success/20 bg-status-success-bg text-status-success",
  },
  MATCHED: {
    label: "Đã ghép đối",
    className:
      "border-status-warning/20 bg-status-warning-bg text-status-warning",
  },
  FINISHED: {
    label: "Đã kết thúc",
    className: "border-status-info/20 bg-status-info-bg text-status-info",
  },
  CANCELLED: {
    label: "Đã hủy kèo",
    className: "border-status-danger/20 bg-status-danger-bg text-status-danger",
  },
};

export const typeLabel: Record<string, { title: string; subtitle: string }> = {
  FIVE: { title: "Sân 5 người", subtitle: "5 vs 5" },
  SEVEN: { title: "Sân 7 người", subtitle: "7 vs 7" },
  ELEVEN: { title: "Sân 11 người", subtitle: "11 vs 11" },
};

export const costRuleConfig: Record<string, { label: string; desc: string }> = {
  SPLIT: {
    label: "Chia đều tiền sân",
    desc: "Mỗi bên 50% chi phí",
  },
  LOSER_PAYS: {
    label: "Thua trả toàn bộ",
    desc: "Đội thua trả 100% tiền sân",
  },
  WINNER_PAYS: {
    label: "Thắng trả toàn bộ",
    desc: "Đội thắng khao tiền sân",
  },
  NEGOTIATE: {
    label: "Thương lượng",
    desc: "Thỏa thuận khi gặp mặt",
  },
};