import { useState } from "react";
import { toast } from "sonner";

import { useCreateReview } from "@/stores/useReviewStore";

interface ReviewFormProps {
  bookingId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({
  bookingId,
  onSuccess,
}: ReviewFormProps) {
  const { mutateAsync: createReview } = useCreateReview();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      await createReview({
        bookingId,
        rating,
        comment,
      });

      setComment("");
      setRating(5);

      toast.success("Đánh giá thành công!");

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Không thể gửi đánh giá.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Rating */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-text-primary">
          Số sao đánh giá
          <span className="ml-1 text-text-secondary">(1 - 5 sao)</span>
        </label>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl leading-none transition-all duration-150 hover:scale-110 ${star <= rating
                  ? "text-rating-star drop-shadow-sm"
                  : "text-text-muted hover:text-rating-star/70"
                }`}
              aria-label={`Đánh giá ${star} sao`}
            >
              ★
            </button>
          ))}

          <span className="ml-2 rounded-md bg-elevated px-2.5 py-1 text-sm font-semibold text-text-secondary">
            {rating}/5 sao
          </span>
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-text-primary">
          Nhận xét & Góp ý
        </label>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="
            w-full resize-none rounded-lg
            border border-border
            bg-surface
            px-3 py-2.5
            text-sm text-text-primary
            placeholder:text-text-muted
            transition-colors
            focus:border-brand-primary
            focus:outline-none
            focus:ring-2
            focus:ring-brand-primary/20
          "
          rows={4}
          placeholder="Chia sẻ trải nghiệm của bạn về sân bóng này..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full rounded-lg
          bg-brand-primary
          px-4 py-2.5
          font-bold text-white
          transition-all duration-200
          hover:bg-brand-primary-hover
          hover:shadow-md
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá →"}
      </button>
    </form>
  );
}