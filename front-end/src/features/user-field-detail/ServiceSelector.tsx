import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/booking-format";
import type { Service } from "@/types/service";

interface ServiceSelectorProps {
  services: Service[];
  cartItems: { service: Service; quantity: number }[];
  onAdd: (serviceId: string | null) => void;
  onChangeQuantity: (serviceId: number, delta: number) => void;
  onRemove: (serviceId: number) => void;
}

export function ServiceSelector({
  services,
  cartItems,
  onAdd,
  onChangeQuantity,
  onRemove,
}: ServiceSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-text-primary">
        Dịch vụ thêm
      </p>

      {services.length > 0 && (
        <Select onValueChange={onAdd}>
          <SelectTrigger
            className="
              w-full
              border-border
              bg-surface
              text-text-primary
              hover:bg-surface-hover
              focus:ring-brand-primary/20
            "
          >
            <SelectValue placeholder="+ Chọn dịch vụ muốn thêm" />
          </SelectTrigger>

          <SelectContent
            className="
              border-border
              bg-elevated
              text-text-primary
            "
          >
            {services.map((service) => (
              <SelectItem
                key={service.serviceId}
                value={String(service.serviceId)}
                className="
                  text-text-primary
                
                  focus:text-text-primary
                "
              >
                {service.name} · {formatCurrency(service.price)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {cartItems.map(({ service, quantity }) => (
        <div
          key={service.serviceId}
          className="
            flex
            items-center
            justify-between
            gap-2
            rounded-lg
            border
            border-border
            bg-surface
            p-2
            text-sm
          "
        >
          <div>
            <p className="font-medium text-text-primary">
              {service.name}
            </p>

            <p className="text-xs text-text-muted">
              {formatCurrency(service.price)}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onChangeQuantity(service.serviceId, -1)}
              className="
                border-border
                bg-surface
                text-text-secondary
                hover:bg-surface-hover
                hover:text-text-primary
              "
            >
              <Minus className="h-3 w-3" />
            </Button>

            <span className="w-5 text-center font-medium text-text-primary">
              {quantity}
            </span>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onChangeQuantity(service.serviceId, 1)}
              className="
                border-border
                bg-surface
                text-text-secondary
                hover:bg-surface-hover
                hover:text-text-primary
              "
            >
              <Plus className="h-3 w-3" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onRemove(service.serviceId)}
              className="
                text-text-muted
                hover:bg-status-danger-bg
                hover:text-status-danger
              "
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}