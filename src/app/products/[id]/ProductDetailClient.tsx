"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Database } from "@/types/database.types";
import { Shield, CheckCircle, Truck, Heart, ShoppingCart, MessageCircle, Star } from "lucide-react";
import { generateWhatsAppLink } from "@/lib/config";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import BackButton from "@/components/BackButton";
import ShareButton from "@/components/ShareButton";
import ReviewsSection from "@/components/reviews/ReviewsSection";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const whatsappLink = generateWhatsAppLink(product.name, product.price);
  const { addToCart } = useCart();
  const { hasItem, toggleItem } = useWishlist();
  const wished = hasItem(product.id);

  // Gallery: split image_url into multiple images (comma-separated) or use single
  const images = product.image_url
    ? product.image_url.split(",").map((u) => u.trim())
    : ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1200&auto=format&fit=crop"];
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <BackButton fallbackHref="/#products" />
            <ShareButton
              title={product.name}
              text={`Check out ${product.name} at Trivo Kenya — KES ${product.price.toLocaleString()}`}
              url={`https://trivokenya.store/products/${product.id}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden bg-card border border-subtle group">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                        i === selectedImage ? "border-accent ring-1 ring-accent/30" : "border-subtle/30 hover:border-default"
                      }`}
                    >
                      <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {product.category || "Accessory"}
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                  {product.name}
                </h1>
              </div>

              {/* Rating Row */}
              <ReviewRating productId={product.id} />

              <p className="text-lg text-subtle leading-relaxed">
                {product.description}
              </p>

              <div className="flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                  KES {product.price.toLocaleString()}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  KES {Math.round(product.price * 1.15).toLocaleString()}
                </span>
                {product.stock > 0 && product.stock < 5 && (
                  <span className="text-sm text-amber-500 font-medium">
                    Only {product.stock} left
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {product.stock > 0 && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-accent text-black px-8 py-4 text-sm font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-default text-foreground px-8 py-4 text-sm font-bold transition-all hover:bg-surface hover:border-accent/30 active:scale-95"
                  >
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    Order via WhatsApp
                  </a>
                  <button
                    onClick={() => toggleItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url })}
                    className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-4 text-sm font-bold transition-all active:scale-95 ${
                      wished
                        ? "border-red-500/30 bg-red-500/10 text-red-400"
                        : "border-default text-muted hover:text-foreground hover:bg-surface"
                    }`}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`h-5 w-5 ${wished ? "fill-red-500" : ""}`} />
                  </button>
                </div>
              )}

              {/* Key Specs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: "Condition", value: "Brand New" },
                  { label: "Warranty", value: "7-Day Replacement" },
                  { label: "Stock", value: product.stock > 0 ? `${product.stock} units` : "Out of stock" },
                  { label: "Delivery", value: product.stock > 0 ? "1-2 days (Nairobi)" : "—" },
                ].map((spec) => (
                  <div key={spec.label} className="rounded-xl bg-surface/30 border border-subtle/20 px-4 py-3">
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{spec.label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{spec.value}</p>
                  </div>
                ))}
              </div>

              {/* Delivery and Payment Details Panel */}
              <div className="border border-subtle rounded-2xl bg-card/50 p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-1.5">
                  <Truck className="h-4.5 w-4.5 text-accent" />
                  Delivery & Payment Details
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface/50 border border-default space-y-1">
                    <span className="font-bold text-foreground block">📍 Free Nairobi Delivery</span>
                    <span className="text-muted-foreground block leading-relaxed">Free delivery within 1 to 2 days. You get to open and check your item before paying via M-PESA.</span>
                  </div>
                  
                  <div className="p-3.5 rounded-xl bg-surface/50 border border-default space-y-1">
                    <span className="font-bold text-foreground block">🌍 Upcountry Delivery</span>
                    <span className="text-muted-foreground block leading-relaxed">Takes 2 to 3 days via courier. We share the tracking slip with you on WhatsApp as soon as it&apos;s sent.</span>
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

          {/* Customer Reviews Section */}
          <ReviewsSection productId={product.id} productName={product.name} />

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

function ReviewRating({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<{ rating: number }[]>([]);
  useEffect(() => {
    import("@/lib/reviews").then((m) => setReviews(m.getReviews(productId)));
  }, [productId]);
  const avg = reviews.length > 0
    ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10
    : 0;
  return (
    <div className="flex items-center gap-3">
      {reviews.length > 0 ? (
        <>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-4 w-4 ${star <= Math.round(avg) ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`} />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
        </>
      ) : (
        <span className="text-sm text-muted-foreground">No reviews yet</span>
      )}
    </div>
  );
}
