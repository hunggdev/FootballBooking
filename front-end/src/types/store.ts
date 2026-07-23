import type { Customer } from "./customer";
import type { User } from "./user";

export interface AuthState {
    accessToken: string | null;
    user: User | null;
    loading: boolean;

    clearState: () => void;
    
    signUp: (fullName: string, email: string, phone: string, password: string) => Promise<void>;    
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;    
    resetPassword: (token: string, newPassword: string) => Promise<void>;    
}

export interface UserState {
    user: User | null;
    loading: boolean;

    updateMe: (fullName: string, phone: string) => Promise<void>;
    changePassword: (password: string, newPassword: string, confirmPassword: string) => Promise<void>;
}
