// src/comments/Comments.tsx
import { useEffect, useMemo, useState } from "react";
import { addComment, getComments, type CommentDto } from "../api/comments";
import { getToken } from "../auth/auth";

function formatDate(iso: string | null | undefined): string {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
}

export default function Comments(props: { itemId: number; authVersion: number }) {
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [loading, setLoading] = useState(false);

    const [newContent, setNewContent] = useState("");
    const [posting, setPosting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    // token odświeżany po login/logout
    const token = useMemo(() => getToken(), [props.authVersion]);
    const canPost = Boolean(token) && !posting;

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const data = await getComments(props.itemId);
            setComments(data);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.itemId]);

    async function submit() {
        setError(null);

        const trimmed = newContent.trim();

        // UI walidacja (backend i tak powinien walidować)
        if (!token) {
            setError("Log in to add a comment.");
            return;
        }
        if (trimmed.length === 0) {
            setError("Comment cannot be empty.");
            return;
        }
        if (trimmed.length > 1000) {
            setError("Comment must be <= 1000 characters.");
            return;
        }

        setPosting(true);
        try {
            await addComment(props.itemId, trimmed);
            setNewContent("");
            await load(); // najprościej: po dodaniu odśwież listę
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setPosting(false);
        }
    }

    return (
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid #eee" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 700 }}>Comments</div>

                <button onClick={load} disabled={loading || posting} style={{ fontSize: 12 }}>
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {error && (
                <div style={{ marginTop: 10, padding: 10, border: "1px solid #f00", borderRadius: 8 }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Lista komentarzy */}
            <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {comments.length === 0 ? (
                    <div style={{ opacity: 0.7, fontSize: 14 }}>No comments yet.</div>
                ) : (
                    comments.map((c) => (
                        <div key={c.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <div style={{ fontWeight: 600 }}>{c.username}</div>
                                <div style={{ fontSize: 12, opacity: 0.7 }}>{formatDate(c.createdAt)}</div>
                            </div>

                            {/* Bezpieczne: React ucieka HTML, nie używamy dangerouslySetInnerHTML */}
                            <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{c.content}</div>
                        </div>
                    ))
                )}
            </div>

            {/* Dodawanie komentarza */}
            <div style={{ marginTop: 12 }}>
        <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={token ? "Write a comment..." : "Log in to write a comment..."}
            disabled={!token || posting}
            rows={3}
            style={{ width: "100%", resize: "vertical", padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{newContent.trim().length}/1000</div>

                    <button onClick={submit} disabled={!canPost}>
                        {posting ? "Posting..." : "Add comment"}
                    </button>
                </div>

                {!token && (
                    <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
                        Comments are public to read, but adding requires login.
                    </div>
                )}
            </div>
        </div>
    );
}
