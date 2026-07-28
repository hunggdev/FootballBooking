
export interface Customer {
    userId: number;
    fullName: string;
    email: string;
    phone: string;        
    createdAt?: string; 
    isOnline?: boolean;
    bookingCount?: number;
    totalSpent?: number;
    status: string;
    password: "" | string;
}

export interface CreateCustomerPayload {
    userId: number;
    fullName: string;
    email: string;
    phone: string;    
    password: string;
}

export interface UpdateCustomerPayload {
    userId: number,
    fullName: string;
    phone: string;  
    status: "ACTIVE" | "INACTIVE";      
}

export interface Stats {
    customers: number,
    totalUserInThisMonth: number,
    online: number,
    bannedCustomers: number,
    activeCustomers: number,
    inactiveCustomers: number,
}