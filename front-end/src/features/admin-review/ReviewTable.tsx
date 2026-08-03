import type { Review } from "@/types/review";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

interface Props {
  reviews: Review[];
  onReply: (review: Review) => void;
  onView: (review: Review) => void;
}

export function ReviewTable({
  reviews,
  onReply,
  onView,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">ID</th>
            <th className="border p-2">Khách hàng</th>
            <th className="border p-2">Sân</th>
            <th className="border p-2">Nội dung</th>
            <th className="border p-2">Đánh giá</th>
            <th className="border p-2">Phản hồi</th>
            <th className="border p-2">Ngày tạo</th>
            <th className="border p-2">Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {reviews.map((review) => (
            <tr
              key={review.reviewId}
              className="hover:bg-gray-50"
            >
              <td className="border p-2">{review.reviewId}</td>

              <td className="border p-2">
                {review.user?.fullName ?? review.userId}
              </td>

              <td className="border p-2">
                {review.field?.name ?? review.fieldId}
              </td>

              <td className="max-w-xs border p-2 truncate">
                {review.comment ?? (
                  <span className="text-muted-foreground">
                    Không có nội dung
                  </span>
                )}
              </td>

              <td className="border p-2">
                {review.rating} ⭐
              </td>

              <td className="border p-2">
                {review.reply ? (
                  <span className="text-green-600">
                    Đã phản hồi
                  </span>
                ) : (
                  <span className="text-amber-600">
                    Chưa phản hồi
                  </span>
                )}
              </td>

              <td className="border p-2">
                {formatDateTime(review.createdAt)}
              </td>

              <td className="border p-2 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(review)}
                >
                  Xem
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onReply(review)}
                >
                  {review.reply
                    ? "Sửa phản hồi"
                    : "Phản hồi"}
                </Button>
              </td>
            </tr>
          ))}

          {reviews.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="p-4 text-center text-gray-500"
              >
                Không có đánh giá nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}