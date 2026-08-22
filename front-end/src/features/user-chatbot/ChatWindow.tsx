import { Card } from "@/components/ui/card";
import { ChatHeader } from "./ChatHeader";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import type { ChatMessage } from "./chat";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onClose: () => void;
}

export function ChatWindow({ messages, isLoading, onSend, onClose }: ChatWindowProps) {
  
  const handleSend = (message: string) => {
    onSend(message);
  };
  
  return (
    <Card className="flex h-[480px] w-[340px] sm:w-[380px] flex-col overflow-hidden border shadow-xl bg-surface rounded-2xl">
      <ChatHeader onClose={onClose} />
      <ChatMessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </Card>
  );
}
