"use client";
import { motion } from "framer-motion";

// Rendered from app/template.tsx, which remounts on every navigation.
export default function PageFade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  );
}
