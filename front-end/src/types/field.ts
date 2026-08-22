export type FieldType = "FIVE" | "SEVEN" | "ELEVEN";

export const FIELD_TYPE_LABEL: Record<FieldType, string> = {
  FIVE: "Sân 5",
  SEVEN: "Sân 7",
  ELEVEN: "Sân 11",
};

export const FIELD_TYPE_SLUG: Record<FieldType, string> = {
  FIVE: "san-5",
  SEVEN: "san-7",
  ELEVEN: "san-11",
};

export const SLUG_TO_FIELD_TYPE: Record<string, FieldType> = {
  "san-5": "FIVE",
  "san-7": "SEVEN",
  "san-11": "ELEVEN",
};

export interface FieldSlot {
  bookingDate?: string;
  slotId: number;
  starttime: string;
  endtime: string;
  price: number;
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE";
  isMyHold?: boolean;
  expiresAt?: string | null;
  ttl: number;
}

export interface Field {
  fieldId: number;
  name: string;
  description?: string | null;
  image?: string | null;
  fieldType: FieldType;
  createdAt: string;
  fieldSlots: FieldSlot[];
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
}

export interface CreateFieldPayload {
  name: string;
  description?: string;
  image?: string;
  fieldType: FieldType;
  selectedFieldSlots: FieldSlot[];
}

export interface UpdateFieldPayload {
  name?: string;
  description?: string;
  image?: string;
  fieldType?: FieldType;
}

export interface HoldSlot {
  holdId?: string;
  slotId?: number;
  bookingDate?: string;
  expiresAt?: string;
  ttl: number;
  starttime: string;
  endtime: string;
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "HOLD";
  price: number;
  isMyHold?: boolean;
}

export const fieldTypeConfig: Record<
  FieldType,
  { label: string; sub: string; badgeClass: string }
> = {
  FIVE: {
    label: "Sân 5 người",
    sub: "5 vs 5",
    badgeClass:
      "border-status-success/30 bg-status-success-bg text-status-success",
  },
  SEVEN: {
    label: "Sân 7 người",
    sub: "7 vs 7",
    badgeClass: "border-status-info/30 bg-status-info-bg text-status-info",
  },
  ELEVEN: {
    label: "Sân 11 người",
    sub: "11 vs 11",
    badgeClass:
      "border-status-warning/30 bg-status-warning-bg text-status-warning",
  },
};

export const slotStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  AVAILABLE: {
    label: "Đang mở",
    className:
      "border-status-success/20 bg-status-success-bg text-status-success",
  },
  BOOKED: {
    label: "Đã đặt",
    className: "border-status-danger/20 bg-status-danger-bg text-status-danger",
  },
  HOLD: {
    label: "Đang giữ chỗ",
    className:
      "border-status-warning/20 bg-status-warning-bg text-status-warning",
  },
  MAINTENANCE: {
    label: "Bảo trì",
    className: "border-text-muted/30 bg-text-muted/10 text-text-muted",
  },
};

export const fieldTypeLabel: Record<FieldType, string> = {
  FIVE: "Sân 5 người",
  SEVEN: "Sân 7 người",
  ELEVEN: "Sân 11 người",
};

export const fieldTypeBadge: Record<FieldType, string> = {
  FIVE: "border-status-success/20 bg-status-success-bg text-status-success",
  SEVEN: "border-status-info/20 bg-status-info-bg text-status-info",
  ELEVEN: "border-status-indigo/20 bg-status-indigo/15 text-status-indigo",
};
