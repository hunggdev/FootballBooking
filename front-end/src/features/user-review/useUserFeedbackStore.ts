import { useState } from "react";

import type {
  UserReview,
  CreateUserReviewPayload,
} from "./types";

import { submitUserReview } from "./userFeedbackApi";

export function useUserReviewStore() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<UserReview[]>([]);

  async function submitReview(
    payload: CreateUserReviewPayload
  ) {
    try {
      setIsSubmitting(true);

      const review = await submitUserReview(payload);

      setReviews((prev) => [...prev, review]);

      return review;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    reviews,
    submitReview,
    isSubmitting,
  };
}