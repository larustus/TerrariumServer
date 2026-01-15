import { useState } from "react";
import { login, register } from "./auth";

type Mode = "login" | "register";

function prettyApiError(message: string): string {
    // spodziewamy się formatu: "HTTP 401: { ... }"
    const m = message.match(/^HTTP\s+\d+:\s*(\{.*\})\s*$/);
    if (!m) return message;

    try {
        const obj = JSON.parse(m[1]) as { message?: string };
        return obj?.message ?? message;
    } catch {
        return message;
    }
}


export default function AuthForm(props: { onAuthed: () => void }) {
    const [mode, setMode] = useState<Mode>("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit() {
        setLoading(true);
        setError(null);

        try {
            if (username.trim().length < 3) throw new Error("Username must be at least 3 characters.");
            if (password.length < 8) throw new Error("Password must be at least 8 characters.");

            if (mode === "login") {
                await login(username.trim(), password);
            } else {
                await register(username.trim(), password);
            }

            props.onAuthed();
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Unknown error";
            setError(prettyApiError(msg));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16, maxWidth: 420 }}>
            <h2 style={{ marginTop: 0 }}>{mode === "login" ? "Log in" : "Register"}</h2>

            <div style={{ display: "grid", gap: 10 }}>
                <label style={{ display: "grid", gap: 6 }}>
                    <span>Username</span>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        placeholder="e.g. test1"
                    />
                </label>

                <label style={{ display: "grid", gap: 6 }}>
                    <span>Password</span>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                        type="password"
                        placeholder="min 8 chars"
                    />
                </label>

                <button onClick={submit} disabled={loading}>
                    {loading ? "Working..." : mode === "login" ? "Log in" : "Create account"}
                </button>

                <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "register" : "login")}
                    disabled={loading}
                    style={{ background: "transparent", border: "1px solid #ddd" }}
                >
                    {mode === "login" ? "Need an account? Register" : "Have an account? Log in"}
                </button>

                {error && (
                    <div style={{ padding: 12, border: "1px solid #f00", borderRadius: 8 }}>
                        <strong>Error:</strong> {error}
                    </div>
                )}
            </div>
        </div>
    );
}
