
export interface Customer {
    userId: string;
    fullName: string;
    email: string;
    phone: string;        
    createdAt?: string; 
    isOnline?: boolean;
    bookingCount?: number;
    totalSpent?: number;
}
