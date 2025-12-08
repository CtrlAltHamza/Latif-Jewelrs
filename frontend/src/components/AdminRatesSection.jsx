import { useState, useEffect } from "react";
import { updateRates, logoutAdmin } from "../api.js";

export default function AdminRatesSection({ rates, fetchRates, token }) {
  const [goldTola, setGoldTola] = useState("");
  const [goldGram, setGoldGram] = useState("");
  const [silverTola, setSilverTola] = useState("");
  const [silverGram, setSilverGram] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (rates) {
      setGoldTola(rates.gold_per_tola);
      setGoldGram(rates.gold_per_gram);
      setSilverTola(rates.silver_per_tola);
      setSilverGram(rates.silver_per_gram);
    }
  }, [rates]);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await updateRates(token, {
        gold_tola: parseFloat(goldTola),
        gold_gram: parseFloat(goldGram),
        silver_tola: parseFloat(silverTola),
        silver_gram: parseFloat(silverGram)
      });
      
      if (result.status === "success") {
        alert("Rates updated successfully!");
        fetchRates();
      } else {
        setError(result.error || "Update failed");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/";
    }
  };

  return (
    <div>
      <h2>Admin Dashboard - Update Rates</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Gold per Tola</label>
        <input 
          type="number" 
          value={goldTola} 
          onChange={e => setGoldTola(e.target.value)} 
        />
        <label>Gold per Gram</label>
        <input 
          type="number" 
          value={goldGram} 
          onChange={e => setGoldGram(e.target.value)} 
        />
        <label>Silver per Tola</label>
        <input 
          type="number" 
          value={silverTola} 
          onChange={e => setSilverTola(e.target.value)} 
        />
        <label>Silver per Gram</label>
        <input 
          type="number" 
          value={silverGram} 
          onChange={e => setSilverGram(e.target.value)} 
        />
      </div>
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Rates"}
      </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}