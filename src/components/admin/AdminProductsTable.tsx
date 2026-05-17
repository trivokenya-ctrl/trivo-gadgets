"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Database } from "@/types/database.types";
import { Edit2, Trash2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function AdminProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const supabase = createClient();

  const handleStockChange = async (id: string, newStock: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
    
    await supabase.from("products").update({ stock: newStock }).eq("id", id);
  };

  const handleToggleFeatured = async (id: string) => {
    const previous = [...products];
    setProducts(products.map(p => ({ ...p, is_featured: p.id === id })));

    const { error: err1 } = await supabase.from("products").update({ is_featured: false }).neq("id", id);
    const { error: err2 } = await supabase.from("products").update({ is_featured: true }).eq("id", id);

    if (err1 || err2) {
      setProducts(previous);
      console.error("Failed to toggle featured:", err1 || err2);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const previous = [...products];
    setProducts(products.filter(p => p.id !== id));

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      setProducts(previous);
      console.error("Failed to delete product:", error);
    }
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
                  <Link href={`/admin/products/${product.id}/edit`} className="p-1.5 text-neutral-400 hover:text-white transition-colors inline-block">
                    <Edit2 className="h-4 w-4" />
                  </Link>
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
