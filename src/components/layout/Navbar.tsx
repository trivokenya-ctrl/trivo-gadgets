import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-foreground hover:text-accent transition-colors">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-accent transition-colors">
            TRIVO <span className="text-accent">KENYA</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <Link href="/" className="hover:text-white transition-colors">Store</Link>
          <Link href="/#products" className="hover:text-white transition-colors">Products</Link>
          <Link href="/#subscribe" className="hover:text-white transition-colors">Drops</Link>
        </nav>

        <div className="flex items-center gap-4 text-foreground">
          <button className="hover:text-accent transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="hover:text-accent transition-colors">
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
