import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

// Helper trích xuất thông báo lỗi từ Axios API
const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallbackMessage;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
      },

      signUp: async (fullName, email, phone, password) => {
        try {
          set({ loading: true });
          await authService.signUp(fullName, email, phone, password);
          toast.success("Đăng ký tài khoản thành công");
        } catch (error) {
          console.error("signUp error:", error);
          toast.error(getErrorMessage(error, "Đăng ký tài khoản không thành công"));
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email, password) => {
        try {
          set({ loading: true });
          const { accessToken } = await authService.signIn(email, password);
          set({ accessToken });

          // Gọi trực tiếp API lấy User để tránh bị xung đột loading state với fetchMe()
          const { user } = await authService.fetchMe();
          set({ user });

          toast.success("Đăng nhập thành công");
        } catch (error: unknown) {
          console.error("signIn error:", error);
          toast.error(getErrorMessage(error, "Đăng nhập không thành công"));
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          set({ loading: true });
          await authService.signOut();
          toast.success("Đăng xuất thành công");
        } catch (error) {
          console.error("signOut error:", error);
          toast.error("Đăng xuất không thành công");
        } finally {
          get().clearState();
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const { user } = await authService.fetchMe();
          set({ user });
        } catch (error) {
          console.error("fetchMe error:", error);
          set({ user: null, accessToken: null });
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const accessToken = await authService.refresh();
          set({ accessToken });

          if (!get().user) {
            const { user } = await authService.fetchMe();
            set({ user });
          }
        } catch (error) {
          console.error("refresh error:", error);
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          await authService.forgotPassword(email);
          toast.success(
            "Kiểm tra email để xác thực cấp lại mật khẩu (link có hiệu lực trong 15 phút)"
          );
        } catch (error) {
          console.error("forgotPassword error:", error);
          // Đã sửa: Hiện thông báo lỗi thay vì thông báo thành công
          toast.error(getErrorMessage(error, "Gửi yêu cầu thất bại, vui lòng thử lại"));
        } finally {
          set({ loading: false });
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ loading: true });
          await authService.resetPassword(token, newPassword);
          toast.success("Đặt lại mật khẩu thành công");
        } catch (error) {
          console.error("resetPassword error:", error);
          toast.error(getErrorMessage(error, "Đặt lại mật khẩu không thành công"));
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // Tên key lưu trong localStorage
      storage: createJSONStorage(() => localStorage),
      // Chỉ lưu accessToken và user, BỎ QUA loading (tránh bị kẹt spinner khi F5)
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);