import {create} from "zustand";
import {toast, Toaster} from "sonner";
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

            
        } catch (error: any) {
            console.error(error);
            const message = error?.response?.data?.message || "Đăng nhập không thành công";
            toast.error(message);
            throw error; // re-throw để form biết thất bại
        } finally {
            set({loading: false})
        }
    },

    signOut: async () => {
        try {
            set({loading: true})
            get().clearState();
            await authService.signOut();
            toast.success("Đăng xuất thành công");
        } catch (error) {
            console.error(error);
            toast.error("Đăng xuất không thành công");
        } finally {
            set({loading: false})
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
        } catch (error) {
            console.error(error);
            toast.error("Refresh token không thành công");
            get().clearState();
        } finally {
            set({loading: false});
        }
    }

}));