import { useEffect, useState } from "react";
import { fetchUserServices } from "@/features/user-service/userServicesApi";
import type { UserService } from "@/features/user-service/types";

export default function UserServicesList() {
  const [services, setServices] = useState<UserService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserServices()
      .then(data => setServices(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải dịch vụ...</p>;

  return (
    <ul>
      {services.map(s => (
        <li key={s.id}>
          {s.name} - {s.price}đ
        </li>
      ))}
    </ul>
  );
}
