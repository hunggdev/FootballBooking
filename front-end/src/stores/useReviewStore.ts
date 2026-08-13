import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { reviewService } from "@/services/ReviewService"; 


import type {
  Review,
  ReplyReviewPayload,
  CreateReviewPayload,
} from "@/types/review";

// Lấy danh sách review
export const useReviews = () => {
  return useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: reviewService.getReviews,
    staleTime: 0,
    refetchInterval: 3000,
  });
}

// Lấy danh sách review theo sân cụ thể
export const useFieldReviews = (fieldId: number) => {
  return useQuery<Review[]>({
    queryKey: ["reviews", "field", fieldId],
    queryFn: () => reviewService.getFieldReviews(fieldId),
    enabled: !!fieldId,
    staleTime: 0,
    refetchInterval: 3000,
  });
}

// Lấy chi tiết review
export const useReview = (reviewId: number) => {
  return useQuery<Review>({
    queryKey: ["reviews", reviewId],
    queryFn: () => reviewService.getReview(reviewId),
    enabled: !!reviewId,
    retry: false,
  });
}

// Admin phản hồi review
export const useReplyReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: ReplyReviewPayload;
    }) => reviewService.replyReview(id, payload),

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

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
    },
  });
}