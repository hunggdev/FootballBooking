import type { UserService } from "./types";

export async function fetchUserServices(): Promise<UserService[]> {
  const res = await fetch("/api/user-services"); 
  if (!res.ok) {
    throw new Error("Không thể tải dịch vụ người dùng");
  }
  return res.json();
}
