import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {useTheme} from "../context/ThemeContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Logo from "../components/Logo";
import { GoogleLogin } from '@react-oauth/google';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const MK_CITIES = [
    { name: "Скопје", pos: [41.9981, 21.4254] },
    { name: "Битола", pos: [41.0297, 21.3294] },
    { name: "Охрид", pos: [41.1172, 20.8016] },
    { name: "Тетово", pos: [41.9094, 20.9716] },
    { name: "Штип", pos: [41.7458, 22.1903] },
    { name: "Прилеп", pos: [41.3453, 21.5544] },
    { name: "Куманово", pos: [42.1322, 21.7144] },
    { name: "Велес", pos: [41.7153, 21.7756] },
    { name: "Струмица", pos: [41.4378, 22.6430] },
    { name: "Гевгелија", pos: [41.1394, 22.5019] },
];

const RED = "#dc2626";
const RED_DARK = "#b91c1c";
const RED_LIGHT = "#fef2f2";
const RED_BORDER = "#fca5a5";

export default function Login() {
    const { login } = useAuth();
    const { theme, isDark, setIsDark } = useTheme();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login(form.email, form.password);
            navigate("/");
        } catch {
            setError("Погрешна е-пошта или лозинка!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", background: theme.bg }}>
            {/* Left Side - Map */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <MapContainer
                        center={[41.6, 21.7]}
                        zoom={8}
                        style={{ height: "100%", width: "100%" }}
                        zoomControl={false}
                        scrollWheelZoom={false}
                        dragging={false}
                        doubleClickZoom={false}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution="© OpenStreetMap © CARTO"
                        />
                        {MK_CITIES.map((city) => (
                            <Marker key={city.name} position={city.pos}>
                                <Popup>{city.name}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Gradient overlay */}
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 500, pointerEvents: "none",
                        background: isDark
                            ? "rgba(0,0,0,0.5)"
                            : "rgba(0,0,0,0.2)",
                    }} />

                    {/* Content overlay */}
                    <div style={{
                        position: "absolute", inset: 0, zIndex: 600,
                        display: "flex", flexDirection: "column",
                        padding: "32px", pointerEvents: "none",
                    }}>
                        <div style={{ pointerEvents: "all" }}>
                            <Logo size="md" white={true} />
                        </div>

                        <div style={{ marginTop: "auto", paddingBottom: "32px" }}>
                            <h2 style={{
                                color: "white", fontSize: "32px", fontWeight: "800",
                                margin: "0 0 12px", textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            }}>
                                {"Патувај низ Македонија 🇲🇰"}
                            </h2>
                            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px", margin: "0 0 24px" }}>
                                {"Поврзи се со возачи и патници на секоја рута"}
                            </p>
                            <div style={{ display: "flex", gap: "16px" }}>
                                {[["1000+", "Корисници"], ["500+","Патувања"], ["50+", "Градови"]].map(([val, label]) => (
                                    <div key={label} style={{
                                        background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)",
                                        padding: "12px 20px", borderRadius: "12px", textAlign: "center",
                                    }}>
                                        <div style={{ color: "white", fontSize: "22px", fontWeight: "800" }}>{val}</div>
                                        <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px" }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div style={{
                width: "480px", display: "flex", flexDirection: "column",
                justifyContent: "center", padding: "48px",
                background: theme.card, position: "relative",
            }}>
                {/* Theme & Lang toggles */}
                <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "8px" }}>
                    <button onClick={() => setIsDark(!isDark)} style={{
                        background: theme.input, border: `1px solid ${theme.border}`,
                        width: "34px", height: "34px", borderRadius: "8px",
                        cursor: "pointer", fontSize: "16px",
                    }}>{isDark ? "☀️" : "🌙"}</button>
                </div>

                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "800", color: theme.text, margin: "0 0 8px" }}>
                        {"Добредојде 👋"}
                    </h1>
                    <p style={{ color: theme.subtext, fontSize: "15px", margin: 0 }}>
                        {"Најави се во твојата сметка"}
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: RED_LIGHT, border: `1px solid ${RED_BORDER}`,
                        borderRadius: "10px", padding: "12px 16px",
                        color: RED_DARK, fontSize: "14px", marginBottom: "20px",
                        display: "flex", alignItems: "center", gap: "8px",
                    }}>⚠️ {error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{
                            display: "block", fontSize: "12px", fontWeight: "700",
                            color: theme.subtext, marginBottom: "6px", letterSpacing: "0.5px",
                        }}>{"Е-ПОШТА"}</label>
                        <div style={{
                            display: "flex", alignItems: "center",
                            border: `1.5px solid ${theme.border}`, borderRadius: "10px",
                            background: theme.input, overflow: "hidden",
                        }}>
                            <span style={{ padding: "0 12px", fontSize: "18px" }}>✉️</span>
                            <input
                                type="email"
                                placeholder="ime@primer.com"
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                required
                                style={{
                                    flex: 1, padding: "14px 12px 14px 0",
                                    border: "none", outline: "none",
                                    fontSize: "15px", background: "transparent", color: theme.text,
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block", fontSize: "12px", fontWeight: "700",
                            color: theme.subtext, marginBottom: "6px", letterSpacing: "0.5px",
                        }}>{"ЛОЗИНКА"}</label>
                        <div style={{
                            display: "flex", alignItems: "center",
                            border: `1.5px solid ${theme.border}`, borderRadius: "10px",
                            background: theme.input, overflow: "hidden",
                        }}>
                            <span style={{ padding: "0 12px", fontSize: "18px" }}>🔒</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required
                                style={{
                                    flex: 1, padding: "14px 0",
                                    border: "none", outline: "none",
                                    fontSize: "15px", background: "transparent", color: theme.text,
                                }}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    style={{ background: "none", border: "none", padding: "0 14px", cursor: "pointer", fontSize: "18px" }}>
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{
                        width: "100%", padding: "15px",
                        background: loading ? "#ccc" : `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
                        color: "white", border: "none", borderRadius: "10px",
                        fontSize: "16px", fontWeight: "700",
                        cursor: loading ? "not-allowed" : "pointer",
                        boxShadow: loading ? "none" : `0 4px 15px rgba(220,38,38,0.4)`,
                    }}>
                        {loading ? "Се најавува..." : "Најави се →"}
                    </button>
                </form>

                <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ flex: 1, height: "1px", background: theme.border }} />
                    <span style={{ color: theme.subtext, fontSize: "13px" }}>{"или"}</span>
                    <div style={{ flex: 1, height: "1px", background: theme.border }} />
                </div>

                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    borderRadius: "8px",
                    overflow: "hidden",
                }}>
                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            try {
                                const res = await api.post("/auth/google", {
                                    credential: credentialResponse.credential
                                });
                                localStorage.setItem("token", res.data.token);
                                localStorage.setItem("user", JSON.stringify(res.data));
                                window.location.href = "/";
                            } catch {
                                setError("Грешка при Google логин!");
                            }
                        }}
                        onError={() => setError("Google логинот не успеа!")}
                        width="400"
                        text="continue_with"
                        shape="rectangular"
                        theme={isDark ? "filled_black" : "outline"}
                    />
                </div>

                <p style={{ textAlign: "center", marginTop: "24px", color: theme.subtext, fontSize: "14px" }}>
                    {"Немаш сметка?"}{" "}
                    <Link to="/register" style={{ color: RED, fontWeight: "700", textDecoration: "none" }}>
                        {"Регистрирај се бесплатно"}
                    </Link>
                </p>
            </div>
        </div>
    );
}