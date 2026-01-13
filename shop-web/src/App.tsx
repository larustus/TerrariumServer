import { useEffect, useState } from "react";

type Item = {
    id: number;
    name: string;
    description?: string | null;
    price: number; // backend zwraca np. 3.1500 -> w JS to będzie number lub string zależnie od serializacji
    category?: string | null;
    availableQty?: number | null;
    imageUrl?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;
console.log("ENV:", import.meta.env);
console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

export default function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadItems() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/items`, {
                method: "GET",
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`HTTP ${res.status}: ${text}`);
            }

            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Unknown error");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadItems();
    }, []);

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
            <h1>Shop Web</h1>

            <div style={{marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8}}>
                <div><strong>API_BASE:</strong> {API_BASE ?? "(undefined)"}</div>
                <button onClick={loadItems} disabled={loading} style={{marginTop: 8}}>
                    {loading ? "Loading..." : "Reload items"}
                </button>
            </div>

            {error && (
                <div style={{marginBottom: 16, padding: 12, border: "1px solid #f00", borderRadius: 8 }}>
                    <strong>Error:</strong> {error}
                    <div style={{ marginTop: 8, fontSize: 14 }}>
                        Jeśli to wygląda na CORS: backend musi pozwolić na origin http://localhost:5173.
                    </div>
                </div>
            )}

            <h2>Items</h2>

            {items.length === 0 && !error && !loading && (
                <div>Brak itemów do wyświetlenia (albo endpoint zwraca pustą listę).</div>
            )}

            <ul style={{ padding: 0, listStyle: "none", display: "grid", gap: 12 }}>
                {items.map((it) => (
                    <li key={it.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                            <div>
                                <div style={{ fontWeight: 700 }}>{it.name}</div>
                                {it.description && <div style={{ marginTop: 6 }}>{it.description}</div>}
                                <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
                                    Category: {it.category ?? "-"} | Stock: {it.availableQty ?? "-"}
                                </div>
                            </div>
                            <div style={{ fontWeight: 700 }}>
                                {String(it.price)}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
