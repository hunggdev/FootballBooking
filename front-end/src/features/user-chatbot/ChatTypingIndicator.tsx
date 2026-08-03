import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ChatTypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <Avatar className="h-7 w-7 shrink-0 border">
        <AvatarFallback className="text-[10px]">AI</AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1 rounded-md border px-3 py-2">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full border [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full border [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full border [animation-delay:300ms]" />
      </div>
    </div>
  );
}
