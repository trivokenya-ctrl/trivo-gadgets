import { createClient } from "@/lib/supabase/server";
import { Package, Users, AlertTriangle, Star } from "lucide-react";
import AdminProductsTable from "@/components/admin/AdminProductsTable";
import { Database } from "@/types/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default async function AdminDashboard() {
  const supabase = createClient();

  const productsCountRes = await supabase.from("products").select("*", { count: "exact", head: true });
  const subscribersCountRes = await supabase.from("subscribers").select("*", { count: "exact", head: true });
  const productsRes = await supabase.from("products").select("*").order("created_at", { ascending: false });

  const productsCount = productsCountRes.count;
  const subscribersCount = subscribersCountRes.count;
  const products = productsRes.data as Product[] | null;

  const stats = [
    { name: "Total Products", value: productsCount || 0, icon: Package },
    { name: "Total Subscribers", value: subscribersCount || 0, icon: Users },
    { name: "Featured Product", value: products?.find(p => p.is_featured)?.name || "None", icon: Star },
    { name: "Low Stock", value: products?.filter(p => p.stock < 3).length || 0, icon: AlertTriangle, warning: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-neutral-400">Manage your store, inventory, and subscribers.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-6 rounded-2xl bg-card border border-white/10 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.warning && stat.value > 0 ? "bg-amber-500/20 text-amber-500" : "bg-white/5 text-neutral-400"}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">{stat.name}</p>
                <p className={`text-2xl font-bold ${stat.warning && stat.value > 0 ? "text-amber-500" : "text-white"}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Inventory</h2>
            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-200 transition-colors">
              + Add Product
            </button>
          </div>
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-card">
            <AdminProductsTable initialProducts={products || []} />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Subscribers</h2>
          <div className="rounded-2xl border border-white/10 p-6 bg-card text-center space-y-4">
            <Users className="h-12 w-12 text-neutral-600 mx-auto" />
            <div>
              <p className="text-sm text-neutral-400">Reach your audience instantly.</p>
            </div>
            <button className="w-full bg-highlight hover:bg-highlight/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Broadcast Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
