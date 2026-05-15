"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function CartButton() {
  const { items, setIsDrawerOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <button 
      onClick={() => setIsDrawerOpen(true)}
      className="relative hover:text-accent transition-colors"
      aria-label="Open Cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {mounted && itemCount > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg animate-in zoom-in duration-300">
          {itemCount}
        </span>
      )}
    </button>
  );
}
