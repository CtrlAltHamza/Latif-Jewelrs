// src/routes.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import PageTransition from "./components/PageTransition";

function AnimatedRoutes(){
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home/></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products/></PageTransition>} />
        <Route path="/products/:id" element={<PageTransition><ProductDetail/></PageTransition>} />
        <Route path="/about" element={<PageTransition><About/></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact/></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminDashboard/></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}
