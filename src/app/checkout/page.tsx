"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { generateCartWhatsAppLink } from "@/lib/config";
import { ChevronRight, ShoppingBag, MapPin, Phone, User, MessageCircle, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [placed, setPlaced] = useState(false);

  const handlePlaceOrder = () => {
    const checkoutItems = items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price }));
    const link = generateCartWhatsAppLink(checkoutItems, cartTotal);
    const note = orderNote ? `\n\n*Note:* ${orderNote}` : "";
    const customerInfo = `\n\n*Customer:* ${name}\n*Phone:* ${phone}\n*Location:* ${location}`;
    const fullLink = link.replace("Please confirm availability.", `Please confirm availability.${customerInfo}${note}`);
    window.open(fullLink, "_blank");
    clearCart();
    setPlaced(true);
  };

  if (placed) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Order Submitted!</h1>
            <p className="text-muted text-sm mb-2">
              We&apos;ve opened WhatsApp with your order details. Send the message and our team will confirm your order within minutes.
            </p>
            <p className="text-muted-foreground text-xs mb-8">
              Have questions? Reply directly on the WhatsApp chat.
            </p>
            <Link
              href="/"
              className="inline-block rounded-full bg-accent text-black px-8 py-3.5 text-sm font-bold transition-all hover:scale-105 active:scale-95"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-accent transition-colors">Store</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>

          <h1 className="text-3xl font-extrabold text-foreground mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Customer Details Form */}
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-2xl border border-default bg-card p-6 space-y-5">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Delivery Details
                </h2>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full bg-background border border-default rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      required
                      className="w-full bg-background border border-default rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Delivery Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Westlands, Nairobi"
                      required
                      className="w-full bg-background border border-default rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Order Note (optional)</label>
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Any specific delivery time or instructions?"
                    rows={2}
                    className="w-full bg-background border border-default rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-default bg-card p-6 sticky top-24 space-y-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-accent" />
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-14 w-12 shrink-0 rounded-lg overflow-hidden bg-surface">
                        <Image
                          src={item.image_url || "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-xs font-semibold text-foreground shrink-0">
                        KES {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-subtle pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">KES {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery (Nairobi)</span>
                    <span className="font-semibold text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-subtle pt-2 mt-2">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-lg text-foreground">KES {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={!name || !phone || !location || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
                >
                  <MessageCircle className="h-5 w-5" />
                  Place Order via WhatsApp
                </button>

                <p className="text-[11px] text-muted-foreground text-center">
                  You&apos;ll be redirected to WhatsApp to confirm your order. Our team will respond within minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
