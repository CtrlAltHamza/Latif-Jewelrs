import { motion } from "framer-motion";

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="border rounded p-4 shadow hover:shadow-lg transition"
    >
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-2 rounded" />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500">{product.material}</p>
      <p className="text-indigo-600 font-bold">{product.price}</p>
    </motion.div>
  );
}
