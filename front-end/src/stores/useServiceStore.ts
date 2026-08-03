import { serviceService } from "@/services/serviceService";
import type { CreateServicePayload, UpdateServicePayload } from "@/types/service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => serviceService.getServices(), // ✅ khớp với serviceService
    staleTime: 0,
  });
};

export const useService = (serviceId: number) => {
  return useQuery({
    queryKey: ["services", serviceId],
    queryFn: () => serviceService.getService(serviceId), // ✅ khớp với serviceService
    enabled: !!serviceId,
    retry: false,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateServicePayload) => serviceService.createService(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ serviceId, payload }: { serviceId: number; payload: UpdateServicePayload }) =>
      serviceService.updateService(serviceId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (serviceId: number) => serviceService.deleteService(serviceId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["services"] }),
  });
};
