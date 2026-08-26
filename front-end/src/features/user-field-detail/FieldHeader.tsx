import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FIELD_TYPE_LABEL } from "@/types/field";
import type { Field } from "@/types/field";
import { MapPin, Map, X } from "lucide-react";

interface FieldHeaderProps {
  name: string;
  description?: string | null;
  fieldType: Field["fieldType"];
  mapImage?: string | null;
  address?: string | null;
}

export function FieldHeader({
  name,
  description,
  fieldType,
  mapImage,
  address,
}: FieldHeaderProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <>
      {/* Field Header */}
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* Field information */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3 md:block">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {name}
                  <Badge
                    variant="outline"
                    className="
                  ml-4
                  border-brand-primary/40
                  bg-brand-primary/10
                  text-brand-primary
                  md:mt-3
                "
                  >
                    {FIELD_TYPE_LABEL[fieldType]}
                  </Badge>
                </h1>

                <p className="mt-1 text-sm text-text-secondary">
                  {description ??
                    "Sân cỏ nhân tạo chất lượng cao, có đèn chiếu sáng."}
                </p>
              </div>
            </div>

            {/* Address */}
            {address && (
              <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
                <MapPin className="h-4 w-4 shrink-0 text-brand-primary" />

                <span className="truncate">{address}</span>
              </div>
            )}
          </div>

          {/* Map preview */}
          {mapImage && (
            <div
              onClick={() => setIsMapOpen(true)}
              className="
                group
                relative
                h-28
                w-full
                shrink-0
                cursor-pointer
                overflow-hidden
                rounded-lg
                border
                border-border
                bg-surface-hover
                md:h-28
                md:w-48
              "
            >
              <img
                src={mapImage}
                alt={`Bản đồ ${name}`}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-300
                  ease-out
                  group-hover:scale-110
                "
              />

              {/* Overlay */}
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  bg-black/0
                  transition-colors
                  duration-300
                  group-hover:bg-black/40
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                    rounded-md
                    bg-black/60
                    px-2.5
                    py-1.5
                    text-xs
                    font-medium
                    text-white
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                  "
                >
                  <Map className="h-3.5 w-3.5" />
                  Xem bản đồ
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Modal */}
      {isMapOpen && mapImage && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            p-4
            backdrop-blur-sm
          "
          onClick={() => setIsMapOpen(false)}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsMapOpen(false)}
            className="
              absolute
              right-5
              top-5
              z-10
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-black/60
              text-white
              transition-colors
              hover:bg-black/80
            "
          >
            <X className="h-5 w-5" />
          </button>

          {/* Large image */}
          <img
            src={mapImage}
            alt={`Bản đồ ${name}`}
            className="
              max-h-[90vh]
              max-w-[90vw]
              rounded-xl
              object-contain
              shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
