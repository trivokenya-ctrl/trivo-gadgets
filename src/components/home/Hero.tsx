import Image from "next/image";
import { generateWhatsAppLink } from "@/lib/config";
import { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function Hero({ product }: { product: Product | null }) {
  if (!product) return null;

  return (
    <section className="relative w-full h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={product.image_url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop"}
          alt={product.name}
          fill
          className="object-cover opacity-40 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>
            Featured Drop
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            {product.name}
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-300 max-w-lg text-balance">
            {product.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <p className="text-3xl font-bold text-white">
              KES {product.price.toLocaleString()}
            </p>
            
            <a
              href={generateWhatsAppLink(product.name, product.price)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-semibold text-black hover:bg-[#20b858] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(37,211,102,0.3)]"
            >
              Buy on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
