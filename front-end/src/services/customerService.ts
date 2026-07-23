import api from "@/lib/axios";


export const customerService = {
    getAllCustomers: async() => {
        try {
            const res = await api.get("/customers", {withCredentials: true});
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};
