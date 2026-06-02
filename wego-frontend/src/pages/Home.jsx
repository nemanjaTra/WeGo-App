import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";
import api from "../api/axios";


export function Home() {
    const {theme, isDark} = useTheme();
    const navigate = useNavigate();
    const [search, setSearch] = useState({fromCity: "", toCity: ""});
    const [rides, setRides] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get("/rides/search", { params: { fromCity: "", toCity: "" } })
            .then((res) => {
                setRides(res.data);
                setSearched(true);
            })
            .catch(() => {});
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.get("/rides/search", {params: search});
            setRides(res.data);
            setSearched(true);
        } catch {
            setRides([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{minHeight: "100vh", background: theme.bg, fontFamily: "'Google Sans', Roboto, sans-serif"}}>
            <Navbar/>

            {/* Hero */}
            <div style={{
                background: isDark
                    ? "linear-gradient(180deg, #2d2a1e 0%, #121212 100%)"
                    : "linear-gradient(180deg, #fffde7 0%, #fff9c4 100%)",
                padding: "64px 24px 48px",
                borderBottom: `1px solid ${theme.border}`,
            }}>
                <div style={{maxWidth: "720px", margin: "0 auto", textAlign: "center"}}>
                    <h1 style={{
                        fontSize: "44px", fontWeight: "700", color: theme.text,
                        margin: "0 0 12px", letterSpacing: "-0.5px", lineHeight: 1.2,
                    }}>
                        Патувај низ Македонија
                    </h1>
                    <p style={{
                        fontSize: "16px", color: theme.subtext,
                        margin: "0 0 40px", lineHeight: 1.6,
                    }}>
                        Поврзи се со возачи и патници — евтино, лесно и безбедно
                    </p>

                    {/* Search Card */}
                    <div style={{
                        background: theme.card,
                        borderRadius: "24px",
                        boxShadow: isDark
                            ? "0 4px 24px rgba(0,0,0,0.5)"
                            : "0 4px 24px rgba(32,33,36,0.15), 0 1px 6px rgba(32,33,36,0.1)",
                        border: `1px solid ${theme.border}`,
                        overflow: "hidden",
                    }}>
                        <form onSubmit={handleSearch}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div style={{
                                    flex: 1, display: "flex", alignItems: "center",
                                    padding: "4px 20px",
                                    borderRight: `1px solid ${theme.border}`,
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         style={{marginRight: "12px", flexShrink: 0}}>
                                        <circle cx="12" cy="10" r="3" stroke="#dc2626" strokeWidth="2"/>
                                        <path
                                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                            stroke="#dc2626" strokeWidth="2" fill="none"/>
                                    </svg>
                                    <input
                                        placeholder="Од каде патуваш?"
                                        value={search.fromCity}
                                        onChange={(e) => setSearch({...search, fromCity: e.target.value})}
                                        required
                                        style={{
                                            flex: 1, padding: "18px 0", border: "none",
                                            outline: "none", fontSize: "15px", fontWeight: "500",
                                            color: theme.inputText, background: "transparent",
                                        }}
                                    />
                                </div>
                                <div style={{
                                    flex: 1, display: "flex", alignItems: "center",
                                    padding: "4px 20px",
                                }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         style={{marginRight: "12px", flexShrink: 0}}>
                                        <rect x="9" y="9" width="6" height="6" rx="1" fill="#dc2626"/>
                                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#dc2626" strokeWidth="2"
                                              strokeLinecap="round"/>
                                    </svg>
                                    <input
                                        placeholder="До каде патуваш?"
                                        value={search.toCity}
                                        onChange={(e) => setSearch({...search, toCity: e.target.value})}
                                        required
                                        style={{
                                            flex: 1, padding: "18px 0", border: "none",
                                            outline: "none", fontSize: "15px", fontWeight: "500",
                                            color: theme.inputText, background: "transparent",
                                        }}
                                    />
                                </div>
                                <div style={{padding: "8px"}}>
                                    <button type="submit" disabled={loading} style={{
                                        background: "#dc2626", color: "white",
                                        border: "none", padding: "14px 28px",
                                        borderRadius: "16px", fontSize: "15px",
                                        fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
                                        boxShadow: "0 2px 8px rgba(220,38,38,0.3)",
                                        transition: "all 0.2s",
                                    }}>
                                        {loading ? "..." : "Пребарај"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: "flex", justifyContent: "center",
                        gap: "40px", marginTop: "32px",
                    }}>
                        {[["1000+", "Корисници"], ["500+", "Патувања"], ["50+", "Градови"]].map(([val, label]) => (
                            <div key={label} style={{textAlign: "center"}}>
                                <div style={{color: "#dc2626", fontSize: "20px", fontWeight: "700"}}>{val}</div>
                                <div style={{color: theme.subtext, fontSize: "13px", marginTop: "2px"}}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div style={{maxWidth: "720px", margin: "32px auto", padding: "0 24px"}}>
                {searched && rides.length === 0 && (
                    <div style={{
                        textAlign: "center", padding: "80px 0",
                        background: theme.card, borderRadius: "16px",
                        border: `1px solid ${theme.border}`,
                    }}>
                        <div style={{fontSize: "48px", marginBottom: "16px"}}>🔍</div>
                        <h3 style={{color: theme.text, fontSize: "18px", fontWeight: "600", margin: "0 0 8px"}}>
                            Нема пронајдени патувања
                        </h3>
                        <p style={{color: theme.subtext, margin: 0, fontSize: "14px"}}>
                            Обиди се со друга рута или датум
                        </p>
                    </div>
                )}

                {rides.length > 0 && (
                    <h2 style={{
                        color: theme.text, fontSize: "16px", fontWeight: "600",
                        margin: "0 0 16px", color: theme.subtext,
                    }}>
                        {rides.length} патувања пронајдени
                    </h2>
                )}

                <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                    {rides.map((ride) => (
                        <div
                            key={ride.id}
                            onClick={() => navigate(`/rides/${ride.id}`)}
                            style={{
                                background: theme.card,
                                border: `1px solid ${theme.border}`,
                                borderRadius: "16px",
                                padding: "20px 24px",
                                cursor: "pointer",
                                boxShadow: theme.shadow,
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = theme.shadowHover;
                                e.currentTarget.style.borderColor = "#dc2626";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = theme.shadow;
                                e.currentTarget.style.borderColor = theme.border;
                            }}
                        >
                            {/* Route Row */}
                            <div style={{
                                display: "flex", alignItems: "center",
                                justifyContent: "space-between", marginBottom: "16px",
                            }}>
                                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                    <span style={{fontSize: "18px", fontWeight: "700", color: theme.text}}>
                                        {ride.fromCity}
                                    </span>
                                    <div style={{display: "flex", alignItems: "center", gap: "3px"}}>
                                        <div style={{
                                            width: "5px",
                                            height: "5px",
                                            borderRadius: "50%",
                                            background: "#dc2626"
                                        }}/>
                                        <div style={{
                                            width: "36px",
                                            height: "2px",
                                            background: `linear-gradient(90deg, #dc2626, #dc2626)`,
                                            borderRadius: "1px"
                                        }}/>
                                        <div style={{
                                            width: "5px",
                                            height: "5px",
                                            background: "#dc2626",
                                            transform: "rotate(45deg)"
                                        }}/>
                                    </div>
                                    <span style={{fontSize: "18px", fontWeight: "700", color: theme.text}}>
                                        {ride.toCity}
                                    </span>
                                </div>
                                <div>
                                    <span style={{fontSize: "24px", fontWeight: "700", color: theme.text}}>
                                        {ride.pricePerPerson}
                                    </span>
                                    <span style={{fontSize: "13px", color: theme.subtext, marginLeft: "4px"}}>ден</span>
                                </div>
                            </div>

                            <div style={{height: "1px", background: theme.border, marginBottom: "14px"}}/>

                            {/* Driver Row */}
                            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                                <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                                    <div style={{
                                        width: "36px", height: "36px", borderRadius: "50%",
                                        background: isDark ? "#3c4043" : "#f1f3f4",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", fontWeight: "700",
                                        fontSize: "13px", color: theme.text,
                                    }}>
                                        {ride.driverFirstName?.[0]}{ride.driverLastName?.[0]}
                                    </div>
                                    <div>
                                        <div style={{fontWeight: "600", fontSize: "14px", color: theme.text}}>
                                            {ride.driverFirstName} {ride.driverLastName}
                                        </div>
                                        <div style={{fontSize: "12px", color: theme.subtext, marginTop: "1px"}}>
                                            ⭐ {ride.driverRating?.toFixed(1)} · {ride.vehicleBrand} {ride.vehicleModel}
                                        </div>
                                    </div>
                                </div>

                                <div style={{display: "flex", gap: "8px"}}>
                                    <span style={{
                                        padding: "5px 12px", borderRadius: "20px",
                                        background: theme.badge, color: theme.subtext,
                                        fontSize: "12px", fontWeight: "500",
                                    }}>
                                        📅 {new Date(ride.departureTime).toLocaleDateString("mk-MK")}
                                    </span>
                                    <span style={{
                                        padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                                        background: ride.availableSeats > 0 ? "#e6f4ea" : "#fce8e6",
                                        color: ride.availableSeats > 0 ? "#137333" : "#c5221f",
                                    }}>
                                        💺 {ride.availableSeats} места
                                    </span>
                                </div>
                            </div>

                            {ride.stops?.length > 0 && (
                                <div style={{
                                    marginTop: "12px", paddingTop: "12px",
                                    borderTop: `1px solid ${theme.border}`,
                                    fontSize: "12px", color: theme.subtext,
                                }}>
                                    📍 {ride.stops.join(" → ")}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}