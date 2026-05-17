"use client";

import Image from "next/image";
import { Database } from "@/types/database.types";
import { Shield, CheckCircle, Truck } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/config";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import BackButton from "@/components/BackButton";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const whatsappLink = generateWhatsAppLink(product.name, product.price);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <BackButton fallbackHref="/#products" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden bg-card border border-subtle">
              <Image
                src={product.image_url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop"}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {product.stock < 1 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">Out of Stock</span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {product.category || "Accessory"}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                  {product.name}
                </h1>
              </div>

              <p className="text-lg text-subtle leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                  KES {product.price.toLocaleString()}
                </span>
                {product.stock > 0 && product.stock < 5 && (
                  <span className="text-sm text-amber-500 font-medium">
                    Only {product.stock} left
                  </span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-3 rounded-full bg-accent text-black px-8 py-4 text-sm font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Order via WhatsApp
                  </a>
                </div>
              )}

              {/* Delivery and Payment Details Panel */}
              <div className="border border-subtle rounded-2xl bg-card/50 p-6 space-y-4 pt-4 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5">
                  <Truck className="h-4.5 w-4.5 text-accent" />
                  Delivery & Payment Details
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface/50 border border-default space-y-1">
                    <span className="font-bold text-foreground block">📍 Nairobi Delivery</span>
                    <span className="text-muted-foreground block leading-relaxed">Delivered within 1 to 2 days. You get to open and check your item before paying via M-PESA.</span>
                  </div>
                  
                  <div className="p-3.5 rounded-xl bg-surface/50 border border-default space-y-1">
                    <span className="font-bold text-foreground block">🌍 Upcountry Delivery</span>
                    <span className="text-muted-foreground block leading-relaxed">Takes 2 to 3 days via courier. We share the tracking slip with you on WhatsApp as soon as it's sent.</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs pt-3 border-t border-subtle">
                  <div className="flex items-center gap-1.5 text-muted">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Quality Checked</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted">
                    <Shield className="h-4 w-4 text-accent" />
                    <span>100% Genuine Tech</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">Related Products</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
