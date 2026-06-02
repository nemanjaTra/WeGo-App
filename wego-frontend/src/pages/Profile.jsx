import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function Profile() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        api.get("/users/me").then((res) => setProfile(res.data));
    }, []);

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await api.post("/users/upload-photo", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setProfile({...profile, profilePicture: res.data.profilePicture});
            setSuccess("Сликата е успешно ажурирана!");
            setTimeout(() => setSuccess(""), 3000);
        } catch {
            alert("Грешка при качување!");
        } finally {
            setUploading(false);
        }
    };

    if (!profile) return (
        <div style={{ minHeight: "100vh", background: theme.bg }}>
            <Navbar />
            <div style={{ textAlign: "center", padding: "80px", color: theme.subtext }}>Се вчитува...</div>
        </div>
    );

    const roleLabel = profile.role === "DRIVER" ? "🚗 Возач" : profile.role === "PASSENGER" ? "🧑 Патник" : "🚗🧑 Возач и Патник";

    return (
        <div style={{ minHeight: "100vh", background: theme.bg }}>
            <Navbar />
            <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 24px" }}>

                {/* Profile Header */}
                <div style={{
                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                    borderRadius: "16px", padding: "32px",
                    marginBottom: "16px", position: "relative", overflow: "hidden",
                }}>
                    <div style={{
                        position: "absolute", top: "-20px", right: "-20px",
                        width: "120px", height: "120px", borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                    }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                        <div style={{ position: "relative" }}>
                            {profile.profilePicture ? (
                                <img
                                    src={`http://localhost:8080${profile.profilePicture}`}
                                    alt="profile"
                                    style={{
                                        width: "80px", height: "80px", borderRadius: "50%",
                                        objectFit: "cover", border: "3px solid rgba(255,255,255,0.5)",
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: "80px", height: "80px", borderRadius: "50%",
                                    background: "rgba(255,255,255,0.2)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "28px", fontWeight: "800", color: "white",
                                    border: "3px solid rgba(255,255,255,0.4)",
                                }}>
                                    {profile.firstName?.[0]}{profile.lastName?.[0]}
                                </div>
                            )}
                            <label style={{
                                position: "absolute", bottom: "0", right: "0",
                                background: "white", borderRadius: "50%",
                                width: "26px", height: "26px",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", fontSize: "13px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                            }}>
                                📷
                                <input type="file" accept="image/*"
                                       onChange={handlePhotoUpload} style={{ display: "none" }} />
                            </label>
                        </div>
                        <div>
                            <h2 style={{ color: "white", fontSize: "22px", fontWeight: "800", margin: "0 0 4px" }}>
                                {profile.firstName} {profile.lastName}
                            </h2>
                            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: "0 0 12px" }}>
                                {roleLabel}
                            </p>
                            <div style={{ display: "flex", gap: "20px" }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ color: "white", fontSize: "18px", fontWeight: "800" }}>
                                        ⭐ {profile.rating?.toFixed(1)}
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}>Рејтинг</div>
                                </div>
                                <div style={{ width: "1px", background: "rgba(255,255,255,0.3)" }} />
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ color: "white", fontSize: "18px", fontWeight: "800" }}>
                                        {profile.totalRides}
                                    </div>
                                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px" }}>Патувања</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {uploading && <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "12px", fontSize: "13px" }}>Се качува...</p>}
                    {success && <p style={{ color: "white", marginTop: "12px", fontSize: "13px", fontWeight: "600" }}>✓ {success}</p>}
                </div>

                {/* Info Card */}
                <div style={{
                    background: theme.card, borderRadius: "16px",
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.shadow, marginBottom: "16px",
                }}>
                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}` }}>
                        <h3 style={{ color: theme.text, fontSize: "15px", fontWeight: "700", margin: 0 }}>
                            Информации
                        </h3>
                    </div>
                    {[
                        ["✉️ Е-пошта", profile.email],
                        ["📞 Телефон", profile.phone || "Не е додадено"],
                    ].map(([label, value]) => (
                        <div key={label} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "16px 24px", borderBottom: `1px solid ${theme.border}`,
                        }}>
                            <span style={{ color: theme.subtext, fontSize: "14px" }}>{label}</span>
                            <span style={{ color: theme.text, fontSize: "14px", fontWeight: "500" }}>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Quick Links */}
                <div style={{
                    background: theme.card, borderRadius: "16px",
                    border: `1px solid ${theme.border}`, boxShadow: theme.shadow,
                }}>
                    <div style={{ padding: "20px 24px", borderBottom: `1px solid ${theme.border}` }}>
                        <h3 style={{ color: theme.text, fontSize: "15px", fontWeight: "700", margin: 0 }}>Брзи врски</h3>
                    </div>
                    {[
                        ["/my-rides", "🚗", "Мои возења"],
                        ["/my-reservations", "🎫", "Мои резервации"],
                        ["/create-ride", "➕", "Додади возење"],
                        ["/add-vehicle", "🚘", "Додади возило"],
                    ].map(([to, icon, label]) => (
                        <Link key={to} to={to} style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", padding: "16px 24px",
                            borderBottom: `1px solid ${theme.border}`,
                            textDecoration: "none",
                        }}>
                            <span style={{ color: theme.text, fontSize: "14px", fontWeight: "500" }}>
                                {icon} {label}
                            </span>
                            <span style={{ color: theme.subtext }}>→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}