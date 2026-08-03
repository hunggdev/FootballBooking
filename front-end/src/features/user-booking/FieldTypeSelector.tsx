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
    <div>
      <h2>Chọn loại sân</h2>
      <ul className="flex gap-4">
        {fieldTypes.map((t) => (
          <li
            key={t}
            className="cursor-pointer rounded-md px-4 py-2 bg-accent hover:bg-primary hover:text-white"
            onClick={() => handleSelect(t)}
          >
            {FIELD_TYPE_LABEL[t]}
          </li>
        ))}
      </ul>
    </div>
  );
}
