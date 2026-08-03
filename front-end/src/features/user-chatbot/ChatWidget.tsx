import { useState } from "react";
import { ChatToggleButton } from "./ChatToggleButton";
import { ChatWindow } from "./ChatWindow";
import { useChatbot } from "@/features/user-chatbot/useChatBotStore";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChatbot();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          onClose={() => setIsOpen(false)}
        />
      )}
      <ChatToggleButton isOpen={isOpen} onToggle={() => setIsOpen((v) => !v)} />
    </div>
  );
}
