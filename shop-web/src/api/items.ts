import { apiFetch } from "./client";

export type Item = {
    id: number;
    name: string;
    description?: string | null;
    price: number; // albo string – zależnie od backendu; i tak wyświetlimy String(price)
    category?: string | null;
    availableQty?: number | null;
    imageUrl?: string | null;
    createdAt?: string | null;
};

export async function getItems(): Promise<Item[]> {
    const res = await apiFetch("/items", { method: "GET" });
    const data = await res.json();
    return Array.isArray(data) ? (data as Item[]) : [];
}

export async function getItem(id: number): Promise<Item> {
    const res = await apiFetch(`/items/${id}`, { method: "GET" });
    return (await res.json()) as Item;
}
