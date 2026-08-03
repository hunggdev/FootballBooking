import { useCallback, useRef, useState } from "react";
// import { sendMessageToBot } from "@/services/chatBot";
import type { ChatMessage } from "@/features/user-chatbot/chat";
import {useUserStore} from "@/stores/useUserStore"

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "BOT",
  content: "Xin chào! Tôi có thể giúp gì cho bạn?",
  createdAt: new Date().toISOString(),
};

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const chatbot = useUserStore((state) => state.chatbot);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "CUSTOMER",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await chatbot(content);
      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "BOT",
        content: res?.answer ?? "Xin lỗi, không có phản hồi từ máy chủ.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "BOT",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
        createdAt: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return { messages, isLoading, sendMessage };
}
