import { fieldService } from "@/services/fieldService";
import type {
  Field,
  CreateFieldPayload,
  FieldType,
  UpdateFieldPayload,
} from "@/types/field";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Lấy tất cả sân
export const useFields = (type?: FieldType) => {
  return useQuery<Field[]>({
    queryKey: ["fields", type],
    queryFn: () => fieldService.getFields(type),
    staleTime: 0,
  });
};

// Lấy chi tiết sân
export const useField = (fieldId: number) => {
  return useQuery<Field>({
    queryKey: ["fields", fieldId],
    queryFn: () => fieldService.getFieldById(fieldId),
    enabled: !!fieldId,
    retry: false,
  });
};

// Lấy slot theo ngày
export const useFieldSlotsByDate = (fieldId: number, date: string) => {
  return useQuery({
    queryKey: ["fields", fieldId, "slots", date],
    queryFn: () => fieldService.getFieldSlotsByDate(fieldId, date),
    enabled: !!fieldId && !!date,
    staleTime: 0,
  });
};

// Lấy tất cả sân và slot theo ngày
export const useAllFieldSlotsByDate = (date: string, type?: FieldType) => {
  return useQuery({
    queryKey: ["fields", "all-slots", date, type],
    queryFn: () => fieldService.getAllFieldSlotsByDate(date, type),
    enabled: !!date,
    staleTime: 0,
  });
};

export const useCreateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFieldPayload) =>
      fieldService.createField(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fields"] }),
  });
};

export const useUpdateField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fieldId,
      payload,
    }: {
      fieldId: number;
      payload: UpdateFieldPayload;
    }) => fieldService.updateField(fieldId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fields"] }),
  });
};

export const useDeleteField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fieldId: number) =>
      fieldService.deleteField(fieldId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fields"] }),
  });
};

export const useCreateSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fieldId,
      payload,
    }: {
      fieldId: number;
      payload: { starttime: string; endtime: string; price: number; status: string };
    }) => fieldService.createSlot(fieldId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fields"] }),
  });
};

export const useDeleteSlot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: number) => fieldService.deleteSlot(slotId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["fields"] }),
  });
};