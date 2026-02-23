// frontend/src/components/cart/QuantitySelector.tsx
"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  className = "",
}: QuantitySelectorProps) {
  const canDecrement = quantity > min;
  const canIncrement = quantity < max;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        type="button"
        onClick={onDecrement}
        disabled={!canDecrement}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </motion.button>

      <motion.div
        key={quantity}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="min-w-[2rem] text-center font-medium text-lg text-gray-900"
      >
        {quantity}
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        type="button"
        onClick={onIncrement}
        disabled={!canIncrement}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </motion.button>
    </div>
  );
}