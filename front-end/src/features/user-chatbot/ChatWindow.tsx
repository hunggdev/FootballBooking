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
    <div>
          <Card className="flex h-[480px] w-[380px] flex-col overflow-hidden border shadow-sm sm:w-[380px] fixed bottom-10 right-10">
            <ChatHeader onClose={onClose}/>
            <ChatMessageList messages={messages} isLoading={isLoading} />
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </Card>
    </div>
  );
}
