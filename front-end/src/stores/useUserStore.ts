import { create } from "zustand";
import { toast } from "sonner";

import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: false,

  updateMe: async (fullName, phone) => {
    try {
      set({ loading: true });

      const user = await userService.updateMe(fullName, phone);

      set({ user });

      toast.success("Cập nhật thành công");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật không thành công");
    } finally {
      set({ loading: false });
    }
  },

  changePassword: async (password, newPassword, confirmPassword) => {
    try {
      set({ loading: true });

      await userService.changePassword(password, newPassword, confirmPassword);

      toast.success("Cập nhật mật khẩu thành công");
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật mật khẩu không thành công");
    } finally {
      set({ loading: false });
    } 
  }
}));