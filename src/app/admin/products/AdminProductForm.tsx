"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Database } from "@/types/database.types";
import { Sparkles, Save, Loader2, ArrowLeft, Wand2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Product = Database["public"]["Tables"]["products"]["Row"];

const categories = ["Smartphone", "Laptop", "Audio", "Wearable", "Accessory", "Gaming", "Smart Home", "Tablet"];

export default function AdminProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const supabase = createClient();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price.toString() || "",
    stock: product?.stock.toString() || "0",
    category: product?.category || "",
    image_url: product?.image_url || "",
    is_featured: product?.is_featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });
      const data = await res.json();
      if (data.title) handleChange("name", data.title);
      if (data.description) handleChange("description", data.description);
      if (data.category && categories.includes(data.category)) handleChange("category", data.category);
    } catch {
      console.error("AI generation failed");
    }
    setGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseInt(form.price) || 0,
      stock: parseInt(form.stock) || 0,
      category: form.category || null,
      image_url: form.image_url || null,
      is_featured: form.is_featured,
    };

    if (isEdit && product) {
      await supabase.from("products").update(payload).eq("id", product.id);
    } else {
      await supabase.from("products").insert([payload]);
    }

    setSaving(false);
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>
        </div>

        {/* AI Assistant */}
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent/20">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">AI Product Assistant</h2>
              <p className="text-sm text-muted">
                Describe what you want to sell and AI will generate the title, description, and category.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder='e.g. "A premium wireless noise-cancelling headphone with 30hr battery, great for travel and office use"'
              className="flex-1 bg-surface border border-default rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 resize-none h-20"
            />
            <button
              onClick={handleGenerate}
              disabled={generating || !aiPrompt.trim()}
              className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-accent/90 transition-all disabled:opacity-50 self-end"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4" />
              )}
              Generate
            </button>
          </div>
        </div>

        {/* Product Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-default bg-card p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-subtle mb-2">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="w-full bg-surface border border-default rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-subtle mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full bg-surface border border-default rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 resize-none"
                  placeholder="Describe the product, its features, and benefits..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtle mb-2">Price (KES)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                  min="0"
                  className="w-full bg-surface border border-default rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
                  placeholder="e.g. 45000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtle mb-2">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => handleChange("stock", e.target.value)}
                  min="0"
                  className="w-full bg-surface border border-default rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-subtle mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full bg-surface border border-default rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-accent/50"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-subtle mb-2">Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => handleChange("image_url", e.target.value)}
                  className="w-full bg-surface border border-default rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => handleChange("is_featured", e.target.checked)}
                className="w-5 h-5 rounded border-default bg-surface text-accent focus:ring-accent"
              />
              <span className="text-sm text-subtle">Feature this product on the homepage</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl text-sm font-bold hover:bg-neutral-200 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isEdit ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
