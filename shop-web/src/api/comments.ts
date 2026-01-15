// src/api/comments.ts
import { apiFetch } from "./client";

export type CommentDto = {
    id: number;
    itemId: number;
    userId: number;
    username: string;
    content: string;
    createdAt: string; // ISO
};

export type CreateCommentRequest = {
    content: string;
};

export async function getComments(itemId: number): Promise<CommentDto[]> {
    const res = await apiFetch(`/items/${itemId}/comments`, { method: "GET" });
    const data = await res.json();
    return Array.isArray(data) ? (data as CommentDto[]) : [];
}

export async function addComment(itemId: number, content: string): Promise<CommentDto> {
    const res = await apiFetch(`/items/${itemId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content } satisfies CreateCommentRequest),
    });
    return (await res.json()) as CommentDto;
}
