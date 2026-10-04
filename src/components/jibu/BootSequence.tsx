import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function BootSequence() {
  const [visible, setVisible] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reduced ? 100 : 1080);
    return () => window.clearTimeout(timer);
  }, [reduced]);

  if (!visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-5 pt-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="border border-line bg-panel/95 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-flow shadow-ledger">
        iniciando verificación... ✓
      </div>
    </motion.div>
  );
}