import {create} from "zustand";
import {toast} from "sonner";
import { isAxiosError } from "axios";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({accessToken: null, user: null, loading: false});
    },

    signUp: async(fullName, email, phone, password) => {
        try {
            set({loading: true});
            // goi api
            await authService.signUp(fullName, email, phone, password);
            toast.success("Đăng ký thành công");
            
        } catch (error) {
            console.error(error);
            toast.error("Đăng ký không thành công");
        } finally {
            set({loading: false});
        }
    },

    signIn: async(email: string, password: string) => {
        try {
            set({loading: true})
            const {accessToken} = await authService.signIn(email, password);
            set({accessToken});
            await get().fetchMe();
            toast.success("Đăng nhập thành công");

            
        } catch (error: unknown) {
            console.error(error);
            const message = isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : "Đăng nhập không thành công";
            toast.error(message);
            throw error; // re-throw để form biết thất bại
        } finally {
            set({loading: false})
        }
    },

    signOut: async () => {
        try {
            set({loading: true})
            await authService.signOut();
            toast.success("Đăng xuất thành công");
        } catch (error) {
            console.error(error);
            toast.error("Đăng xuất không thành công");
        } finally {
            get().clearState(); // luôn xóa state dù API thành công hay thất bại
        }
    },

    fetchMe: async () => {
        try {
            set({loading: true});
            const {user} = await authService.fetchMe();
            set({user});
        } catch (error) {
            console.error(error);
            set({user: null, accessToken: null});
            toast.error("Lấy thông tin không thành công");
        } finally {
            set({loading: false});
        } 
    },

    refresh: async () => {
        try {
            set({loading: true});
            const {user, fetchMe} = get();
            const accessToken = await authService.refresh();
            set({accessToken});

            if(!user){
                await fetchMe();
            }
            toast.success("Refresh token thành công");
        } catch (error) {
            console.error(error);
            toast.error("Refresh token không thành công");
            get().clearState();
        } finally {
            set({loading: false});
        }
    },

    forgotPassword: async (email: string) => {
        try {
            set({loading: true});
            await authService.forgotPassword(email);
            toast.success("Email đã được gửi");
        } catch (error) {
            console.error(error);
            toast.error("Email không tồn tại");
        } finally {
            set({loading: false});
        }
    },

    resetPassword: async (token: string, newPassword: string) => {
        try {
            set({loading: true});
            await authService.resetPassword(token, newPassword);
            toast.success("Đặt lại mật khẩu thành công");
        } catch (error) {
            console.error(error);
            toast.error("Đặt lại mật khẩu không thành công");
        } finally {
            set({loading: false});
        }
    }

}));