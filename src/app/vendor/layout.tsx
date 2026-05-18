import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/vendor");
  }

  // Verify user is a vendor
  if (!user.email) redirect("/vendor");

  const { data: vendor } = await supabase
    .from("vendors")
    .select("id, business_name, status")
    .eq("email", user.email)
    .single();

  if (!vendor) {
    redirect("/vendor");
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b border-default bg-background/80 backdrop-blur-md px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/vendor/dashboard" className="text-lg font-bold tracking-tight text-foreground">
            TRIVO <span className="text-accent">VENDOR</span>
          </Link>
          <span className="text-xs text-muted-foreground px-3 py-1 rounded-full bg-surface">
            {vendor.business_name || "Vendor"}
          </span>
        </div>
        <form action="/auth/signout" method="post">
          <input type="hidden" name="redirect" value="/vendor" />
          <button
            type="submit"
            className="flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </form>
      </header>
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
