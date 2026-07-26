export interface Service {
    serviceId: number;

    name: string;

    description?: string | null;

    image?: string | null;

    price: number;

    quantity: number;

    status: "ACTIVE" | "INACTIVE";

    createdAt: string;

    updatedAt: string;
}

export interface CreateServicePayload {
    name: string;

    description?: string;

    image?: string;

    price: number;

    quantity: number;
}

export interface UpdateServicePayload {
    name?: string;

    description?: string;

    image?: string;

    price?: number;

    quantity: number;

    status?: "ACTIVE" | "INACTIVE";
}
