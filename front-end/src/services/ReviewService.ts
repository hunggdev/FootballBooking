import api from "@/lib/api";
import type {
  Review,
  ReplyReviewPayload,
  CreateReviewPayload
} from "@/types/review";


export const reviewService = {
  // Lấy danh sách review
  getReviews: async (): Promise<Review[]> => {
    const res = await api.get("/reviews");
    return res.data.reviews ?? res.data ?? [];
  },

  getReview: async (id: number): Promise<Review> => {
    const res = await api.get(`/reviews/${id}`);
    return res.data.review ?? res.data;
  },

  // Lấy danh sách review của 1 sân cụ thể
  getFieldReviews: async (fieldId: number): Promise<Review[]> => {
    const res = await api.get(`/reviews/field/${fieldId}`);
    return res.data.reviews ?? [];
  },

  createReview: async (payload: CreateReviewPayload): Promise<Review> => {
    const res = await api.post(`/reviews`, payload);
    return res.data.review ?? res.data;
  },


  // Admin phản hồi review
  replyReview: async (
    id: number,
    payload: ReplyReviewPayload
  ): Promise<Review> => {
    const res = await api.patch(
      `/reviews/${id}/reply`,
      payload
    );

    return res.data.review ?? res.data;
  },
}
