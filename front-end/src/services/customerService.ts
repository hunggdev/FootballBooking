import api from "@/lib/axios";
import type { CreateCustomerPayload, UpdateCustomerPayload } from "@/types/customer";


export const customerService = {
    getAllCustomers: async(all = true) => {
        try {
            const res = await api.get("/customers", {params: all ? {all : "1"}: undefined, withCredentials: true});
            return res.data;
        } catch (error) {
            throw error; 
        }
    },

    getCustomerById: async (customerId: number) => {
        try {
            const res = await api.get(`/customers/${customerId}`, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    createCustomer: async (payload: CreateCustomerPayload) => {
        try{
            const res = await api.post("/customers", payload, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    updateCustomer: async (customerId: number, payload: UpdateCustomerPayload) => {
        try {
            const res = await api.put(`/customers/${customerId}`, payload, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    deleteCustomer: async (customerId: number) => {
        try {
            const res = await api.delete(`/customers/${customerId}`, { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    statsCustomer: async () => {
        try {
            const res = await api.get("/customers/stats", { withCredentials: true });
            return res.data;
        } catch (error) {
            throw error;
        }
    }



};
