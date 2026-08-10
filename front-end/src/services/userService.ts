import api from "@/lib/axios";

export const userService = {
    updateMe: async(fullName: string, phone: string) => {
        const res = await api.patch("/users/update", {fullName, phone}, {withCredentials: true});
        return res.data;
    },

    changePassword: async (password: string, newPassword: string, confirmPassword: string) => {
        const res = await api.patch("/users/change-password", {password, newPassword, confirmPassword}, {withCredentials: true});
        return res.data;
    },

    chatbot: async (message: string) => {
        const res = await api.post("/users/chatbot", {message}, {withCredentials: true});
        return res.data;
    },
};
