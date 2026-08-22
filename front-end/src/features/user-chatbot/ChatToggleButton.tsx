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
      className="
    h-12
    w-12
    rounded-full
    border
    border-brand-primary/20
    bg-brand-primary
    text-white
    shadow-lg
    shadow-brand-primary/20
    transition-all
    duration-200
    hover:scale-105
    hover:bg-brand-primary/90
    hover:shadow-xl
    hover:shadow-brand-primary/30
    active:scale-95
  "
      aria-label={isOpen ? "Đóng chat" : "Mở chat"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </Button>
  );
}
