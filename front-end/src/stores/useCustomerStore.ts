import { customerService } from "@/services/customerService";

import { useQuery } from "@tanstack/react-query";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getAllCustomers,
    staleTime: 0,
  });
};