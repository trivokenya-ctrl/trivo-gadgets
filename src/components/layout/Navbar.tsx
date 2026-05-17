"use client";

import Link from "next/link";
import { Search, Menu, User, X, Sun, Moon, ChevronDown } from "lucide-react";
import CartButton from "@/components/cart/CartButton";
import { useTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-50 w-full border-b border-default bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-foreground hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="flex items-center transition-opacity hover:opacity-90">
            <img 
              src={theme === "dark" ? "/logo-transparent.svg" : "/logo-light.svg"} 
              alt="Trivo Kenya Logo" 
              className="h-10 w-auto" 
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-subtle">
          <Link href="/" className="hover:text-foreground transition-colors py-2">Store</Link>
          
          {/* Categories Dropdown */}
          <div className="relative group py-2">
            <button className="hover:text-foreground transition-colors flex items-center gap-1 focus:outline-none">
              Categories
              <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-card border border-subtle rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
              <Link href="/categories/audio" className="block px-3 py-2 rounded-lg text-sm hover:bg-surface hover:text-accent transition-colors">Audio</Link>
              <Link href="/categories/car-accessories" className="block px-3 py-2 rounded-lg text-sm hover:bg-surface hover:text-accent transition-colors">Car Accessories</Link>
              <Link href="/categories/smart-home" className="block px-3 py-2 rounded-lg text-sm hover:bg-surface hover:text-accent transition-colors">Smart Home</Link>
              <Link href="/categories/cables" className="block px-3 py-2 rounded-lg text-sm hover:bg-surface hover:text-accent transition-colors">Cables & Chargers</Link>
            </div>
          </div>

          {/* Support Dropdown */}
          <div className="relative group py-2">
            <button className="hover:text-foreground transition-colors flex items-center gap-1 focus:outline-none">
              Support
              <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-0 hidden group-hover:block w-48 bg-card border border-subtle rounded-xl shadow-2xl p-2 animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
              <Link href="/how-to-order" className="block px-3 py-2 rounded-lg text-sm hover:bg-surface hover:text-accent transition-colors">How to Order</Link>
              <Link href="/delivery" className="block px-3 py-2 rounded-lg text-sm hover:bg-surface hover:text-accent transition-colors">Delivery Info</Link>
              <Link href="/returns" className="block px-3 py-2 rounded-lg text-sm hover:bg-surface hover:text-accent transition-colors">Returns & Warranty</Link>
              <Link href="/faq" className="block px-3 py-2 rounded-lg text-sm hover:bg-surface hover:text-accent transition-colors">FAQs</Link>
            </div>
          </div>

          <Link href="/about" className="hover:text-foreground transition-colors py-2">About Us</Link>
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
                className="w-40 bg-surface border border-default rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
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
          <button
            onClick={toggleTheme}
            className="hover:text-accent transition-colors"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <CartButton />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-default bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="flex flex-col px-6 py-6 gap-6 text-sm">
            {/* Main Links */}
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-bold text-foreground hover:text-accent transition-colors py-1">Store Home</Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="font-bold text-foreground hover:text-accent transition-colors py-1">About Trivo</Link>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Shop Collections</span>
              <div className="grid grid-cols-1 gap-2 pl-2 border-l border-default">
                <Link href="/categories/audio" onClick={() => setMobileMenuOpen(false)} className="text-subtle hover:text-accent transition-colors py-1">Audio</Link>
                <Link href="/categories/car-accessories" onClick={() => setMobileMenuOpen(false)} className="text-subtle hover:text-accent transition-colors py-1">Car Accessories</Link>
                <Link href="/categories/smart-home" onClick={() => setMobileMenuOpen(false)} className="text-subtle hover:text-accent transition-colors py-1">Smart Home</Link>
                <Link href="/categories/cables" onClick={() => setMobileMenuOpen(false)} className="text-subtle hover:text-accent transition-colors py-1">Cables & Chargers</Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Customer Support</span>
              <div className="grid grid-cols-1 gap-2 pl-2 border-l border-default">
                <Link href="/how-to-order" onClick={() => setMobileMenuOpen(false)} className="text-subtle hover:text-accent transition-colors py-1">How to Order</Link>
                <Link href="/delivery" onClick={() => setMobileMenuOpen(false)} className="text-subtle hover:text-accent transition-colors py-1">Delivery Information</Link>
                <Link href="/returns" onClick={() => setMobileMenuOpen(false)} className="text-subtle hover:text-accent transition-colors py-1">Returns & Warranty</Link>
                <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="text-subtle hover:text-accent transition-colors py-1">FAQs & Help</Link>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
