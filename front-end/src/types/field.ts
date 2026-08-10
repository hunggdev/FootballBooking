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
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "HOLD";
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
}

export interface CreateFieldPayload {
  name: string;
  description?: string;
  image?: string;
  fieldType: FieldType;
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
};

