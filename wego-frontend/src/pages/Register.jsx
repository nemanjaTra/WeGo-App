import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";
import Logo from "../components/Logo";
import { GoogleLogin } from '@react-oauth/google';

export default function Register() {
    const { register } = useAuth();
    const { theme, isDark, setIsDark } = useTheme();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "",
        password: "", phone: "", role: "PASSENGER",
        verificationCode: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await api.post("/auth/send-code", { email: form.email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data || "Грешка при испраќање на код!");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await register(form);
            navigate("/");
        } catch (err) {
            setError(err.response?.data || "Грешка при регистрација!");
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
        transition: "border-color 0.2s",
    };

    const labelStyle = {
        display: "block", fontSize: "12px", fontWeight: "600",
        color: theme.subtext, marginBottom: "6px", letterSpacing: "0.3px",
    };

    return (
        <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", flexDirection: "column" }}>
            {/* Top bar */}
            <div style={{
                padding: "16px 24px", display: "flex",
                justifyContent: "space-between", alignItems: "center",
                borderBottom: `1px solid ${theme.border}`,
                background: theme.card,
            }}>
                <Logo size="md" />
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ color: theme.subtext, fontSize: "14px" }}>
                        Веќе имаш сметка?
                    </span>
                    <Link to="/login" style={{
                        color: "#dc2626", fontWeight: "700",
                        textDecoration: "none", fontSize: "14px",
                    }}>Најави се</Link>
                    <button onClick={() => setIsDark(!isDark)} style={{
                        background: theme.badge, border: `1px solid ${theme.border}`,
                        width: "34px", height: "34px", borderRadius: "8px",
                        cursor: "pointer", fontSize: "15px",
                    }}>{isDark ? "☀️" : "🌙"}</button>
                </div>
            </div>

            <div style={{
                flex: 1, display: "flex",
                alignItems: "center", justifyContent: "center",
                padding: "40px 24px",
            }}>
                <div style={{
                    width: "100%", maxWidth: "480px",
                    background: theme.card, borderRadius: "16px",
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.shadow, padding: "40px",
                }}>
                    {/* Steps indicator */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "32px" }}>
                        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                            <div style={{
                                width: "28px", height: "28px", borderRadius: "50%",
                                background: "#dc2626", color: "white",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "13px", fontWeight: "700", flexShrink: 0,
                            }}>1</div>
                            <div style={{ flex: 1, height: "2px", background: step === 2 ? "#dc2626" : theme.border, margin: "0 8px" }} />
                            <div style={{
                                width: "28px", height: "28px", borderRadius: "50%",
                                background: step === 2 ? "#dc2626" : theme.badge,
                                color: step === 2 ? "white" : theme.subtext,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "13px", fontWeight: "700", flexShrink: 0,
                            }}>2</div>
                        </div>
                        <span style={{ color: theme.subtext, fontSize: "13px", marginLeft: "16px" }}>
                            {step === 1 ? "Основни податоци" : "Верификација"}
                        </span>
                    </div>

                    <h1 style={{ fontSize: "24px", fontWeight: "700", color: theme.text, margin: "0 0 8px" }}>
                        {step === 1 ? "Креирај сметка" : "Потврди е-пошта"}
                    </h1>
                    <p style={{ color: theme.subtext, fontSize: "14px", margin: "0 0 28px" }}>
                        {step === 1
                            ? "Приклучи се на WeGo бесплатно"
                            : `Испративме код на ${form.email}`}
                    </p>

                    {error && (
                        <div style={{
                            background: "#fef2f2", border: "1px solid #fca5a5",
                            borderRadius: "8px", padding: "12px 14px",
                            color: "#dc2626", fontSize: "13px", marginBottom: "20px",
                        }}>⚠️ {error}</div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleSendCode}>
                            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>ИМЕ</label>
                                    <input style={inputStyle} placeholder="Александар"
                                           value={form.firstName}
                                           onChange={(e) => setForm({...form, firstName: e.target.value})}
                                           required />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>ПРЕЗИМЕ</label>
                                    <input style={inputStyle} placeholder="Петровски"
                                           value={form.lastName}
                                           onChange={(e) => setForm({...form, lastName: e.target.value})}
                                           required />
                                </div>
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={labelStyle}>Е-ПОШТА</label>
                                <input style={inputStyle} type="email" placeholder="ime@primer.com"
                                       value={form.email}
                                       onChange={(e) => setForm({...form, email: e.target.value})}
                                       required />
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={labelStyle}>ЛОЗИНКА</label>
                                <div style={{ position: "relative" }}>
                                    <input
                                        style={{...inputStyle, paddingRight: "48px"}}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Минимум 8 карактери"
                                        value={form.password}
                                        onChange={(e) => setForm({...form, password: e.target.value})}
                                        required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: "absolute", right: "12px", top: "50%",
                                                transform: "translateY(-50%)", background: "none",
                                                border: "none", cursor: "pointer", fontSize: "17px",
                                            }}>{showPassword ? "🙈" : "👁️"}</button>
                                </div>
                            </div>

                            <div style={{ marginBottom: "16px" }}>
                                <label style={labelStyle}>ТЕЛЕФОН</label>
                                <input style={inputStyle} placeholder="07X XXX XXX"
                                       value={form.phone}
                                       onChange={(e) => setForm({...form, phone: e.target.value})} />
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={labelStyle}>УЛОГА</label>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    {[["PASSENGER", "🧑 Патник"], ["DRIVER", "🚗 Возач"], ["BOTH", "🚗🧑 Двете"]].map(([val, label]) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => setForm({...form, role: val})}
                                            style={{
                                                flex: 1, padding: "10px 8px",
                                                borderRadius: "8px", fontSize: "13px", fontWeight: "600",
                                                cursor: "pointer", transition: "all 0.15s",
                                                border: form.role === val ? "2px solid #dc2626" : `1.5px solid ${theme.border}`,
                                                background: form.role === val ? "#fef2f2" : theme.input,
                                                color: form.role === val ? "#dc2626" : theme.text,
                                            }}
                                        >{label}</button>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" disabled={loading} style={{
                                width: "100%", padding: "14px",
                                background: loading ? theme.border : "#dc2626",
                                color: "white", border: "none", borderRadius: "8px",
                                fontSize: "15px", fontWeight: "700",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: loading ? "none" : "0 2px 8px rgba(220,38,38,0.3)",
                            }}>
                                {loading ? "Се испраќа код..." : "Испрати верификациски код →"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleRegister}>
                            <div style={{
                                background: isDark ? "#2d2a1e" : "#fffde7",
                                border: `1px solid ${isDark ? "#5f5a30" : "#f9a825"}`,
                                borderRadius: "8px", padding: "14px 16px",
                                marginBottom: "24px", fontSize: "14px", color: theme.text,
                            }}>
                                📧 Провери ја е-поштата <strong>{form.email}</strong> и внеси го кодот
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={labelStyle}>ВЕРИФИКАЦИСКИ КОД</label>
                                <input
                                    style={{
                                        ...inputStyle,
                                        textAlign: "center", fontSize: "28px",
                                        letterSpacing: "12px", fontWeight: "700",
                                        padding: "16px",
                                    }}
                                    placeholder="000000"
                                    maxLength={6}
                                    value={form.verificationCode}
                                    onChange={(e) => setForm({...form, verificationCode: e.target.value})}
                                    required />
                            </div>

                            <button type="submit" disabled={loading} style={{
                                width: "100%", padding: "14px",
                                background: loading ? theme.border : "#dc2626",
                                color: "white", border: "none", borderRadius: "8px",
                                fontSize: "15px", fontWeight: "700",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: loading ? "none" : "0 2px 8px rgba(220,38,38,0.3)",
                                marginBottom: "12px",
                            }}>
                                {loading ? "Се регистрира..." : "Потврди и регистрирај се ✓"}
                            </button>

                            <button type="button" onClick={() => setStep(1)} style={{
                                width: "100%", padding: "12px",
                                background: "none", border: `1px solid ${theme.border}`,
                                borderRadius: "8px", fontSize: "14px",
                                cursor: "pointer", color: theme.subtext,
                            }}>← Назад</button>
                        </form>
                    )}

                    <div style={{ margin: "24px 0", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ flex: 1, height: "1px", background: theme.border }} />
                        <span style={{ color: theme.subtext, fontSize: "13px" }}>или</span>
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
                                    alert("Грешка при Google логин!");
                                }
                            }}
                            onError={() => alert("Google логинот не успеа!")}
                            width="400"
                            text="signup_with"
                            shape="rectangular"
                            theme={isDark ? "filled_black" : "outline"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}