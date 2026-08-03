import api from "@/lib/axios";

export const userService = {
    updateMe: async(fullName: string, phone: string) => {
        try {
            const res = await api.patch("/users/update", {fullName, phone}, {withCredentials: true});
            return res.data;
        } catch (error) {
            throw error;
        }
    },
    
    changePassword: async (password: string, newPassword: string, confirmPassword: string) => {
        try {
            const res = await api.patch("/users/change-password", {password, newPassword, confirmPassword}, {withCredentials: true});
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    chatbot: async (question: string) => {
        try {
            const res = await api.post("/users/chatbot", {question}, {withCredentials: true});
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};