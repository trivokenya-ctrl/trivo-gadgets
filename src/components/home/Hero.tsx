"use client";

import Image from "next/image";
import { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function Hero({ product }: { product: Product | null }) {
  if (!product) return null;

  const whatsappLink = `https://wa.me/254757512769?text=${encodeURIComponent(`Hi! I'd like to order the ${product.name} at KES ${product.price.toLocaleString()}. Is it available?`)}`;

  return (
    <section className="relative w-full min-h-[70vh] sm:min-h-[85vh] flex items-center overflow-hidden bg-[#050505]">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] opacity-50 mix-blend-screen pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-30 mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 py-20">
        
        {/* Left Content */}
        <div className="flex-1 max-w-2xl space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tighter text-white leading-[1.1]">
            {product.name}
          </h1>
          
          <p className="text-lg md:text-xl text-muted max-w-lg text-balance leading-relaxed">
            {product.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-1">Price</span>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                KES {product.price.toLocaleString()}
              </p>
            </div>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(37,211,102,0.3)] hover:shadow-[0_0_60px_rgba(37,211,102,0.5)]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>
          </div>
        </div>

        {/* Right Floating Image */}
        <div className="flex-1 w-full max-w-lg relative perspective-1000">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-default bg-card/50 backdrop-blur-3xl shadow-2xl transform-gpu transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-12">
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
