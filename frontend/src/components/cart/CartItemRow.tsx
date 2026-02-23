// frontend/src/components/cart/CartItemRow.tsx
"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cartStore";
import { CartItem } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { QuantitySelector } from "./QuantitySelector";

interface CartItemRowProps {
  item: CartItem;
  className?: string;
}

export function CartItemRow({ item, className = "" }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  const totalPrice = item.price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <div className="relative h-16 w-16 overflow-hidden rounded-lg">
          <Image
            src={item.image || "/placeholder-image.jpg"}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <h3 className="truncate font-medium text-gray-900">{item.name}</h3>
        <p className="truncate text-sm text-gray-500 mt-1">{item.description}</p>
      </div>

      {/* Quantity Selector */}
      <div className="flex-shrink-0">
        <QuantitySelector
          quantity={item.quantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          min={1}
          max={99}
        />
      </div>

      {/* Price Info */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="font-semibold text-lg text-orange-500">
          {formatCurrency(totalPrice)}
        </span>
        {item.quantity > 1 && (
          <span className="text-xs text-gray-500 mt-1">
            {formatCurrency(item.price)} each
          </span>
        )}
      </div>

      {/* Remove Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.1 }}
        type="button"
        onClick={handleRemove}
        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
        aria-label={`Remove ${item.name} from cart`}
      >
        <X className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}