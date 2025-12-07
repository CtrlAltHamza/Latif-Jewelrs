import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import RatesSection from "../components/RatesSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

const products = [
  { id: 1, image: "/images/set.jpg" },
  { id: 2, image: "/images/s2.jpeg" },
  { id: 3, image: "/images/s5.png" },
  { id: 4, image: "/images/s3.png" },
  { id: 5, image: "/images/s6.jpeg" },
  { id: 6, image: "/images/necklace2.jpg" },
  { id: 7, image: "/images/ring2.jpg" },
  { id: 8, image: "/images/anklet1.jpg" },
  { id: 9, image: "/images/bracelet2.jpg" },
  { id: 10, image: "/images/earrings2.jpg" },
  { id: 11, image: "/images/necklace3.jpg" },
  { id: 12, image: "/images/ring3.jpg" },
  { id: 13, image: "/images/cuff1.jpg" },
  { id: 14, image: "/images/earrings3.jpg" },
  { id: 15, image: "/images/necklace4.jpg" },
];

export default function Home() {
  const [rates, setRates] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`${API_URL}/rates`);
        if (res.ok) {
          const data = await res.json();
          setRates(data);
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    fetchRates();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center relative"
      >
        <img
          src="/images/hero.jpg"
          alt="LATIF JEWELS"
          className="w-full h-[500px] object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
          <h1 className="text-5xl font-bold mb-4">LATIF JEWELS</h1>
          <p className="text-xl mb-6">Elegant Jewelry for Every Occasion</p>
          <a
            href="/products"
            className="px-6 py-3 bg-indigo-600 rounded shadow hover:bg-indigo-500 transition"
          >
            Explore Products
          </a>
        </div>
      </motion.section>

      {/* Rates Section */}
      <RatesSection rates={rates} />

      {/* Featured Products */}
      <section className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.slice(0, 5).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
