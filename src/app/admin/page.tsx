import { getAdminStats, getAdminProducts, getAdminSubscribers } from "@/lib/actions/admin";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, products, subscribers] = await Promise.all([
    getAdminStats(),
    getAdminProducts(),
    getAdminSubscribers(),
  ]);

  return (
    <AdminDashboardClient
      initialStats={stats}
      initialProducts={products}
      initialSubscribers={subscribers}
    />
  );
}
