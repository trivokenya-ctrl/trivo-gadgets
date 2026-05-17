import Link from "next/link";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {user && (
        <header className="sticky top-0 z-40 border-b border-default bg-background/80 backdrop-blur-md px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/admin" className="text-xl font-bold tracking-tight text-foreground">
            TRIVO <span className="text-accent">ADMIN</span>
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
        </header>
      )}
      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
