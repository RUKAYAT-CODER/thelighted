// frontend/src/components/cart/CartDemo.tsx
// Demo component showing how to use CartItemRow and QuantitySelector
"use client";

import { CartItemRow } from "./CartItemRow";
import { QuantitySelector } from "./QuantitySelector";
import { useCartStore } from "@/lib/store/cartStore";

export function CartDemo() {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();

  // Sample menu items for demo
  const sampleItems = [
    {
      id: "1",
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with herbs and lemon",
      price: 24.99,
      image: "/placeholder-image.jpg",
      quantity: 1,
    },
    {
      id: "2",
      name: "Vegetable Stir Fry",
      description: "Seasonal vegetables with tofu in ginger sauce",
      price: 16.50,
      image: "/placeholder-image.jpg",
      quantity: 2,
    },
    {
      id: "3",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with molten center",
      price: 8.99,
      image: "/placeholder-image.jpg",
      quantity: 1,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart Demo</h2>
      
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-800">Sample Items:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-orange-500 font-semibold">${item.price}</p>
              <button
                onClick={() => addItem(
                  {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    image: item.image,
                    category: "main" as any,
                  },
                  1
                )}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Your Cart ({items.length} items):</h3>
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty. Add some items above!
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Quantity Selector Examples:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-600">Small (sm)</span>
            <QuantitySelector
              quantity={3}
              onIncrease={() => console.log("Increase sm")}
              onDecrease={() => console.log("Decrease sm")}
              size="sm"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-600">Large (lg)</span>
            <QuantitySelector
              quantity={5}
              onIncrease={() => console.log("Increase lg")}
              onDecrease={() => console.log("Decrease lg")}
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}