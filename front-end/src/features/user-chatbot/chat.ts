export type ChatRole = "CUSTOMER" | "BOT";

export interface ChatMessage {
  id: string | null;
  role: ChatRole;
  content: string;
  createdAt: string | null;
  /** true khi tin nhắn bot gặp lỗi (hiển thị kèm nút thử lại) */
  isError?: boolean | null;
}

export interface SendMessagePayload {
  message: string;
  sessionId?: string;
}

export interface SendMessageResponse {
  reply: string;
  sessionId?: string;
}
