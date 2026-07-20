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
    
}