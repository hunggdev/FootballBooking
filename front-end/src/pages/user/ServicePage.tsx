// src/pages/user/ServicePage.tsx
import { useEffect, useState } from "react";
import { serviceService } from "@/services/serviceService"; 

import type { Service } from "@/types/service";

export default function ServicePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceService.getServices().then(data => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Đang tải dịch vụ...</p>;

  return (
    <div>
      <h1>Dịch vụ</h1>
      <ul>
        {services.map(s => (
          <li key={s.id}>
            <strong>{s.name}</strong> - {s.price}đ
            <p>{s.description ?? "Không có mô tả"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
