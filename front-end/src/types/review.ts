export interface ReviewUser {
  userId: number;
  fullName: string;
  email?: string;
}

export interface ReviewField {
  fieldId: number;
  name: string;
  fieldType?: "FIVE" | "SEVEN" | "ELEVEN";
}

export interface Review {
  reviewId: number;
  bookingId: number;
  userId: number;
  fieldId: number;
  rating: number;
  comment: string | null;
  reply: string | null;
  createdAt: string;
  updatedAt: string;
  user?: ReviewUser;
  field?: ReviewField;
}

export interface ReplyReviewPayload {
  reply: string;
}

export interface CreateReviewPayload {
  bookingId: number;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
}