"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Image from "next/image";
import { Database } from "@/types/database.types";
import { Edit2, Trash2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function AdminProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const supabase = createClient();

  const handleStockChange = async (id: string, newStock: number) => {
    // Optimistic update
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
    
    await (supabase.from("products") as any).update({ stock: newStock }).eq("id", id);
  };

  const handleToggleFeatured = async (id: string) => {
    // Only one can be featured at a time
    setProducts(products.map(p => ({ ...p, is_featured: p.id === id })));
    
    // First, un-feature all
    await (supabase.from("products") as any).update({ is_featured: false }).neq("id", id);
    // Then feature the selected one
    await (supabase.from("products") as any).update({ is_featured: true }).eq("id", id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setProducts(products.filter(p => p.id !== id));
    await (supabase.from("products") as any).delete().eq("id", id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-neutral-400">
        <thead className="text-xs uppercase bg-white/5 border-b border-white/10 text-neutral-500">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Price (KES)</th>
            <th className="px-4 py-3 text-center">Stock</th>
            <th className="px-4 py-3 text-center">Featured</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3 flex items-center gap-3">
                <div className="relative h-10 w-10 rounded overflow-hidden bg-neutral-800 flex-shrink-0">
                  {product.image_url && (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-white">{product.name}</div>
                  <div className="text-xs text-neutral-500">{product.category}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-white">
                {product.price.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center">
                  <input
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                    className={`w-16 bg-transparent border rounded px-2 py-1 text-center text-white focus:outline-none focus:border-accent ${product.stock < 3 ? "border-amber-500 text-amber-500" : "border-white/20"}`}
                  />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleToggleFeatured(product.id)}
                  className={`p-1.5 rounded-md transition-colors ${product.is_featured ? "text-yellow-400 bg-yellow-400/10" : "text-neutral-600 hover:text-white"}`}
                >
                  <Star className="h-4 w-4" fill={product.is_featured ? "currentColor" : "none"} />
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button className="p-1.5 text-neutral-400 hover:text-white transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                No products found. Add some inventory.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
