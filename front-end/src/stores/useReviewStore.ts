import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getReviews,
  getReview,
  getFieldReviews,
  replyReview,
} from "@/services/ReviewService";

import type {
  Review,
  ReplyReviewPayload,
} from "@/types/review";

// Lấy danh sách review
export function useReviews() {
  return useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: getReviews,
    staleTime: 0,
    refetchInterval: 3000,
  });
}

// Lấy danh sách review theo sân cụ thể
export function useFieldReviews(fieldId: number) {
  return useQuery<Review[]>({
    queryKey: ["reviews", "field", fieldId],
    queryFn: () => getFieldReviews(fieldId),
    enabled: !!fieldId,
    staleTime: 0,
    refetchInterval: 3000,
  });
}

// Lấy chi tiết review
export function useReview(reviewId: number) {
  return useQuery<Review>({
    queryKey: ["reviews", reviewId],
    queryFn: () => getReview(reviewId),
    enabled: !!reviewId,
    retry: false,
  });
}

// Admin phản hồi review
export function useReplyReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ReplyReviewPayload;
    }) => replyReview(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-reviews"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-bookings"],
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews", variables.id],
      });
    },
  });
}