import api from "@/lib/api";
import type {
  Field,
  FieldSlot,
  CreateFieldPayload,
  UpdateFieldPayload,
  FieldType,
} from "@/types/field";

export const fieldService = {
  // Lấy danh sách sân
  getFields: async (type?: FieldType): Promise<Field[]> => {
    const res = await api.get("/fields", {
      params: type ? { type } : undefined,
    });

    return res.data.fields;
  },

  // Lấy chi tiết sân
  getFieldById: async (fieldId: number): Promise<Field> => {
    const res = await api.get(`/fields/${fieldId}`);

    return res.data.field;
  },

  // Lấy slot theo ngày
  getFieldSlotsByDate: async (
    fieldId: number,
    date: string
  ): Promise<FieldSlot[]> => {
    const res = await api.get("/bookings/slots", {
      params: {
        fieldId,
        date,
      },
    });

    return res.data.slots;
  },

  // Lấy tất cả sân kèm slots theo ngày
  getAllFieldSlotsByDate: async (
    date: string,
    type?: FieldType
  ): Promise<Array<Field & { slots: FieldSlot[] }>> => {
    const res = await api.get("/bookings/slots", {
      params: {
        date,
        ...(type ? { type } : {}),
      },
    });

    return res.data.fields;
  },

  createField: async (
    payload: CreateFieldPayload
  ): Promise<Field> => {
    const res = await api.post("/fields", payload);

    return res.data.field;
  },

  updateField: async (
    fieldId: number,
    payload: UpdateFieldPayload
  ): Promise<Field> => {
    const res = await api.put(`/fields/${fieldId}`, payload);

    return res.data.field;
  },

  deleteField: async (fieldId: number): Promise<string> => {
    const res = await api.delete(`/fields/${fieldId}`);

    return res.data.message;
  },

  createSlot: async (
    fieldId: number,
    payload: { starttime: string; endtime: string; price: number; status?: string }
  ): Promise<FieldSlot> => {
    const res = await api.post(`/fields/${fieldId}/slots`, payload);
    return res.data.slot;
  },

  deleteSlot: async (slotId: number): Promise<string> => {
    const res = await api.delete(`/fields/slots/${slotId}`);
    return res.data.message;
  },
};