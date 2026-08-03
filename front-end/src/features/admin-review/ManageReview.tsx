import type { AxiosError } from "axios";
import { useState } from "react";

import { useReviews, useReplyReview } from "@/stores/useReviewStore";
import type { Review } from "@/types/review";

import { ReviewTable } from "./ReviewTable";
import { ReviewReplyDialog } from "./ReviewReplyDialog";
import { ReviewDetailDialog } from "./ReviewDetailDialog";
import { ReviewFilterBar } from "./ReviewFilterBar";

interface ErrorResponse {
  message?: string;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ErrorResponse>;
  return axiosError.response?.data?.message ?? fallback;
}

export function ManageReview() {
  const { data: reviews = [], isLoading, error } = useReviews();
  const replyReview = useReplyReview();

  const [openReply, setOpenReply] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const [search, setSearch] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);

  const filteredReviews = reviews.filter((review) => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    return (
      review.reviewId.toString().includes(keyword) ||
      (review.user?.fullName ?? "").toLowerCase().includes(keyword) ||
      (review.comment ?? "").toLowerCase().includes(keyword)
    );
  });

  const handleReplySubmit = (reply: string) => {
    if (!selectedReview) return;

    setReplyError(null);

    replyReview.mutate(
      {
        id: selectedReview.reviewId,
        payload: { reply },
      },
      {
        onSuccess: () => {
          setOpenReply(false);
        },
        onError: (error) => {
          setReplyError(
            getErrorMessage(error, "Phản hồi đánh giá thất bại.")
          );
        },
      }
    );
  };

  if (isLoading) {
    return <div className="p-8">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Không thể tải danh sách đánh giá.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ReviewFilterBar
        search={search}
        onSearchChange={setSearch}
      />

      <ReviewTable
        reviews={filteredReviews}
        onView={(review) => {
          setSelectedReview(review);
          setOpenDetail(true);
        }}
        onReply={(review) => {
          setSelectedReview(review);
          setReplyError(null);
          setOpenReply(true);
        }}
      />

      <ReviewReplyDialog
        open={openReply}
        onOpenChange={setOpenReply}
        review={selectedReview}
        onSubmit={handleReplySubmit}
        isSubmitting={replyReview.isPending}
        serverError={replyError}
      />

      <ReviewDetailDialog
        open={openDetail}
        onOpenChange={setOpenDetail}
        review={selectedReview}
      />
    </div>
  );
}