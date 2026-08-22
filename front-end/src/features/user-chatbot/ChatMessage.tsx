import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "./chat";

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "CUSTOMER";

  return (
    <div className={cn("flex items-start gap-2", isUser && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 border border-border/60">
        <AvatarFallback className="bg-[image:var(--token-gradient-brand)] text-[11px] font-bold text-white">
          {isUser ? "BẠN" : "AI"}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[75%] rounded-lg px-3 py-2 text-sm",
          isUser
            ? "rounded-tr-none bg-brand-primary text-primary-foreground"
            : "rounded-tl-none bg-elevated border text-text-primary",
          message.isError && "border-dashed"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
