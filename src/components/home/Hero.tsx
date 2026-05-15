"use client";

import Image from "next/image";
import { Database } from "@/types/database.types";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function Hero({ product }: { product: Product | null }) {
  const { addToCart } = useCart();
  
  if (!product) return null;

  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-[#050505]">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 py-20">
        
        {/* Left Content */}
        <div className="flex-1 max-w-2xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-xl shadow-[0_4px_24px_-8px_rgba(255,255,255,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Premium Drop
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-white leading-[1.1]">
            {product.name}
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-lg text-balance leading-relaxed">
            {product.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-1">Price</span>
              <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                KES {product.price.toLocaleString()}
              </p>
            </div>
            
            <button
              onClick={() => addToCart(product)}
              className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Right Floating Image */}
        <div className="flex-1 w-full max-w-lg relative perspective-1000">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-3xl shadow-2xl transform-gpu transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-12">
            <Image
              src={product.image_url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              priority
            />
            {/* Inner glassmorphism glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 pointer-events-none" />
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-[40px] animate-pulse" />
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] animate-pulse" />
        </div>

      </div>
    </section>
  );
}
