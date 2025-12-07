import { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function Admin() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setToken(localStorage.getItem("admin_token"));
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!token) {
    return <AdminLogin onLoginSuccess={(newToken) => {
      localStorage.setItem("admin_token", newToken);
      setToken(newToken);
    }} />;
  }

  return <AdminDashboard onLogout={() => {
    localStorage.removeItem("admin_token");
    setToken(null);
  }} />;
}