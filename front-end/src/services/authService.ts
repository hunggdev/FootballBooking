import api from "@/lib/axios";

export const authService = {
    signUp: async(fullName: string, email: string, phone: string, password: string) => {
        try {
            const res = await api.post("/auth/signup", {fullName, email, phone, password}, {withCredentials: true});
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    signIn: async(email: string, password: string) => {
        try {
            const res = await api.post("/auth/signin", {email, password}, {withCredentials: true});
            return res.data; // access token
        } catch (error) {
            throw error;
        }
    },

    signOut: async() => {
        try {
            await api.post("/auth/signout", {}, {withCredentials: true});
        } catch (error) {
            throw error;
        }
    },

    fetchMe: async() => {
        try {
            const res = await api.get("/users/me", {withCredentials: true});
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    refresh: async() => {
        try {
            const res = await api.post("/auth/refresh", {}, {withCredentials: true});
            return res.data.accessToken;
        } catch (error) {
            throw error;    
        }
    },

    forgotPassword: async(email: string) => {
        try {
            const res = await api.post("/auth/forgot-password", {email}, {withCredentials: true});
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    resetPassword: async(token: string, newPassword: string) => {
        try {
            const res = await api.post("/auth/reset-password", {token, newPassword}, {withCredentials: true});
            return res.data;
        } catch (error) {
            throw error;
        }
    },
};