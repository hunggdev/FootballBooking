export interface UserReview {
  reviewId: number;
  bookingId: number;
  rating: number;
  comment: string;
  reply?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserReviewPayload {
  bookingId: number;
  rating: number;
  comment: string;
}

export interface UpdateUserReviewPayload {
  rating?: number;
  comment?: string;
}