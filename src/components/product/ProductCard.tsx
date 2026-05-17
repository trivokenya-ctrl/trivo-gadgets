"use client";

import Image from "next/image";
import Link from "next/link";
import { Database } from "@/types/database.types";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductCard({ product }: { product: Product }) {
  const inStock = product.stock > 0;
  const { addToCart } = useCart();

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card border border-subtle transition-all hover:border-default hover:bg-card-hover hover:shadow-2xl">
      <Link href={`/products/${product.id}`} className="relative aspect-[4/5] w-full overflow-hidden bg-card">
        <Image
          src={product.image_url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {!inStock ? (
            <span className="rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              Out of Stock
            </span>
          ) : (
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md border border-default">
              In Stock
            </span>
          )}
        </div>

        {!inStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {product.category || "Accessory"}
        </div>
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-foreground mb-1 hover:text-accent transition-colors">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-subtle">
          <span className="text-xl font-bold text-foreground">
            KES {product.price.toLocaleString()}
          </span>
          
          {inStock ? (
            <button
              onClick={() => addToCart(product)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-black transition-transform hover:scale-110"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          ) : (
            <button
              disabled
              className="inline-flex h-10 px-4 items-center justify-center rounded-full bg-chat-bubble text-muted-foreground text-xs font-medium"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
