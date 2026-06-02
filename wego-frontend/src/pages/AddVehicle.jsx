import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function AddVehicle() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        brand: "", model: "", color: "",
        licensePlate: "", year: "", seats: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/vehicles", {
                ...form,
                year: parseInt(form.year),
                seats: parseInt(form.seats),
            });
            navigate("/create-ride");
        } catch {
            setError("Грешка при додавање возило!");
        }
    };

    return (
        <div style={styles.container}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.logo}>🚗 WeGo</Link>
                <Link to="/create-ride" style={styles.back}>← Назад</Link>
            </nav>
            <div style={styles.card}>
                <h2 style={styles.title}>Додај возило</h2>
                {error && <p style={styles.error}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.row}>
                        <input style={styles.inputHalf} placeholder="Марка (пр. Volkswagen)"
                               value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                        <input style={styles.inputHalf} placeholder="Модел (пр. Golf 7)"
                               value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
                    </div>
                    <input style={styles.input} placeholder="Боја (пр. Сива)"
                           value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} required />
                    <input style={styles.input} placeholder="Регистарски таблички (пр. SK 1234 AB)"
                           value={form.licensePlate} onChange={(e) => setForm({ ...form, licensePlate: e.target.value })} required />
                    <div style={styles.row}>
                        <input style={styles.inputHalf} type="number" placeholder="Година (пр. 2019)"
                               value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
                        <input style={styles.inputHalf} type="number" placeholder="Места (пр. 4)"
                               value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} required />
                    </div>
                    <button style={styles.button} type="submit">Додај возило</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: "100vh", background: "#f0f2f5" },
    nav: { background: "white", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
    logo: { color: "#6c3fc5", textDecoration: "none", fontSize: "24px", fontWeight: "700" },
    back: { color: "#6c3fc5", textDecoration: "none" },
    card: { maxWidth: "500px", margin: "32px auto", background: "white", padding: "32px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
    title: { margin: "0 0 24px", color: "#333" },
    row: { display: "flex", gap: "8px" },
    input: { width: "100%", padding: "12px", margin: "8px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" },
    inputHalf: { width: "50%", padding: "12px", margin: "8px 0", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" },
    button: { width: "100%", padding: "12px", background: "#6c3fc5", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer", marginTop: "12px" },
    error: { color: "red", textAlign: "center" },
};