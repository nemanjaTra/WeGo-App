import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { isDark, setIsDark, theme } = useTheme();

    return (
        <nav style={{
            background: theme.nav,
            borderBottom: `1px solid ${theme.border}`,
            position: "sticky", top: 0, zIndex: 1000,
        }}>
            <div style={{
                maxWidth: "1200px", margin: "0 auto",
                padding: "0 24px", height: "64px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <Logo size="md" />

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {user ? (
                        <>
                            {(user.role === "DRIVER" || user.role === "BOTH") && (
                                <Link to="/create-ride" style={{
                                    background: "#dc2626", color: "white",
                                    padding: "10px 20px", borderRadius: "8px",
                                    textDecoration: "none", fontWeight: "700",
                                    fontSize: "14px",
                                }}>+ Додај возење</Link>
                            )}
                            <Link to="/my-rides" style={{
                                color: theme.text, textDecoration: "none",
                                padding: "8px 14px", borderRadius: "8px",
                                fontSize: "14px", fontWeight: "500",
                            }}>Мои возења</Link>
                            <Link to="/my-reservations" style={{
                                color: theme.text, textDecoration: "none",
                                padding: "8px 14px", borderRadius: "8px",
                                fontSize: "14px", fontWeight: "500",
                            }}>Резервации</Link>
                            <Link to="/profile" style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                textDecoration: "none",
                                padding: "6px 14px", borderRadius: "8px",
                                border: `1px solid ${theme.border}`,
                                background: theme.card,
                            }}>
                                <div style={{
                                    width: "28px", height: "28px", borderRadius: "50%",
                                    background: "#dc2626", color: "white",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", fontWeight: "700", fontSize: "12px",
                                }}>{user.firstName?.[0]}</div>
                                <span style={{ color: theme.text, fontSize: "14px", fontWeight: "600" }}>
                                    {user.firstName}
                                </span>
                            </Link>
                            <button onClick={logout} style={{
                                background: "none", border: `1px solid ${theme.border}`,
                                padding: "8px 14px", borderRadius: "8px",
                                cursor: "pointer", color: theme.subtext, fontSize: "14px",
                            }}>Одјави се</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{
                                color: theme.text, textDecoration: "none",
                                padding: "8px 14px", borderRadius: "8px",
                                fontSize: "14px", fontWeight: "600",
                            }}>Најави се</Link>
                            <Link to="/register" style={{
                                background: "#dc2626", color: "white",
                                padding: "10px 20px", borderRadius: "8px",
                                textDecoration: "none", fontWeight: "700", fontSize: "14px",
                            }}>Регистрирај се</Link>
                        </>
                    )}
                    <button onClick={() => setIsDark(!isDark)} style={{
                        background: theme.card, border: `1px solid ${theme.border}`,
                        width: "38px", height: "38px", borderRadius: "8px",
                        cursor: "pointer", fontSize: "16px",
                    }}>{isDark ? "☀️" : "🌙"}</button>
                </div>
            </div>
        </nav>
    );
}