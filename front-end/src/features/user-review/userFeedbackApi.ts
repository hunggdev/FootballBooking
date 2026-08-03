import api from "@/lib/api";
import type {
  UserReview,
  CreateUserReviewPayload,
} from "./types";

export async function submitUserReview(
  payload: CreateUserReviewPayload
): Promise<UserReview> {
  const res = await api.post("/reviews", payload);

  return res.data.review;
}