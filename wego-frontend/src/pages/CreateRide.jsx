import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function CreateRide() {
    const { theme, isDark } = useTheme();
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [form, setForm] = useState({
        vehicleId: "", fromCity: "", toCity: "",
        departureTime: "", pricePerPerson: "",
        totalSeats: "", notes: "", stops: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/vehicles/my").then((res) => {
            setVehicles(res.data);
            if (res.data.length === 0) navigate("/add-vehicle");
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/rides", {
                ...form,
                vehicleId: parseInt(form.vehicleId),
                pricePerPerson: parseInt(form.pricePerPerson),
                totalSeats: parseInt(form.totalSeats),
                stops: form.stops ? form.stops.split(",").map((s) => s.trim()) : [],
            });
            navigate("/my-rides");
        } catch {
            setError("Грешка при креирање патување!");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%", padding: "13px 16px",
        border: `1.5px solid ${theme.inputBorder}`,
        borderRadius: "8px", fontSize: "15px",
        background: theme.input, color: theme.inputText,
        outline: "none", boxSizing: "border-box",
    };

    const labelStyle = {
        display: "block", fontSize: "12px", fontWeight: "600",
        color: theme.subtext, marginBottom: "6px", letterSpacing: "0.3px",
    };

    return (
        <div style={{ minHeight: "100vh", background: theme.bg }}>
            <Navbar />
            <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 24px" }}>
                <div style={{ marginBottom: "28px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: "700", color: theme.text, margin: "0 0 4px" }}>
                        Објави возење
                    </h1>
                    <p style={{ color: theme.subtext, fontSize: "14px", margin: 0 }}>
                        Пополни ги деталите за твоето патување
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: "#fef2f2", border: "1px solid #fca5a5",
                        borderRadius: "8px", padding: "12px 14px",
                        color: "#dc2626", fontSize: "13px", marginBottom: "20px",
                    }}>⚠️ {error}</div>
                )}

                <div style={{
                    background: theme.card, borderRadius: "16px",
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.shadow, padding: "28px",
                }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={labelStyle}>ВОЗИЛО</label>
                            <select style={inputStyle} value={form.vehicleId}
                                    onChange={(e) => setForm({...form, vehicleId: e.target.value})} required>
                                <option value="">Избери возило</option>
                                {vehicles.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.brand} {v.model} — {v.licensePlate}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>ОД</label>
                                <input style={inputStyle} placeholder="Скопје"
                                       value={form.fromCity}
                                       onChange={(e) => setForm({...form, fromCity: e.target.value})}
                                       required />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>ДО</label>
                                <input style={inputStyle} placeholder="Охрид"
                                       value={form.toCity}
                                       onChange={(e) => setForm({...form, toCity: e.target.value})}
                                       required />
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={labelStyle}>ДАТУМ И ВРЕМЕ</label>
                            <input style={inputStyle} type="datetime-local"
                                   value={form.departureTime}
                                   onChange={(e) => setForm({...form, departureTime: e.target.value})}
                                   required />
                        </div>

                        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>ЦЕНА (ден)</label>
                                <input style={inputStyle} type="number" placeholder="400"
                                       value={form.pricePerPerson}
                                       onChange={(e) => setForm({...form, pricePerPerson: e.target.value})}
                                       required />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>МЕСТА</label>
                                <input style={inputStyle} type="number" placeholder="3"
                                       value={form.totalSeats}
                                       onChange={(e) => setForm({...form, totalSeats: e.target.value})}
                                       required />
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <label style={labelStyle}>ПОСТАНКИ (одделени со запирка)</label>
                            <input style={inputStyle} placeholder="Велес, Прилеп"
                                   value={form.stops}
                                   onChange={(e) => setForm({...form, stops: e.target.value})} />
                        </div>

                        <div style={{ marginBottom: "28px" }}>
                            <label style={labelStyle}>НАПОМЕНА</label>
                            <textarea style={{...inputStyle, minHeight: "80px", resize: "vertical"}}
                                      placeholder="Без пушење, миленичиња дозволени..."
                                      value={form.notes}
                                      onChange={(e) => setForm({...form, notes: e.target.value})} />
                        </div>

                        <button type="submit" disabled={loading} style={{
                            width: "100%", padding: "14px",
                            background: loading ? theme.border : "#dc2626",
                            color: "white", border: "none", borderRadius: "8px",
                            fontSize: "15px", fontWeight: "700",
                            cursor: loading ? "not-allowed" : "pointer",
                            boxShadow: loading ? "none" : "0 2px 8px rgba(220,38,38,0.3)",
                        }}>
                            {loading ? "Се објавува..." : "Објави возење →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}