import { FIELD_TYPE_LABEL } from "@/types/field";
import type { FieldType } from "@/types/field";
import { useNavigate } from "react-router-dom";

export default function FieldTypeSelector() {
  const fieldTypes: FieldType[] = ["FIVE", "SEVEN"];
  const navigate = useNavigate();

  const handleSelect = (type: FieldType) => {
    navigate(`/user/booking/${type.toLowerCase()}`);
  };

  return (
    <div className="space-y-4">
      {/* Tiêu đề */}
      <h2 className="text-xl font-bold text-text-primary">
        Chọn loại sân
      </h2>

      {/* Danh sách loại sân */}
      <ul className="flex flex-wrap gap-4">
        {fieldTypes.map((t) => (
          <li
            key={t}
            onClick={() => handleSelect(t)}
            className="
              cursor-pointer
              rounded-lg
              border
              border-border
              bg-surface
              px-5
              py-3
              text-sm
              font-semibold
              text-text-primary
              shadow-sm
              transition-all
              duration-200
              hover:border-brand-primary
              hover:bg-brand-primary
              hover:text-white
              hover:shadow-md
            "
          >
            {FIELD_TYPE_LABEL[t]}
          </li>
        ))}
      </ul>
    </div>
  );
}