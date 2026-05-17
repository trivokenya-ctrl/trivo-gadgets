import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, User, Bell, LogOut, ShoppingBag, Clock } from "lucide-react";
import { format } from "date-fns";

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.id) redirect("/auth/login");

  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const customerId = customer?.id ?? "";
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-md px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight text-foreground">
          TRIVO <span className="text-accent">KENYA</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
            Back to Store
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm font-medium text-muted hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
            <User className="h-6 w-6 text-accent" />
            My Account
          </h1>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="bg-card/50 border border-default rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Profile</p>
                  <p className="text-foreground font-medium text-sm">{customer?.full_name || "Add name"}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted">
                <p>{user.email}</p>
                <p>{customer?.phone || "Add phone"}</p>
                <p className="text-xs text-muted-foreground">
                  Joined {customer?.created_at ? format(new Date(customer.created_at), "MMM yyyy") : "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-card/50 border border-default rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Orders</p>
                  <p className="text-foreground font-medium text-2xl">{orders?.length || 0}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">All orders placed via WhatsApp</p>
            </div>

            <div className="bg-card/50 border border-default rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Notifications</p>
                  <p className="text-foreground font-medium text-sm">Push alerts</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Stay updated on drops &amp; orders</p>
            </div>
          </div>

          <div className="bg-card/50 border border-default rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-accent" />
              Order History
            </h2>

            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between bg-overlay-heavy/50 rounded-lg p-4 border border-subtle"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground font-medium">
                          KES {order.total.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(order.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        order.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-400"
                          : order.status === "completed"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-neutral-500/10 text-neutral-400"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No orders yet</p>
                <Link
                  href="/"
                  className="text-accent text-sm hover:underline inline-block mt-2"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
