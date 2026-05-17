"use client";

import Image from "next/image";
import Link from "next/link";
import { Database } from "@/types/database.types";
import { ArrowRight, Sparkles } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function Hero({ product }: { product: Product | null }) {
  if (!product) return null;

  const whatsappLink = `https://wa.me/254757512769?text=${encodeURIComponent(`Hi! I'd like to order the ${product.name} at KES ${product.price.toLocaleString()}. Is it available?`)}`;
  const bgWord = product.name.split(" ")[0] || "TRIVO";

  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-[90vh] flex items-center overflow-hidden bg-[#050505] py-20">
      {/* Giant iTey-Style Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0 select-none pointer-events-none">
        <span className="text-[12rem] md:text-[22rem] font-black text-white/[0.03] dark:text-white/[0.02] tracking-tighter uppercase whitespace-nowrap">
          {bgWord} PRO
        </span>
      </div>

      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Content */}
        <div className="flex-1 max-w-2xl space-y-6">
          {/* iTey Style Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Kenya&apos;s #1 Premium Tech Store</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.05]">
            {product.name}
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-lg leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* iTey Style Price */}
          <div className="pt-2">
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-accent mb-8">
              From KSh {product.price.toLocaleString()}
            </p>
          </div>

          {/* iTey CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-black font-extrabold px-8 py-4 rounded-full text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(37,211,102,0.3)] hover:shadow-[0_0_50px_rgba(37,211,102,0.5)]"
            >
              Buy Now <ArrowRight className="h-4 w-4 shrink-0" />
            </a>
            
            <Link 
              href="/#products" 
              className="inline-flex items-center gap-2 text-white font-bold text-sm hover:text-accent transition-colors py-2"
            >
              View All Products <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>

        {/* Right Floating Image Showcase */}
        <div className="flex-1 w-full max-w-lg relative perspective-1000 mt-8 lg:mt-0">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-default bg-card/40 backdrop-blur-3xl shadow-2xl transform-gpu transition-transform duration-700 hover:rotate-y-12 hover:rotate-x-12">
            <Image
              src={product.image_url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Inner glassmorphism glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 pointer-events-none" />
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-[40px] animate-pulse pointer-events-none" />
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] animate-pulse pointer-events-none" />
        </div>

      </div>
    </section>
  );
}
