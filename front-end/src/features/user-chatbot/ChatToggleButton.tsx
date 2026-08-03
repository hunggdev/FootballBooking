import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ChatToggleButton({ isOpen, onToggle }: ChatToggleButtonProps) {
  return (
    <Button
      onClick={onToggle}
      variant="outline"
      size="icon"
      className="h-14 w-14 rounded-full border shadow-sm"
      aria-label={isOpen ? "Đóng chat" : "Mở chat"}
    >
      {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
    </Button>
  );
}
