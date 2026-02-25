"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { QuantitySelector } from "./QuantitySelector";

export function AddToCartModal() {
  const { isModalOpen, selectedItem, closeModal, addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isModalOpen || !selectedItem) return;
    setQuantity(1);
  }, [isModalOpen, selectedItem?.id]);

  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isModalOpen, closeModal]);

  useEffect(() => {
    if (!isModalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 80);

    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(focusTimer);
    };
  }, [isModalOpen]);

  const totalPrice = useMemo(() => {
    if (!selectedItem) return 0;
    return selectedItem.price * quantity;
  }, [selectedItem, quantity]);

  const handleAddToCart = () => {
    if (!selectedItem) return;

    addItem(selectedItem, quantity);
    closeModal();
    setQuantity(1);
  };

  return (
    <AnimatePresence>
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-0 md:items-center md:p-4">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="pointer-events-auto w-full max-w-lg rounded-t-2xl bg-white shadow-2xl md:rounded-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-to-cart-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-300 md:hidden" />

              <div className="flex items-start justify-between px-4 pb-2 pt-4 md:px-6">
                <h2
                  id="add-to-cart-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Add to Cart
                </h2>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  aria-label="Close add to cart modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-[75vh] overflow-y-auto px-4 pb-4 md:px-6 md:pb-6">
                <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Image
                    src={selectedItem.image || "/placeholder-image.jpg"}
                    alt={selectedItem.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 512px"
                    className="object-cover"
                    priority
                  />
                </div>

                <div className="mb-5">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedItem.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    {selectedItem.description}
                  </p>
                </div>

                <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Quantity
                    </p>
                    <p className="mt-1 text-sm text-gray-700">
                      {formatCurrency(selectedItem.price)} each
                    </p>
                  </div>

                  <QuantitySelector
                    quantity={quantity}
                    onIncrease={() => setQuantity((current) => current + 1)}
                    onDecrease={() =>
                      setQuantity((current) => Math.max(1, current - 1))
                    }
                    size="lg"
                    min={1}
                    max={99}
                  />
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-medium text-gray-700">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-orange-500 px-4 text-base font-semibold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Add {quantity} to Cart
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default AddToCartModal;
