import api from "@/lib/api";
import type {
  CreateServicePayload,
  UpdateServicePayload,
  Service,
} from "@/types/service";

export const serviceService = {
  // Lấy danh sách dịch vụ
  getServices: async (): Promise<Service[]> => {
    const res = await api.get("/services");
    return res.data.services;
  },

  // Lấy chi tiết dịch vụ
  getService: async (serviceId: number): Promise<Service> => {
    const res = await api.get(`/services/${serviceId}`);
    return res.data.service;
  },

  // Tạo dịch vụ
  createService: async (
    payload: CreateServicePayload
  ): Promise<Service> => {
    const res = await api.post("/services", payload);
    return res.data.service;
  },

  // Cập nhật dịch vụ
  updateService: async (
    serviceId: number,
    payload: UpdateServicePayload
  ): Promise<Service> => {
    const res = await api.put(`/services/${serviceId}`, payload);
    return res.data.service;
  },

  // Xóa dịch vụ
  deleteService: async (serviceId: number): Promise<Service> => {
    const res = await api.delete(`/services/${serviceId}`);
    return res.data.service;
  },
};