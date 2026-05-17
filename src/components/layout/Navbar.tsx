"use client";

import Link from "next/link";
import { Search, Menu, User, X } from "lucide-react";
import CartButton from "@/components/cart/CartButton";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`;
    }
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-40 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-accent"
              />
              <button type="submit" className="text-accent hover:text-accent/80 transition-colors" aria-label="Search">
                <Search className="h-5 w-5" />
              </button>
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="hover:text-accent transition-colors" aria-label="Open search">
              <Search className="h-5 w-5" />
            </button>
          )}
          <Link href="/account" className="hover:text-accent transition-colors">
            <User className="h-5 w-5" />
          </Link>
          <CartButton />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-4 py-4 gap-4 text-sm font-medium text-neutral-300">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">Store</Link>
            <Link href="/#products" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">Products</Link>
            <Link href="/#subscribe" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors py-1">Drops</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
