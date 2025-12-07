import { useState, useEffect } from "react";

export default function AdminRatesSection({ rates, fetchRates }) {
  const [goldTola, setGoldTola] = useState("");
  const [goldGram, setGoldGram] = useState("");
  const [silverTola, setSilverTola] = useState("");
  const [silverGram, setSilverGram] = useState("");

  useEffect(() => {
    if (rates) {
      setGoldTola(rates.gold_per_tola);
      setGoldGram(rates.gold_per_gram);
      setSilverTola(rates.silver_per_tola);
      setSilverGram(rates.silver_per_gram);
    }
  }, [rates]);

  const handleUpdate = () => {
    fetch("http://127.0.0.1:5002/update-rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ gold_tola: goldTola, gold_gram: goldGram, silver_tola: silverTola, silver_gram: silverGram }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") fetchRates();
        else alert(data.message);
      });
  };

  const handleLogout = () => {
    fetch("http://127.0.0.1:5002/admin-logout", { method: "POST", credentials: "include" })
      .then(() => window.location.reload());
  };

  return (
    <div>
      <h2>Admin Dashboard - Update Rates</h2>
      <div>
        <label>Gold per Tola</label>
        <input value={goldTola} onChange={e => setGoldTola(e.target.value)} />
        <label>Gold per Gram</label>
        <input value={goldGram} onChange={e => setGoldGram(e.target.value)} />
        <label>Silver per Tola</label>
        <input value={silverTola} onChange={e => setSilverTola(e.target.value)} />
        <label>Silver per Gram</label>
        <input value={silverGram} onChange={e => setSilverGram(e.target.value)} />
      </div>
      <button onClick={handleUpdate}>Update Rates</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
