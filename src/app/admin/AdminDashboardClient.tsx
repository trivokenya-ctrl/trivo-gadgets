"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Database } from "@/types/database.types";
import { createProduct, updateProduct, deleteProduct } from "@/lib/actions/admin";
import { analyzeProductSEO, getGradeColor, getGradeBg } from "@/lib/seo";
import { Package, Users, AlertTriangle, PackageOpen, Plus, X, Edit2, Trash2, BarChart3 } from "lucide-react";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Subscriber = { email: string; subscribed_at: string | null };

const categories = ["Audio", "Car Accessories", "Smart Home", "Cables", "Lighting", "Other"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  category: "",
  image_url: "",
  is_featured: false,
  seo_title: "",
  seo_description: "",
  focus_keyword: "",
};

type Toast = { id: number; message: string; type: "success" | "error" };
let toastId = 0;

export default function AdminDashboardClient({
  initialStats,
  initialProducts,
  initialSubscribers,
}: {
  initialStats: { totalProducts: number; totalStock: number; subscribersCount: number; lowStock: number };
  initialProducts: Product[];
  initialSubscribers: Subscriber[];
}) {
  const [stats, setStats] = useState(initialStats);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"products" | "seo">("products");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: "success" | "error") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, productsRes, subsRes] = await Promise.all([
        import("@/lib/actions/admin").then((m) => m.getAdminStats()),
        import("@/lib/actions/admin").then((m) => m.getAdminProducts()),
        import("@/lib/actions/admin").then((m) => m.getAdminSubscribers()),
      ]);
      setStats(statsRes);
      setProducts(productsRes);
      setSubscribers(subsRes);
    } catch {
      addToast("Failed to refresh data", "error");
    }
    setLoading(false);
  }, [addToast]);

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const openEditForm = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || "",
      image_url: product.image_url || "",
      is_featured: product.is_featured,
      seo_title: product.seo_title || "",
      seo_description: product.seo_description || "",
      focus_keyword: product.focus_keyword || "",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("name", form.name);
      fd.set("description", form.description);
      fd.set("price", form.price);
      fd.set("stock", form.stock);
      fd.set("category", form.category);
      fd.set("image_url", form.image_url);
      fd.set("is_featured", form.is_featured ? "true" : "false");
      fd.set("seo_title", form.seo_title);
      fd.set("seo_description", form.seo_description);
      fd.set("focus_keyword", form.focus_keyword);

      if (editingId) {
        await updateProduct(editingId, fd);
        addToast("Product updated", "success");
      } else {
        await createProduct(fd);
        addToast("Product created", "success");
      }
      resetForm();
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      addToast(message, "error");
    }
    setSaving(false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      addToast("Product deleted", "success");
      setDeleteTarget(null);
      await refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      addToast(message, "error");
    }
    setDeleting(false);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value={stats.totalProducts} />
        <StatCard icon={PackageOpen} label="Total Stock" value={stats.totalStock} />
        <StatCard icon={Users} label="Subscribers" value={stats.subscribersCount} />
        <StatCard icon={AlertTriangle} label="Low Stock" value={stats.lowStock} warning valueRed />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-default mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
            tab === "products" ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <Package className="h-4 w-4 inline mr-1.5" />
          Products
        </button>
        <button
          onClick={() => setTab("seo")}
          className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
            tab === "seo" ? "border-accent text-foreground" : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-1.5" />
          SEO Audit
        </button>
      </div>

      {/* Products Section */}
      {tab === "products" && (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Products</h2>
          <button
            onClick={() => { resetForm(); setShowForm((v) => !v); }}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black hover:bg-neutral-200 transition-colors"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "Add New Product"}
          </button>
        </div>

        {/* Inline Product Form */}
        {showForm && (
          <form onSubmit={handleFormSubmit} className="mb-6 rounded-xl border border-default bg-card p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2 lg:col-span-3">
                <input
                  type="text"
                  placeholder="Product Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <textarea
                  placeholder="Description"
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Price (KES)"
                  required
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Stock"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent"
                >
                  <option value="">Category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <input
                  type="url"
                  placeholder="Image URL"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                className="h-4 w-4 rounded border-default bg-surface text-accent focus:ring-accent"
              />
              <span className="text-xs text-muted">
                Set as Featured (unfeatures all others)
              </span>
            </label>

            {/* SEO Section */}
            <div className="border-t border-default pt-4 mt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">SEO Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2 lg:col-span-3">
                  <input
                    type="text"
                    placeholder="SEO Title (leave blank to use product name)"
                    value={form.seo_title}
                    onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
                    className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {form.seo_title.length || "(uses product name)"}/60 chars recommended
                  </p>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <textarea
                    placeholder="SEO Meta Description (leave blank to use product description)"
                    rows={2}
                    value={form.seo_description}
                    onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
                    className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {form.seo_description.length || "(uses product description)"}/160 chars recommended
                  </p>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Focus Keyword"
                    value={form.focus_keyword}
                    onChange={(e) => setForm((f) => ({ ...f, focus_keyword: e.target.value }))}
                    className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-default px-5 py-2 text-xs font-medium text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-white px-5 py-2 text-xs font-bold text-black hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-black border-t-transparent" />}
                {editingId ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        )}

        {/* Products Table */}
        <div className="overflow-x-auto rounded-xl border border-default bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted-foreground border-b border-default">
              <tr>
                <th className="px-4 py-3 w-12">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3 w-20">Stock</th>
                <th className="px-4 py-3 w-16 text-center">Featured</th>
                <th className="px-4 py-3 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-subtle hover:bg-surface/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground text-xs">—</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category || "—"}</td>
                  <td className="px-4 py-3 text-foreground whitespace-nowrap">
                    KES {p.price.toLocaleString()}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap ${p.stock < 3 ? "text-red-500 font-semibold" : "text-foreground"}`}>
                    {p.stock}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block h-3 w-3 rounded-full ${p.is_featured ? "bg-green-500" : "bg-neutral-600"}`} />
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEditForm(p)} className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors mr-3">
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(p)} className="inline-flex items-center gap-1 text-xs text-muted hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No products yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="flex justify-center py-4">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}
      </section>
      )}

      {/* SEO Audit Section */}
      {tab === "seo" && (
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">SEO Audit</h2>
          <span className="text-xs text-muted-foreground">
            {products.filter((p) => {
              const score = analyzeProductSEO(p);
              return score.percentage >= 70;
            }).length}/{products.length} optimized
          </span>
        </div>
        <div className="space-y-3">
          {products.map((p) => {
            const score = analyzeProductSEO(p);
            const gradeColor = getGradeColor(score.grade);
            const gradeBg = getGradeBg(score.grade);
            return (
              <div key={p.id} className={`rounded-xl border p-4 ${gradeBg}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`text-lg font-bold ${gradeColor}`}>{score.percentage}%</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground capitalize">{score.grade} — {score.total}/{score.max} pts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { openEditForm(p); setTab("products"); }}
                    className="shrink-0 rounded-lg border border-default px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
                  >
                    Edit SEO
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                  {score.checks.map((check, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`shrink-0 ${check.pass ? "text-green-500" : "text-red-500"}`}>
                        {check.pass ? "✓" : "✗"}
                      </span>
                      <span className="text-muted-foreground truncate">{check.label}</span>
                      <span className="ml-auto shrink-0 text-muted-foreground">{check.score}/{check.max}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-10">No products to audit.</p>
          )}
        </div>
      </section>
      )}

      {/* Subscribers Section */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Subscribers</h2>
        <div className="overflow-x-auto rounded-xl border border-default bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface text-xs uppercase text-muted-foreground border-b border-default">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 w-48">Date Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={i} className="border-b border-subtle last:border-0 hover:bg-surface/20 transition-colors">
                  <td className="px-4 py-3 text-foreground">{s.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.subscribed_at)}</td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-xl border border-default bg-card p-6 shadow-2xl">
            <h3 className="text-base font-bold text-foreground mb-2">Delete Product</h3>
            <p className="text-sm text-muted mb-6">
              Delete <span className="font-medium text-foreground">{deleteTarget.name}</span>? This cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-lg border border-default px-5 py-2 text-xs font-medium text-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-500 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg px-5 py-3 text-sm font-medium shadow-lg animate-in slide-in-from-right ${
              t.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  warning,
  valueRed,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  warning?: boolean;
  valueRed?: boolean;
}) {
  const isWarning = warning && value > 0;
  return (
    <div className="rounded-xl border border-default bg-card p-5 flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${isWarning ? "bg-red-500/20 text-red-500" : "bg-surface text-muted"}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-xl font-bold ${valueRed && isWarning ? "text-red-500" : "text-foreground"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
