import { Link } from "react-router-dom";

const RED = "#dc2626";
const RED_DARK = "#b91c1c";

export default function Logo({ size = "md", white = false }) {
    const sizes = {
        sm: { container: 32, font: 18, icon: 14 },
        md: { container: 40, font: 22, icon: 17 },
        lg: { container: 52, font: 28, icon: 22 },
    };
    const s = sizes[size];

    return (
        <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            <div style={{
                width: s.container, height: s.container,
                borderRadius: "12px",
                background: white
                    ? "rgba(255,255,255,0.2)"
                    : `linear-gradient(135deg, ${RED} 0%, ${RED_DARK} 100%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: white ? "none" : `0 4px 12px rgba(220,38,38,0.35)`,
                backdropFilter: white ? "blur(10px)" : "none",
                flexShrink: 0,
            }}>
                <svg width={s.icon + 4} height={s.icon + 4} viewBox="0 0 24 24" fill="none">
                    <circle cx="5" cy="17" r="2.5" fill="white"/>
                    <circle cx="19" cy="17" r="2.5" fill="white"/>
                    <path d="M2 17h1.5M7.5 17h9M21.5 17H23" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M3 17V13l3-5h8l3 5v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 13h9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </div>
            <span style={{
                fontSize: s.font, fontWeight: "800", letterSpacing: "-0.5px",
                background: white ? "none" : `linear-gradient(135deg, ${RED}, ${RED_DARK})`,
                WebkitBackgroundClip: white ? "none" : "text",
                WebkitTextFillColor: white ? "white" : "transparent",
                color: white ? "white" : undefined,
            }}>WeGo</span>
        </Link>
    );
}