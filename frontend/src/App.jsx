import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageTransition from "./components/PageTransition";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import { fetchRates } from "./api";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}

export function RatesSection({ rates: initialRates }) {
  const [rates, setRates] = useState(initialRates || null);
  const [loading, setLoading] = useState(!initialRates);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialRates) return;
    let cancelled = false;
    setLoading(true);
    
    fetchRates()
      .then((data) => {
        if (!cancelled) {
          setRates(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load rates:", err);
          setError("Failed to load rates");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    
    return () => {
      cancelled = true;
    };
  }, [initialRates]);

  if (loading) return <p>Loading rates...</p>;
  if (error) return <p>{error}</p>;
  if (!rates) return <p>No rates available</p>;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded shadow max-w-xl mx-auto my-6">
      <h2 className="text-2xl font-semibold mb-2">Current Gold & Silver Rates</h2>
      <div className="grid grid-cols-2 gap-2 text-left">
        <div>Gold per Tola:</div><div>{rates.gold_per_tola}</div>
        <div>Gold per Gram:</div><div>{rates.gold_per_gram}</div>
        <div>Silver per Tola:</div><div>{rates.silver_per_tola}</div>
        <div>Silver per Gram:</div><div>{rates.silver_per_gram}</div>
      </div>
    </div>
  );
}
