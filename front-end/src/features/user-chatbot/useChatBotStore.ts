import { useCallback, useEffect, useState } from "react";
// import { sendMessageToBot } from "@/services/chatBot";
import type { ChatMessage } from "@/features/user-chatbot/chat";
import {useUserStore} from "@/stores/useUserStore"

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "BOT",
  content: "Xin chào! Tôi có thể giúp gì cho bạn?",
  createdAt: new Date().toISOString(),
};

const STORAGE_KEY = "chatbot_messages";

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);

    if (savedMessages) {
      return JSON.parse(savedMessages);
    }

    return [WELCOME_MESSAGE];
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatbot = useUserStore((state) => state.chatbot);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages)
    );
  }, [messages]);


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
  }, [isLoading, chatbot]);

  return { messages, isLoading, sendMessage };
}
