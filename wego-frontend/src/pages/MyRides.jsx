import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function MyRides() {
    const { theme, isDark } = useTheme();
    const [rides, setRides] = useState([]);
    const [reservations, setReservations] = useState({});
    const [expandedRide, setExpandedRide] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/rides/my").then((res) => {
            setRides(res.data);
            setLoading(false);
        });
    }, []);

    const loadReservations = async (rideId) => {
        if (expandedRide === rideId) {
            setExpandedRide(null);
            return;
        }
        try {
            const res = await api.get(`/reservations/ride/${rideId}`);
            setReservations(prev => ({...prev, [rideId]: res.data}));
            setExpandedRide(rideId);
        } catch {
            alert("Грешка при вчитување!");
        }
    };

    const handleConfirm = async (reservationId, rideId) => {
        await api.put(`/reservations/${reservationId}/confirm`);
        const res = await api.get(`/reservations/ride/${rideId}`);
        setReservations(prev => ({...prev, [rideId]: res.data}));
    };

    const handleReject = async (reservationId, rideId) => {
        await api.put(`/reservations/${reservationId}/cancel`);
        const res = await api.get(`/reservations/ride/${rideId}`);
        setReservations(prev => ({...prev, [rideId]: res.data}));
    };

    const handleCancelRide = async (id) => {
        if (!confirm("Дали сакаш да го откажеш ова патување?")) return;
        await api.delete(`/rides/${id}`);
        setRides(rides.map((r) => r.id === id ? {...r, status: "CANCELLED"} : r));
    };

    const statusConfig = {
        ACTIVE: { label: "Активно", bg: "#e6f4ea", color: "#137333" },
        CANCELLED: { label: "Откажано", bg: "#fce8e6", color: "#c5221f" },
        COMPLETED: { label: "Завршено", bg: "#e8f0fe", color: "#1a73e8" },
    };

    const resStatusConfig = {
        PENDING: { label: "Чека потврда", bg: "#fff8e1", color: "#f57c00" },
        CONFIRMED: { label: "Потврден", bg: "#e6f4ea", color: "#137333" },
        CANCELLED: { label: "Откажан", bg: "#fce8e6", color: "#c5221f" },
    };

    return (
        <div style={{ minHeight: "100vh", background: theme.bg }}>
            <Navbar />
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: "700", color: theme.text, margin: "0 0 4px" }}>Мои возења</h1>
                        <p style={{ color: theme.subtext, fontSize: "14px", margin: 0 }}>{rides.length} патувања вкупно</p>
                    </div>
                    <Link to="/create-ride" style={{
                        background: "#dc2626", color: "white", padding: "10px 20px",
                        borderRadius: "8px", textDecoration: "none", fontWeight: "700", fontSize: "14px",
                    }}>+ Додај возење</Link>
                </div>

                {loading && <div style={{ textAlign: "center", padding: "60px", color: theme.subtext }}>Се вчитува...</div>}

                {!loading && rides.length === 0 && (
                    <div style={{
                        textAlign: "center", padding: "80px 24px",
                        background: theme.card, borderRadius: "16px", border: `1px solid ${theme.border}`,
                    }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚗</div>
                        <h3 style={{ color: theme.text, fontSize: "18px", fontWeight: "600", margin: "0 0 8px" }}>
                            Немаш објавено возења
                        </h3>
                        <p style={{ color: theme.subtext, fontSize: "14px", margin: "0 0 24px" }}>
                            Додади прво возење и почни да патуваш
                        </p>
                        <Link to="/create-ride" style={{
                            background: "#dc2626", color: "white", padding: "12px 24px",
                            borderRadius: "8px", textDecoration: "none", fontWeight: "700",
                        }}>Додади возење</Link>
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {rides.map((ride) => {
                        const status = statusConfig[ride.status] || statusConfig.ACTIVE;
                        const rideReservations = reservations[ride.id] || [];
                        const pendingCount = rideReservations.filter(r => r.status === "PENDING").length;
                        const confirmedCount = rideReservations.filter(r => r.status === "CONFIRMED").length;
                        const isExpanded = expandedRide === ride.id;

                        return (
                            <div key={ride.id} style={{
                                background: theme.card, border: `1px solid ${theme.border}`,
                                borderRadius: "16px", overflow: "hidden", boxShadow: theme.shadow,
                            }}>
                                {/* Ride Header */}
                                <div style={{ padding: "20px 24px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ fontSize: "18px", fontWeight: "700", color: theme.text }}>{ride.fromCity}</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                                                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#dc2626" }} />
                                                <div style={{ width: "32px", height: "2px", background: "#dc2626" }} />
                                                <div style={{ width: "5px", height: "5px", background: "#dc2626", transform: "rotate(45deg)" }} />
                                            </div>
                                            <span style={{ fontSize: "18px", fontWeight: "700", color: theme.text }}>{ride.toCity}</span>
                                        </div>
                                        <span style={{
                                            padding: "4px 12px", borderRadius: "20px",
                                            fontSize: "12px", fontWeight: "600",
                                            background: status.bg, color: status.color,
                                        }}>{status.label}</span>
                                    </div>

                                    <div style={{ height: "1px", background: theme.border, marginBottom: "14px" }} />

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", gap: "16px" }}>
                                            <span style={{ fontSize: "13px", color: theme.subtext }}>
                                                📅 {new Date(ride.departureTime).toLocaleString("mk-MK", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                            <span style={{ fontSize: "13px", color: theme.subtext }}>
                                                💺 {ride.availableSeats}/{ride.totalSeats}
                                            </span>
                                            <span style={{ fontSize: "13px", fontWeight: "700", color: theme.text }}>
                                                {ride.pricePerPerson} ден
                                            </span>
                                            <Link to={`/rides/${ride.id}`} style={{
                                                background: "#e8f0fe",
                                                color: "#1a73e8",
                                                padding: "7px 14px",
                                                borderRadius: "8px",
                                                textDecoration: "none",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                            }}>💬 Отвори чат</Link>
                                        </div>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            {ride.status === "ACTIVE" && (
                                                <button
                                                    onClick={() => loadReservations(ride.id)}
                                                    style={{
                                                        background: isExpanded ? theme.border : "#e8f0fe",
                                                        border: "none", color: isExpanded ? theme.subtext : "#1a73e8",
                                                        padding: "7px 14px", borderRadius: "8px",
                                                        cursor: "pointer", fontSize: "13px", fontWeight: "600",
                                                        display: "flex", alignItems: "center", gap: "6px",
                                                    }}>
                                                    👥 Патници
                                                    {pendingCount > 0 && (
                                                        <span style={{
                                                            background: "#dc2626", color: "white",
                                                            borderRadius: "50%", width: "18px", height: "18px",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            fontSize: "11px", fontWeight: "700",
                                                        }}>{pendingCount}</span>
                                                    )}
                                                </button>
                                            )}
                                            {ride.status === "ACTIVE" && (
                                                <button onClick={() => handleCancelRide(ride.id)} style={{
                                                    background: "none", border: `1px solid #dc2626`,
                                                    color: "#dc2626", padding: "7px 14px",
                                                    borderRadius: "8px", cursor: "pointer",
                                                    fontSize: "13px", fontWeight: "600",
                                                }}>Откажи</button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Reservations Panel */}
                                {isExpanded && (
                                    <div style={{ borderTop: `1px solid ${theme.border}` }}>
                                        <div style={{
                                            padding: "14px 24px",
                                            background: isDark ? "#2d2f31" : "#f8f9fa",
                                            display: "flex", justifyContent: "space-between",
                                            alignItems: "center",
                                        }}>
                                            <span style={{ fontSize: "13px", fontWeight: "700", color: theme.text }}>
                                                Резервации ({rideReservations.filter(r => r.status !== "CANCELLED").length})
                                            </span>
                                            <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
                                                <span style={{ color: "#f57c00" }}>⏳ {pendingCount} чекаат</span>
                                                <span style={{ color: "#137333" }}>✓ {confirmedCount} потврдени</span>
                                            </div>
                                        </div>

                                        {rideReservations.length === 0 && (
                                            <div style={{ padding: "24px", textAlign: "center", color: theme.subtext, fontSize: "14px" }}>
                                                Сè уште нема резервации
                                            </div>
                                        )}

                                        {rideReservations.filter(r => r.status !== "CANCELLED").map((res) => {
                                            const resStatus = resStatusConfig[res.status] || resStatusConfig.PENDING;
                                            return (
                                                <div key={res.id} style={{
                                                    padding: "16px 24px",
                                                    borderBottom: `1px solid ${theme.border}`,
                                                    display: "flex", justifyContent: "space-between",
                                                    alignItems: "center",
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                        <div style={{
                                                            width: "36px", height: "36px", borderRadius: "50%",
                                                            background: isDark ? "#3c4043" : "#f1f3f4",
                                                            display: "flex", alignItems: "center",
                                                            justifyContent: "center", fontWeight: "700",
                                                            fontSize: "14px", color: theme.text,
                                                        }}>
                                                            {res.passengerFirstName?.[0]}{res.passengerLastName?.[0]}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: "600", fontSize: "14px", color: theme.text }}>
                                                                {res.passengerFirstName} {res.passengerLastName}
                                                            </div>
                                                            {res.passengerPhone && (
                                                                <div style={{ fontSize: "12px", color: theme.subtext }}>
                                                                    📞 {res.passengerPhone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                        <span style={{
                                                            padding: "4px 10px", borderRadius: "20px",
                                                            fontSize: "12px", fontWeight: "600",
                                                            background: resStatus.bg, color: resStatus.color,
                                                        }}>{resStatus.label}</span>
                                                        {res.status === "PENDING" && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleConfirm(res.id, ride.id)}
                                                                    style={{
                                                                        background: "#e6f4ea", color: "#137333",
                                                                        border: "none", padding: "7px 14px",
                                                                        borderRadius: "8px", cursor: "pointer",
                                                                        fontSize: "13px", fontWeight: "700",
                                                                    }}>✓ Прифати</button>
                                                                <button
                                                                    onClick={() => handleReject(res.id, ride.id)}
                                                                    style={{
                                                                        background: "#fce8e6", color: "#c5221f",
                                                                        border: "none", padding: "7px 14px",
                                                                        borderRadius: "8px", cursor: "pointer",
                                                                        fontSize: "13px", fontWeight: "700",
                                                                    }}>✗ Одбиј</button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}