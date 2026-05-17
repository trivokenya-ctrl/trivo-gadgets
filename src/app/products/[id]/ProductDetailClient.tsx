"use client";

import Image from "next/image";
import Link from "next/link";
import { Database } from "@/types/database.types";
import { ShoppingCart, Check, ArrowLeft, Zap, Package, Shield } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <Link
            href="/#products"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-900 border border-white/5">
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
                <div className="text-xs font-medium text-neutral-500 uppercase tracking-widest">
                  {product.category || "Accessory"}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                  {product.name}
                </h1>
              </div>

              <p className="text-lg text-neutral-300 leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-white">
                  KES {product.price.toLocaleString()}
                </span>
                {product.stock > 0 && product.stock < 5 && (
                  <span className="text-sm text-amber-500 font-medium">
                    Only {product.stock} left
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleAdd}
                  disabled={product.stock < 1}
                  className="flex-1 inline-flex items-center justify-center gap-3 rounded-full bg-white text-black px-8 py-4 text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {added ? (
                    <>
                      <Check className="h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <Zap className="h-5 w-5 text-accent" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <Package className="h-5 w-5 text-accent" />
                  <span>Original Products</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-400">
                  <Shield className="h-5 w-5 text-accent" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-24">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Related Products</h2>
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
