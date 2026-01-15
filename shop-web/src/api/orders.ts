import { apiFetch } from "./client";

export type LineItemRequest = {
    itemId: number;
    quantity: number;
};

export type PlaceOrderRequest = {
    items: LineItemRequest[];
};

export type OrderItemDto = {
    id: number;
    quantity: number;
    unitPrice: number;
    item: {
        id: number;
        name: string;
        price: number;
        category?: string | null;
        availableQty?: number | null;
        imageUrl?: string | null;
        description?: string | null;
        createdAt?: string | null;
    };
};

export type OrderDto = {
    id: number;
    orderDate: string | null;
    userId: number;
    status: string | null;
    total: number;
    items: OrderItemDto[];
};

export async function placeOrder(req: PlaceOrderRequest): Promise<OrderDto> {
    const res = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(req),
    });
    return (await res.json()) as OrderDto;
}

export async function getMyOrders(): Promise<OrderDto[]> {
    const res = await apiFetch("/orders", { method: "GET" });
    const data = await res.json();
    return Array.isArray(data) ? (data as OrderDto[]) : [];
}

export async function getMyOrder(orderId: number): Promise<OrderDto> {
    const res = await apiFetch(`/orders/${orderId}`, { method: "GET" });
    return (await res.json()) as OrderDto;
}
