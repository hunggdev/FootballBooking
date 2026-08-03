import api from "@/lib/axios";

export const authService = {
    signUp: async(fullName: string, email: string, phone: string, password: string) => {
        const res = await api.post("/auth/signup", {fullName, email, phone, password}, {withCredentials: true});
        return res.data;
    },

    signIn: async(email: string, password: string) => {
        const res = await api.post("/auth/signin", {email, password}, {withCredentials: true});
        return res.data; // access token
    },

    signOut: async() => {
        await api.post("/auth/signout", {}, {withCredentials: true});
    },

    fetchMe: async() => {
        const res = await api.get("/users/me", {withCredentials: true});
        return res.data;
    },

    refresh: async() => {
        const res = await api.post("/auth/refresh", {}, {withCredentials: true});
        return res.data.accessToken;
    },

    forgotPassword: async(email: string) => {
        const res = await api.post("/auth/forgot-password", {email}, {withCredentials: true});
        return res.data;
    },

    resetPassword: async(token: string, newPassword: string) => {
        const res = await api.post("/auth/reset-password", {token, newPassword}, {withCredentials: true});
        return res.data;
    },
};
