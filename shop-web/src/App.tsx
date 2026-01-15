// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import AuthForm from "./auth/AuthForm";
import { clearToken, getToken } from "./auth/auth";

import { getItems } from "./api/items";
import type { Item } from "./api/items";

import { placeOrder } from "./api/orders";
import type { OrderDto } from "./api/orders";
import Comments from "./comments/Comments";


const API_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;

function ItemsAndOrder(props: { authVersion: number }) {
    const [items, setItems] = useState<Item[]>([]);
    const [loadingItems, setLoadingItems] = useState(false);

    const [qtyById, setQtyById] = useState<Record<number, number>>({});
    const [placing, setPlacing] = useState(false);

    const [lastOrder, setLastOrder] = useState<OrderDto | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ważne: token ma się odświeżać po login/logout
    const token = useMemo(() => getToken(), [props.authVersion]);

    async function load() {
        setLoadingItems(true);
        setError(null);
        try {
            const data = await getItems();
            setItems(data);

            // init qty=0 dla nowych itemów
            setQtyById((prev) => {
                const next = { ...prev };
                for (const it of data) {
                    if (next[it.id] === undefined) next[it.id] = 0;
                }
                return next;
            });
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setLoadingItems(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const orderLines = useMemo(() => {
        return Object.entries(qtyById)
            .map(([idStr, qty]) => ({ itemId: Number(idStr), quantity: qty }))
            .filter((x) => x.quantity > 0);
    }, [qtyById]);

    const canPlace = Boolean(token) && orderLines.length > 0 && !placing;

    async function onPlaceOrder() {
        console.log("TOKEN:", token);
        console.log("REQ:", { items: orderLines });
        setError(null);
        setLastOrder(null);

        if (!token) {
            setError("You must be logged in to place an order.");
            return;
        }
        if (orderLines.length === 0) {
            setError("Choose at least one item (quantity > 0).");
            return;
        }

        setPlacing(true);
        try {
            const created = await placeOrder({ items: orderLines });
            setLastOrder(created);

            // reset qty
            setQtyById((prev) => {
                const next = { ...prev };
                for (const k of Object.keys(next)) next[Number(k)] = 0;
                return next;
            });

            // refresh stock
            await load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Unknown error");
        } finally {
            setPlacing(false);
        }
    }

    return (
        <div style={{ marginTop: 24 }}>
            <div
                style={{
                    marginBottom: 16,
                    padding: 12,
                    border: "1px solid #ddd",
                    borderRadius: 8,
                }}
            >
                <div>
                    <strong>API_BASE:</strong> {API_BASE ?? "(undefined)"}
                </div>
                <div style={{ marginTop: 6, opacity: 0.8 }}>
                    <strong>Auth:</strong> {token ? "logged in" : "anonymous"}
                </div>

                <button onClick={load} disabled={loadingItems} style={{ marginTop: 10 }}>
                    {loadingItems ? "Loading..." : "Reload items"}
                </button>
            </div>

            {error && (
                <div
                    style={{
                        marginBottom: 16,
                        padding: 12,
                        border: "1px solid #f00",
                        borderRadius: 8,
                    }}
                >
                    <strong>Error:</strong> {error}
                </div>
            )}

            {lastOrder && (
                <div
                    style={{
                        marginBottom: 16,
                        padding: 12,
                        border: "1px solid #0a0",
                        borderRadius: 8,
                    }}
                >
                    <div>
                        <strong>Order created:</strong> #{lastOrder.id}
                    </div>
                    <div>
                        <strong>Total:</strong> {String(lastOrder.total)}
                    </div>
                </div>
            )}

            <h2>Items</h2>

            <div style={{ display: "grid", gap: 12 }}>
                {items.map((it) => {
                    const qty = qtyById[it.id] ?? 0;
                    const stock = it.availableQty ?? null;

                    return (
                        <div key={it.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700 }}>{it.name}</div>
                                    {it.description && <div style={{ marginTop: 6 }}>{it.description}</div>}
                                    <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
                                        Category: {it.category ?? "-"} | Stock: {stock === null ? "-" : stock}
                                    </div>
                                </div>

                                <div style={{ minWidth: 180, textAlign: "right" }}>
                                    <div style={{ fontWeight: 700 }}>{String(it.price)}</div>

                                    <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                        <button
                                            onClick={() =>
                                                setQtyById((p) => ({ ...p, [it.id]: Math.max(0, (p[it.id] ?? 0) - 1) }))
                                            }
                                            disabled={qty <= 0}
                                        >
                                            -
                                        </button>

                                        <input
                                            value={qty}
                                            onChange={(e) => {
                                                const v = Number(e.target.value);
                                                const normalized = Number.isFinite(v) ? Math.max(0, Math.floor(v)) : 0;
                                                setQtyById((p) => ({ ...p, [it.id]: normalized }));
                                            }}
                                            style={{ width: 64, textAlign: "center" }}
                                            inputMode="numeric"
                                        />

                                        <button
                                            onClick={() => setQtyById((p) => ({ ...p, [it.id]: (p[it.id] ?? 0) + 1 }))}
                                            disabled={stock !== null && qty >= stock}
                                            title={stock !== null && qty >= stock ? "No more stock" : "Increase"}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <Comments itemId={it.id} authVersion={props.authVersion} />
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                <div style={{ marginBottom: 8 }}>
                    <strong>Selected lines:</strong> {orderLines.length}
                </div>

                <button onClick={onPlaceOrder} disabled={!canPlace}>
                    {placing ? "Placing..." : "Place order"}
                </button>

                {!token && (
                    <div style={{ marginTop: 8, fontSize: 14, opacity: 0.8 }}>
                        Log in to place an order.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function App() {
    const [version, setVersion] = useState(0);
    const token = useMemo(() => getToken(), [version]);

    function onAuthed() {
        setVersion((v) => v + 1);
    }

    function logout() {
        clearToken();
        setVersion((v) => v + 1);
    }

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", fontFamily: "system-ui" }}>
            <h1>Shop Web</h1>

            {!token ? (
                <AuthForm onAuthed={onAuthed} />
            ) : (
                <>
                    <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
                        <h2 style={{ marginTop: 0 }}>You are logged in</h2>
                        <button onClick={logout}>Log out</button>
                    </div>

                    <ItemsAndOrder authVersion={version} />
                </>
            )}
        </div>
    );
}

