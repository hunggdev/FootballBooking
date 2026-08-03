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
};
