// src/components/PageTransition.jsx
import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.45 }}
      className="min-h-[60vh]"
    >
      {children}
    </motion.div>
  );
}
