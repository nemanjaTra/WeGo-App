import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Navbar from "../components/Navbar";
import api from "../api/axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function RideDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const { theme, isDark } = useTheme();
    const navigate = useNavigate();
    const [ride, setRide] = useState(null);
    const [passengers, setPassengers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [reserved, setReserved] = useState(false);
    const [mapCoords, setMapCoords] = useState([]);
    const [distance, setDistance] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        api.get(`/rides/${id}`).then((res) => setRide(res.data));
        api.get(`/reservations/ride/${id}`).then((res) => {
            const active = res.data.filter(r => r.status !== "CANCELLED");
            setPassengers(active);
            if (user) {
                setReserved(active.some(r =>
                    r.passengerFirstName === user.firstName &&
                    r.passengerLastName === user.lastName &&
                    r.status === "CONFIRMED"
                ));
            }
        });
        fetchMessages();
    }, [id]);

    useEffect(() => {
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!ride) return;
        const cities = [ride.fromCity, ...(ride.stops || []), ride.toCity];
        const geocode = async (city) => {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ", Macedonia")}&format=json&limit=1`
            );
            const data = await res.json();
            return data.length > 0 ? [parseFloat(data[0].lat), parseFloat(data[0].lon)] : null;
        };
        const loadCoords = async () => {
            const coords = await Promise.all(cities.map(geocode));
            const valid = coords.filter(Boolean);
            setMapCoords(valid);
            if (valid.length >= 2) {
                let total = 0;
                for (let i = 0; i < valid.length - 1; i++) {
                    const R = 6371;
                    const dLat = (valid[i+1][0] - valid[i][0]) * Math.PI / 180;
                    const dLon = (valid[i+1][1] - valid[i][1]) * Math.PI / 180;
                    const a = Math.sin(dLat/2)**2 + Math.cos(valid[i][0]*Math.PI/180) *
                        Math.cos(valid[i+1][0]*Math.PI/180) * Math.sin(dLon/2)**2;
                    total += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                }
                setDistance(Math.round(total));
            }
        };
        loadCoords();
    }, [ride]);

    const fetchMessages = () => {
        api.get(`/messages/ride/${id}`).then((res) => setMessages(res.data));
    };

    const handleReserve = async () => {
        if (!user) { navigate("/login"); return; }
        try {
            await api.post("/reservations", { rideId: parseInt(id), seatsRequested: 1 });
            const res = await api.get(`/reservations/ride/${id}`);
            const active = res.data.filter(r => r.status !== "CANCELLED");
            setPassengers(active);
            alert("✅ Резервацијата е поднесена! Чекај потврда од возачот.");
        } catch (err) {
            alert(err.response?.data || "Грешка!");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await api.post("/messages", { rideId: parseInt(id), content: newMessage });
            setNewMessage("");
            fetchMessages();
        } catch {
            alert("Грешка при испраќање!");
        }
    };

    if (!ride) return (
        <div style={{ minHeight: "100vh", background: theme.bg }}>
            <Navbar />
            <div style={{ textAlign: "center", padding: "80px", color: theme.subtext }}>Се вчитува...</div>
        </div>
    );

    const isDriver = user?.email === ride.driverEmail ||
        (user?.firstName === ride.driverFirstName && user?.lastName === ride.driverLastName);
    const isPending = passengers.some(r =>
        r.passengerFirstName === user?.firstName &&
        r.passengerLastName === user?.lastName &&
        r.status === "PENDING"
    );
    const canChat = user && (isDriver || reserved);
    const hasReservation = passengers.some(r =>
        r.passengerFirstName === user?.firstName &&
        r.passengerLastName === user?.lastName
    );

    return (
        <div style={{ minHeight: "100vh", background: theme.bg }}>
            <Navbar />

            {/* Hero Route Bar */}
            <div style={{
                background: isDark ? "#1e1e1e" : "white",
                borderBottom: `1px solid ${theme.border}`,
                padding: "20px 24px",
            }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <button onClick={() => navigate(-1)} style={{
                            background: theme.badge, border: "none", borderRadius: "8px",
                            padding: "8px 12px", cursor: "pointer", color: theme.text, fontSize: "14px",
                        }}>← Назад</button>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span style={{ fontSize: "22px", fontWeight: "800", color: theme.text }}>{ride.fromCity}</span>
                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626" }} />
                                <div style={{ width: "40px", height: "2px", background: "#dc2626" }} />
                                <div style={{ width: "6px", height: "6px", background: "#dc2626", transform: "rotate(45deg)" }} />
                            </div>
                            <span style={{ fontSize: "22px", fontWeight: "800", color: theme.text }}>{ride.toCity}</span>
                            {distance && (
                                <span style={{
                                    background: "#fce8e6", color: "#dc2626",
                                    padding: "4px 10px", borderRadius: "20px",
                                    fontSize: "12px", fontWeight: "700",
                                }}>~{distance} км</span>
                            )}
                        </div>
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: theme.text }}>
                        {ride.pricePerPerson} <span style={{ fontSize: "14px", color: theme.subtext, fontWeight: "400" }}>ден/лице</span>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: "1100px", margin: "24px auto", padding: "0 24px", display: "flex", gap: "24px" }}>

                {/* Left Column */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

                    {/* Info Card */}
                    <div style={{
                        background: theme.card, borderRadius: "16px",
                        border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
                        overflow: "hidden",
                    }}>
                        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}` }}>
                            <h3 style={{ color: theme.text, fontSize: "15px", fontWeight: "700", margin: 0 }}>Детали за патувањето</h3>
                        </div>
                        {[
                            ["📅 Датум и време", new Date(ride.departureTime).toLocaleString("mk-MK")],
                            ["💺 Слободни места", `${ride.availableSeats} од ${ride.totalSeats}`],
                            ["💰 Цена", `${ride.pricePerPerson} ден по лице`],
                            ...(ride.stops?.length > 0 ? [["📍 Постанки", ride.stops.join(" → ")]] : []),
                            ...(ride.notes ? [["📝 Напомена", ride.notes]] : []),
                        ].map(([label, value]) => (
                            <div key={label} style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "14px 24px", borderBottom: `1px solid ${theme.border}`,
                            }}>
                                <span style={{ color: theme.subtext, fontSize: "14px" }}>{label}</span>
                                <span style={{ color: theme.text, fontSize: "14px", fontWeight: "500", textAlign: "right", maxWidth: "60%" }}>{value}</span>
                            </div>
                        ))}

                        {/* Reserve Button */}
                        {!isDriver && !hasReservation && ride.availableSeats > 0 && (
                            <div style={{ padding: "16px 24px" }}>
                                <button onClick={handleReserve} style={{
                                    width: "100%", padding: "14px",
                                    background: "#dc2626", color: "white",
                                    border: "none", borderRadius: "8px",
                                    fontSize: "15px", fontWeight: "700", cursor: "pointer",
                                    boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                                }}>Резервирај место →</button>
                            </div>
                        )}
                        {isPending && (
                            <div style={{
                                margin: "16px 24px 16px", padding: "14px 16px",
                                background: "#fff8e1", border: "1px solid #ffd54f",
                                borderRadius: "8px", fontSize: "14px",
                                color: "#f57c00", fontWeight: "600",
                            }}>
                                ⏳ Чекаш потврда од возачот
                            </div>
                        )}
                        {reserved && (
                            <div style={{
                                margin: "16px 24px 16px", padding: "14px 16px",
                                background: "#e6f4ea", border: "1px solid #81c995",
                                borderRadius: "8px", fontSize: "14px",
                                color: "#137333", fontWeight: "600",
                            }}>
                                ✅ Твоето место е потврдено
                            </div>
                        )}
                    </div>

                    {/* Driver Card */}
                    <div style={{
                        background: theme.card, borderRadius: "16px",
                        border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
                        padding: "20px 24px",
                    }}>
                        <h3 style={{ color: theme.text, fontSize: "15px", fontWeight: "700", margin: "0 0 16px" }}>🧑 Возач</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                            <div style={{
                                width: "52px", height: "52px", borderRadius: "50%",
                                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                color: "white", display: "flex", alignItems: "center",
                                justifyContent: "center", fontWeight: "800", fontSize: "18px",
                            }}>
                                {ride.driverFirstName?.[0]}{ride.driverLastName?.[0]}
                            </div>
                            <div>
                                <div style={{ fontWeight: "700", fontSize: "16px", color: theme.text }}>
                                    {ride.driverFirstName} {ride.driverLastName}
                                </div>
                                <div style={{ fontSize: "13px", color: theme.subtext, marginTop: "2px" }}>
                                    ⭐ {ride.driverRating?.toFixed(1)} рејтинг
                                </div>
                                {ride.driverPhone && (
                                    <div style={{ fontSize: "13px", color: theme.subtext, marginTop: "2px" }}>
                                        📞 {ride.driverPhone}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{
                            padding: "12px 16px", background: theme.badge,
                            borderRadius: "8px", fontSize: "13px", color: theme.subtext,
                            display: "flex", gap: "12px",
                        }}>
                            <span>🚗 {ride.vehicleBrand} {ride.vehicleModel}</span>
                            <span>·</span>
                            <span>{ride.vehicleColor}</span>
                            <span>·</span>
                            <span style={{ fontWeight: "600", color: theme.text }}>{ride.licensePlate}</span>
                        </div>
                    </div>

                    {/* Passengers Card */}
                    <div style={{
                        background: theme.card, borderRadius: "16px",
                        border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
                        overflow: "hidden",
                    }}>
                        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}` }}>
                            <h3 style={{ color: theme.text, fontSize: "15px", fontWeight: "700", margin: 0 }}>
                                👥 Патници ({passengers.length})
                            </h3>
                        </div>
                        {passengers.length === 0 ? (
                            <div style={{ padding: "24px", textAlign: "center", color: theme.subtext, fontSize: "14px" }}>
                                Сè уште нема патници
                            </div>
                        ) : (
                            passengers.map((p, i) => (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", gap: "12px",
                                    padding: "14px 24px", borderBottom: `1px solid ${theme.border}`,
                                }}>
                                    <div style={{
                                        width: "36px", height: "36px", borderRadius: "50%",
                                        background: isDark ? "#3c4043" : "#f1f3f4",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", fontWeight: "700",
                                        fontSize: "13px", color: theme.text,
                                    }}>
                                        {p.passengerFirstName?.[0]}{p.passengerLastName?.[0]}
                                    </div>
                                    <span style={{ fontWeight: "600", fontSize: "14px", color: theme.text }}>
                                        {p.passengerFirstName} {p.passengerLastName}
                                    </span>
                                    <span style={{
                                        marginLeft: "auto", padding: "4px 10px",
                                        borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                                        background: p.status === "CONFIRMED" ? "#e6f4ea" : "#fff8e1",
                                        color: p.status === "CONFIRMED" ? "#137333" : "#f57c00",
                                    }}>
                                        {p.status === "CONFIRMED" ? "✓ Потврден" : "⏳ Чека"}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Map */}
                    {mapCoords.length >= 2 && (
                        <div style={{
                            borderRadius: "16px", overflow: "hidden",
                            border: `1px solid ${theme.border}`,
                            boxShadow: theme.shadow, height: "220px",
                        }}>
                            <MapContainer
                                center={mapCoords[0]} zoom={8}
                                style={{ height: "100%", width: "100%" }}
                                scrollWheelZoom={false}
                            >
                                <TileLayer
                                    url={isDark
                                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                    }
                                />
                                {mapCoords.map((coord, i) => (
                                    <Marker key={i} position={coord}>
                                        <Popup>
                                            {i === 0 ? ride.fromCity :
                                                i === mapCoords.length - 1 ? ride.toCity :
                                                    ride.stops?.[i - 1]}
                                        </Popup>
                                    </Marker>
                                ))}
                                <Polyline positions={mapCoords} color="#dc2626" weight={3} />
                            </MapContainer>
                        </div>
                    )}
                </div>

                {/* Right Column - Chat */}
                <div style={{ width: "360px", flexShrink: 0 }}>
                    <div style={{
                        background: theme.card, borderRadius: "16px",
                        border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
                        display: "flex", flexDirection: "column",
                        height: "600px", position: "sticky", top: "80px",
                        overflow: "hidden",
                    }}>
                        {/* Chat Header */}
                        <div style={{
                            padding: "16px 20px",
                            borderBottom: `1px solid ${theme.border}`,
                            display: "flex", alignItems: "center", gap: "10px",
                        }}>
                            <div style={{
                                width: "36px", height: "36px", borderRadius: "50%",
                                background: "#e8f0fe", display: "flex",
                                alignItems: "center", justifyContent: "center", fontSize: "18px",
                            }}>💬</div>
                            <div>
                                <div style={{ fontWeight: "700", fontSize: "14px", color: theme.text }}>Разговор</div>
                                <div style={{ fontSize: "12px", color: theme.subtext }}>
                                    {canChat ? "Активен" : "Резервирај за да пишуваш"}
                                </div>
                            </div>
                        </div>

                        {!canChat ? (
                            <div style={{
                                flex: 1, display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center",
                                padding: "24px", textAlign: "center",
                            }}>
                                {isPending ? (
                                    <>
                                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>⏳</div>
                                        <p style={{ color: theme.text, fontWeight: "600", margin: "0 0 8px" }}>
                                            Чекаш потврда
                                        </p>
                                        <p style={{ color: theme.subtext, fontSize: "13px", margin: 0 }}>
                                            Ќе можеш да пишуваш кога возачот ќе те потврди
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
                                        <p style={{ color: theme.text, fontWeight: "600", margin: "0 0 8px" }}>
                                            Chat е заклучен
                                        </p>
                                        <p style={{ color: theme.subtext, fontSize: "13px", margin: 0 }}>
                                            Резервирај место за да можеш да пишуваш
                                        </p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    flex: 1, overflowY: "auto", padding: "16px",
                                    display: "flex", flexDirection: "column", gap: "8px",
                                }}>
                                    {messages.length === 0 && (
                                        <div style={{ textAlign: "center", color: theme.subtext, fontSize: "13px", marginTop: "auto" }}>
                                            Започни разговор со возачот и патниците
                                        </div>
                                    )}
                                    {messages.map((msg) => {
                                        const isMe = msg.senderFirstName === user?.firstName &&
                                            msg.senderLastName === user?.lastName;
                                        return (
                                            <div key={msg.id} style={{
                                                display: "flex", flexDirection: "column",
                                                alignItems: isMe ? "flex-end" : "flex-start",
                                            }}>
                                                {!isMe && (
                                                    <span style={{ fontSize: "11px", color: theme.subtext, marginBottom: "2px", paddingLeft: "8px" }}>
                                                        {msg.senderFirstName}
                                                    </span>
                                                )}
                                                <div style={{
                                                    maxWidth: "80%", padding: "10px 14px",
                                                    borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                                    background: isMe ? "#dc2626" : theme.badge,
                                                    color: isMe ? "white" : theme.text,
                                                    fontSize: "14px", lineHeight: 1.4,
                                                }}>
                                                    {msg.content}
                                                </div>
                                                <span style={{ fontSize: "10px", color: theme.subtext, marginTop: "2px", paddingLeft: isMe ? 0 : "8px", paddingRight: isMe ? "8px" : 0 }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString("mk-MK", { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} style={{
                                    padding: "12px 16px",
                                    borderTop: `1px solid ${theme.border}`,
                                    display: "flex", gap: "8px",
                                }}>
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Напиши порака..."
                                        style={{
                                            flex: 1, padding: "10px 14px",
                                            border: `1.5px solid ${theme.inputBorder}`,
                                            borderRadius: "20px", fontSize: "14px",
                                            background: theme.input, color: theme.inputText,
                                            outline: "none",
                                        }}
                                    />
                                    <button type="submit" style={{
                                        width: "38px", height: "38px", borderRadius: "50%",
                                        background: "#dc2626", color: "white",
                                        border: "none", cursor: "pointer", fontSize: "16px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                    }}>➤</button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}