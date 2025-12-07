import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

export default function AdminDashboard({ onLogout }) {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goldTola, setGoldTola] = useState("");
  const [goldGram, setGoldGram] = useState("");
  const [silverTola, setSilverTola] = useState("");
  const [silverGram, setSilverGram] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_URL}/rates`)
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        setRates(data);
        setGoldTola(data.gold_per_tola);
        setGoldGram(data.gold_per_gram);
        setSilverTola(data.silver_per_tola);
        setSilverGram(data.silver_per_gram);
      })
      .catch((err) => console.error("Failed to fetch rates:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleUpdateRates = async () => {
    try {
      const res = await fetch(`${API_URL}/update-rates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        credentials: "include",
        body: JSON.stringify({
          gold_tola: parseFloat(goldTola),
          gold_gram: parseFloat(goldGram),
          silver_tola: parseFloat(silverTola),
          silver_gram: parseFloat(silverGram),
        }),
      });

      if (res.ok) {
        alert("Rates updated successfully!");
      } else {
        const body = await res.json().catch(() => ({}));
        alert("Error: " + (body.message || "Failed to update rates"));
      }
    } catch (error) {
      console.error("Error updating rates:", error);
      alert("Error updating rates");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/admin-logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("admin_token");
      if (onLogout) onLogout();
      navigate("/admin");
    }
  };

  if (loading) return <p className="text-center py-8">Loading admin dashboard...</p>;

  return (
    <div className="admin-dashboard p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard - Update Rates</h2>
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium">Gold per Tola</label>
          <input type="number" value={goldTola} onChange={(e) => setGoldTola(e.target.value)} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Gold per Gram</label>
          <input type="number" value={goldGram} onChange={(e) => setGoldGram(e.target.value)} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Silver per Tola</label>
          <input type="number" value={silverTola} onChange={(e) => setSilverTola(e.target.value)} className="border p-2 w-full rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Silver per Gram</label>
          <input type="number" value={silverGram} onChange={(e) => setSilverGram(e.target.value)} className="border p-2 w-full rounded" />
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={handleUpdateRates} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Rates
        </button>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </div>
  );
}
