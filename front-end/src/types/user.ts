export type UserRole = "admin" | "customer";
export type UserStatus = "active" | "inactive" | "banned";

export interface User {
    userId: string;
    fullName: string;
    email: string;
    phone: string;        
    role?: UserRole;
    status: UserStatus;  
    createdAt?: string; 
}


