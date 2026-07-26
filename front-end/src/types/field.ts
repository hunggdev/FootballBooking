export interface Field {
    fieldId: number;

    name: string;

    description?: string | null;

    image?: string | null;

    pricePerHour: number;

    openTime: string;

    closeTime: string;

    fieldType: "FIVE" | "SEVEN";

    status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";

    createdAt: string;

    updatedAt: string;
}

export interface CreateFieldPayload {
    name: string;

    description?: string;

    image?: string;

    pricePerHour: number;

    openTime: string;

    closeTime: string;

    fieldType: "FIVE" | "SEVEN";
}

export interface UpdateFieldPayload {
    name?: string;

    description?: string;

    image?: string;

    pricePerHour?: number;

    openTime?: string;

    closeTime?: string;

    fieldType?: "FIVE" | "SEVEN";

    status?: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
}