import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitUserReview } from "@/features/user-review/userFeedbackApi";

interface ReviewFormProps {
  bookingId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({
  bookingId,
  onSuccess,
}: ReviewFormProps) {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      await submitUserReview({
        bookingId,
        rating,
        comment,
      });

      // Synchronize data immediately for admin and user views
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      setComment("");
      setRating(5);

      toast.success("Đánh giá thành công!");
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Không thể gửi đánh giá.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-semibold">
          Số sao đánh giá (1 - 5 sao)
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-transform hover:scale-110 ${
                star <= rating ? "text-amber-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
          <span className="text-sm font-bold text-muted-foreground ml-2">{rating}/5 sao</span>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold">
          Nhận xét & Góp ý
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-md border border-input bg-background p-2.5 text-sm focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          rows={3}
          placeholder="Chia sẻ trải nghiệm của bạn về sân bóng này..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-600 px-4 py-2.5 font-bold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá →"}
      </button>
    </form>
  );
}