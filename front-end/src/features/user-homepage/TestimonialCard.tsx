// src/components/home/TestimonialCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { TestimonialItem } from "@/types/home.ts";

export function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <Card className="border">
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar className="border">
          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm font-medium">{testimonial.name}</p>
          <p className="text-xs opacity-60">{testimonial.date}</p>
        </div>
        <span className="text-xs">{"★".repeat(testimonial.rating)}</span>
      </CardHeader>
      <CardContent>
        <p className="text-sm opacity-80">{testimonial.comment}</p>
      </CardContent>
    </Card>
  );
}
