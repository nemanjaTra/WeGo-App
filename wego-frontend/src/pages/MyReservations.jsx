import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function MyReservations() {
    const { theme } = useTheme();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/reservations/my").then((res) => { setReservations(res.data); setLoading(false); });
    }, []);

    const handleCancel = async (id) => {
        if (!confirm("Дали сакаш да ја откажеш резервацијата?")) return;
        await api.put(`/reservations/${id}/cancel`);
        setReservations(reservations.map((r) => r.id === id ? {...r, status: "CANCELLED"} : r));
    };

    const statusConfig = {
        CONFIRMED: { label: "Потврдено", bg: "#e6f4ea", color: "#137333" },
        PENDING: { label: "Чека потврда", bg: "#fef9e7", color: "#f57c00" },
        CANCELLED: { label: "Откажано", bg: "#fce8e6", color: "#c5221f" },
        COMPLETED: { label: "Завршено", bg: "#e8f0fe", color: "#1a73e8" },
    };

    return (
        <div style={{ minHeight: "100vh", background: theme.bg }}>
            <Navbar />
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
                <div style={{ marginBottom: "24px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: "700", color: theme.text, margin: "0 0 4px" }}>Мои резервации</h1>
                    <p style={{ color: theme.subtext, fontSize: "14px", margin: 0 }}>{reservations.length} резервации вкупно</p>
                </div>

                {loading && (
                    <div style={{ textAlign: "center", padding: "60px", color: theme.subtext }}>Се вчитува...</div>
                )}

                {!loading && reservations.length === 0 && (
                    <div style={{
                        textAlign: "center", padding: "80px 24px",
                        background: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`,
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎫</div>
                        <h3 style={{ color: theme.text, fontSize: "18px", fontWeight: "600", margin: "0 0 8px" }}>Немаш резервации</h3>
                        <p style={{ color: theme.subtext, fontSize: "14px", margin: 0 }}>Пребарај патување и резервирај место</p>
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {reservations.map((r) => {
                        const status = statusConfig[r.status] || statusConfig.PENDING;
                        return (
                            <div key={r.id} style={{
                                background: theme.card, border: `1px solid ${theme.border}`,
                                borderRadius: "16px", padding: "20px 24px",
                                boxShadow: theme.shadow,
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <span style={{ fontSize: "18px", fontWeight: "700", color: theme.text }}>{r.fromCity}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#dc2626" }} />
                                            <div style={{ width: "32px", height: "2px", background: "#dc2626" }} />
                                            <div style={{ width: "5px", height: "5px", background: "#dc2626", transform: "rotate(45deg)" }} />
                                        </div>
                                        <span style={{ fontSize: "18px", fontWeight: "700", color: theme.text }}>{r.toCity}</span>
                                    </div>
                                    <span style={{
                                        padding: "4px 12px", borderRadius: "20px",
                                        fontSize: "12px", fontWeight: "600",
                                        background: status.bg, color: status.color,
                                    }}>{status.label}</span>
                                </div>

                                <div style={{ height: "1px", background: theme.border, marginBottom: "14px" }} />

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <div style={{ fontSize: "13px", color: theme.subtext }}>
                                            📅 {new Date(r.departureTime).toLocaleString("mk-MK", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                        <div style={{ fontSize: "13px", color: theme.subtext }}>
                                            🧑 {r.driverFirstName} {r.driverLastName}
                                            {r.driverPhone && ` · 📞 ${r.driverPhone}`}
                                        </div>
                                        <div style={{ fontSize: "13px", color: theme.subtext }}>
                                            🚗 {r.vehicleBrand} {r.vehicleModel} · {r.licensePlate}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                                        <span style={{ fontSize: "20px", fontWeight: "700", color: theme.text }}>
                                            {r.pricePerPerson} ден
                                        </span>
                                        {r.status === "PENDING" && (
                                            <button onClick={() => handleCancel(r.id)} style={{
                                                background: "none", border: `1px solid #dc2626`,
                                                color: "#dc2626", padding: "7px 14px",
                                                borderRadius: "8px", cursor: "pointer",
                                                fontSize: "13px", fontWeight: "600",
                                            }}>Откажи</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}