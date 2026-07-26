import { fieldService } from "@/services/fieldService";
import type { CreateFieldPayload, UpdateFieldPayload } from "@/types/field";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFields = () => {
    return useQuery({
        queryKey: ["fields"],
        queryFn: () => fieldService.getAllFields(true),
        staleTime: 0,
    });
};

export const useField = (fieldId: number) => {
    return useQuery({
        queryKey: ["fields", fieldId],
        queryFn: () => fieldService.getFieldById(fieldId),
        enabled: !!fieldId,
        retry: false
    });
};

export const useCreateField = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateFieldPayload) => fieldService.createField(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fields"] }),
    });
};

export const useUpdateField = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ fieldId, payload }: { fieldId: number; payload: UpdateFieldPayload }) =>
            fieldService.updateField(fieldId, payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fields"] }),
    });
};

export const useDeleteField = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (fieldId: number) => fieldService.deleteField(fieldId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["fields"] }),
    });
};
