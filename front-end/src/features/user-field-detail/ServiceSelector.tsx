import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/booking-format";
import type { Service } from "@/types/service";

interface ServiceSelectorProps {
  services: Service[];
  cartItems: { service: Service; quantity: number }[];
  onAdd: (serviceId: string | null) => void;
  onChangeQuantity: (serviceId: number, delta: number) => void;
  onRemove: (serviceId: number) => void;
}

export function ServiceSelector({ services, cartItems, onAdd, onChangeQuantity, onRemove }: ServiceSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Dịch vụ thêm</p>

      {services.length > 0 && (
        <Select onValueChange={onAdd}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="+ Chọn dịch vụ muốn thêm" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem key={service.serviceId} value={String(service.serviceId)}>
                {service.name} · {formatCurrency(service.price)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {cartItems.map(({ service, quantity }) => (
        <div key={service.serviceId} className="flex items-center justify-between gap-2 rounded-lg border p-2 text-sm">
          <div>
            <p className="font-medium">{service.name}</p>
            <p className="text-xs text-muted-foreground">{formatCurrency(service.price)}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-sm" onClick={() => onChangeQuantity(service.serviceId, -1)}>
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-5 text-center">{quantity}</span>
            <Button variant="outline" size="icon-sm" onClick={() => onChangeQuantity(service.serviceId, 1)}>
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onRemove(service.serviceId)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}