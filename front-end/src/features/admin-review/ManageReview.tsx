import type { AxiosError } from "axios";
import { useMemo, useState } from "react";

import { PageHeader } from "@/layouts/admin/PageHeader";
import { Pagination } from "@/components/common/Pagination";

import { useReviews, useReplyReview } from "@/stores/useReviewStore";
import type { Review } from "@/types/review";

import { ReviewTable } from "./ReviewTable";
import { ReviewReplyDialog } from "./ReviewReplyDialog";
import { ReviewDetailDialog } from "./ReviewDetailDialog";
import { ReviewFilterBar } from "./ReviewFilterBar";

interface ErrorResponse {
  message?: string;
}

const PAGE_SIZE = 10;

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

  const [currentPage, setCurrentPage] = useState(1);

  const filteredReviews = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return reviews;

    return reviews.filter((review) => {
      return (
        review.reviewId.toString().includes(keyword) ||
        (review.user?.fullName ?? "").toLowerCase().includes(keyword) ||
        (review.comment ?? "").toLowerCase().includes(keyword)
      );
    });
  }, [reviews, search]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

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
          setSelectedReview(null);
        },

        onError: (error) => {
          setReplyError(getErrorMessage(error, "Phản hồi đánh giá thất bại."));
        },
      },
    );
  };

  if (isLoading) {
    return <div className="p-8 text-text-secondary">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-status-danger">
        Không thể tải danh sách đánh giá.
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Quản lý đánh giá"
        subtitle="Quản lý đánh giá và phản hồi của khách hàng"
      />
      <ReviewFilterBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
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
      <Pagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={reviews.length}
        pageSize={PAGE_SIZE}
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
    </>
  );
}
