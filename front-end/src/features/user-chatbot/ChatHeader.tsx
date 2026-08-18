import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatHeaderProps {
  botName?: string;
  isOnline?: boolean;
  onClose: () => void;
}

export function ChatHeader({
  botName = "Trợ lý ảo",
  isOnline = true,
  onClose,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-3">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 border">
          <AvatarFallback className="text-xs">AI</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{botName}</p>
          <p className="text-xs text-text-muted">
            {isOnline ? "Đang hoạt động" : "Ngoại tuyến"}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onClose}
        aria-label="Đóng chat"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );  
}
