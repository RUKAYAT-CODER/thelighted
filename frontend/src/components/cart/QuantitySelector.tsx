// frontend/src/components/cart/QuantitySelector.tsx
"use client";

import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: "sm" | "lg";
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  size = "sm",
  min = 1,
  max = 99,
  className = "",
}: QuantitySelectorProps) {
  const canDecrease = quantity > min;
  const canIncrease = quantity < max;

  const sizeClasses = {
    sm: {
      container: "h-8",
      button: "h-8 w-8",
      icon: "h-4 w-4",
      text: "text-sm",
    },
    lg: {
      container: "h-12",
      button: "h-12 w-12",
      icon: "h-5 w-5",
      text: "text-base",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`inline-flex items-center rounded-lg border border-gray-300 bg-white ${currentSize.container} ${className}`}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={canDecrease ? { scale: 1.05 } : {}}
        type="button"
        onClick={onDecrease}
        disabled={!canDecrease}
        className={`flex items-center justify-center ${currentSize.button} rounded-l-lg border-r border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white`}
        aria-label="Decrease quantity"
      >
        <Minus className={currentSize.icon} />
      </motion.button>

      <div 
        className={`flex-1 text-center font-medium ${currentSize.text} text-gray-900 select-none`}
      >
        {quantity}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={canIncrease ? { scale: 1.05 } : {}}
        type="button"
        onClick={onIncrease}
        disabled={!canIncrease}
        className={`flex items-center justify-center ${currentSize.button} rounded-r-lg border-l border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white`}
        aria-label="Increase quantity"
      >
        <Plus className={currentSize.icon} />
      </motion.button>
    </div>
  );
}