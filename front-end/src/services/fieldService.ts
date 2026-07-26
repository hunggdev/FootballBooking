import api from "@/lib/axios";
import type { CreateFieldPayload, UpdateFieldPayload } from "@/types/field";

export const fieldService = {
    getAllFields: async (all = true) => {
        const res = await api.get("/fields", {
            params: all ? { all: "1" } : undefined,
            withCredentials: true,
        });
        return res.data;
    },

    getFieldById: async (fieldId: number) => {
        const res = await api.get(`/fields/${fieldId}`, { withCredentials: true });
        return res.data;
    },

    createField: async (payload: CreateFieldPayload) => {
        const res = await api.post("/fields", payload, { withCredentials: true });
        return res.data;
    },

    updateField: async (fieldId: number, payload: UpdateFieldPayload) => {
        const res = await api.put(`/fields/${fieldId}`, payload, { withCredentials: true });
        return res.data;
    },

    deleteField: async (fieldId: number) => {
        const res = await api.delete(`/fields/${fieldId}`, { withCredentials: true });
        return res.data;
    },
};