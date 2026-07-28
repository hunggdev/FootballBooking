import { customerService } from "@/services/customerService";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCustomerPayload, UpdateCustomerPayload } from "@/types/customer";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => customerService.getAllCustomers(true),
    staleTime: 0,
  });
};

export const useCustomer = (customerId: number) => {
    return useQuery({
        queryKey: ["customers", customerId], 
        queryFn: () => customerService.getCustomerById(customerId),
        enabled: !!customerId,
        retry: false
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateCustomerPayload) => customerService.createCustomer(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ customerId, payload }: { customerId: number; payload: UpdateCustomerPayload }) =>
            customerService.updateCustomer(customerId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (customerId: number) => customerService.deleteCustomer(customerId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customers"] }),
    });
};

export const useStatsCustomer = () => {
    return useQuery({
        queryKey: ["customers", "stats"],
        queryFn: () => customerService.statsCustomer(),
    });
}
