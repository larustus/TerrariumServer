// src/auth/auth.ts
import { apiFetch } from "../api/client";

const TOKEN_KEY = "shop.jwt";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
}

type AuthResponse = { token: string };

export async function login(username: string, password: string): Promise<string> {
    const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });

    const data = (await res.json()) as AuthResponse;
    console.log("LOGIN JSON:", data);

    if (!data?.token) throw new Error("No token returned by server.");

    setToken(data.token);
    console.log("TOKEN SAVED:", getToken());
    return data.token;
}

export async function register(username: string, password: string): Promise<string> {
    const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });

    const data = (await res.json()) as AuthResponse;
    console.log("REGISTER JSON:", data);

    if (!data?.token) throw new Error("Login succeeded but server did not return a token (API contract error).");


    setToken(data.token);
    console.log("TOKEN SAVED:", getToken());
    return data.token;
}
