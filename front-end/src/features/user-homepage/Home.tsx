// src/pages/Home.tsx
// Page cấp route - chỉ import và render module, không chứa logic UI.
import { HomePage } from "@/features/user-homepage";

export default function Home() {
  return <HomePage />;
}
