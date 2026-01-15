// src/api/client.ts
import { getToken } from "../auth/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path: string, init: RequestInit = {}) {
    const token = getToken();

    const headers = new Headers(init.headers || {});
    if (init.body !== undefined) headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res;
}

export { API_BASE };
