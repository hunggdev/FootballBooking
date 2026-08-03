export type FieldType = "FIVE" | "SEVEN";

export const FIELD_TYPE_LABEL: Record<FieldType, string> = {
  FIVE: "Sân 5",
  SEVEN: "Sân 7",
};

export const FIELD_TYPE_SLUG: Record<FieldType, string> = {
  FIVE: "san-5",
  SEVEN: "san-7",
};

export const SLUG_TO_FIELD_TYPE: Record<string, FieldType> = {
  "san-5": "FIVE",
  "san-7": "SEVEN",
};

export interface FieldSlot {
  slotId: number;
  starttime: string;
  endtime: string;
  price: number;
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE" | "HOLD";
  isMyHold?: boolean;
  expiresAt?: string | null;
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