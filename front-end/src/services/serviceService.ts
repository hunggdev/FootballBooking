import api from "@/lib/axios";
import type { CreateServicePayload, UpdateServicePayload } from "@/types/service";

export const serviceService = {
    getAllServices: async () => {
        const res = await api.get("/services", { withCredentials: true });
        return res.data;
    },

    getServiceById: async (serviceId: number) => {
        const res = await api.get(`/services/${serviceId}`, { withCredentials: true });
        return res.data;
    },

    createService: async (payload: CreateServicePayload) => {
        const res = await api.post("/services", payload, { withCredentials: true });
        return res.data;
    },

    updateService: async (serviceId: number, payload: UpdateServicePayload) => {
        const res = await api.put(`/services/${serviceId}`, payload, { withCredentials: true });
        return res.data;
    },

    deleteService: async (serviceId: number) => {
        const res = await api.delete(`/services/${serviceId}`, { withCredentials: true });
        return res.data;
    },
};
