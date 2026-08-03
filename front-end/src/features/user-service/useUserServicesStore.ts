// src/features/user-service/store/useUserServicesStore.ts
import { useEffect, useState } from "react";
import type { UserService } from "../user-service/types";
import { fetchUserServices } from "../user-service/userServicesApi";

export function useUserServicesStore() {
  const [data, setData] = useState<UserService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // gọi API bất đồng bộ
    fetchUserServices().then((res) => {
      if (mounted) {
        setData(res);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading };
}
