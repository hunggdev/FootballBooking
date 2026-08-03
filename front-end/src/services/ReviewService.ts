import api from "@/lib/api";
import type {
  Review,
  ReplyReviewPayload,
} from "@/types/review";

// Lấy danh sách review
export async function getReviews(): Promise<Review[]> {
  const res = await api.get("/reviews");
  return res.data.reviews ?? res.data ?? [];
}

export async function getReview(id: number): Promise<Review> {
  const res = await api.get(`/reviews/${id}`);
  return res.data.review ?? res.data;
}

// Lấy danh sách review của 1 sân cụ thể
export async function getFieldReviews(fieldId: number): Promise<Review[]> {
  const res = await api.get(`/reviews/field/${fieldId}`);
  return res.data.reviews ?? [];
}


// Admin phản hồi review
export async function replyReview(
  id: number,
  payload: ReplyReviewPayload
): Promise<Review> {
  const res = await api.patch(
    `/reviews/${id}/reply`,
    payload
  );

  return res.data.review ?? res.data;
}