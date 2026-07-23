// src/pages/admin/Feedback.tsx
import { AdminLayout, FeedbackPage } from "@/components/admin";

export default function AdminFeedback() {
  return (
    <AdminLayout activeNavId="feedback">
      <FeedbackPage />
    </AdminLayout>
  );
}
