import { WHATSAPP_NUMBER } from "@/lib/config";
import { MessageCircle, Camera, Globe, X } from "lucide-react";
import Link from "next/link";

const socials = [
  { href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: MessageCircle, label: "WhatsApp", hoverColor: "hover:text-accent" },
  { href: "https://instagram.com/trivokenya", icon: Camera, label: "Instagram", hoverColor: "hover:text-pink-500" },
  { href: "https://x.com/trivokenya", icon: X, label: "X", hoverColor: "hover:text-blue-400" },
  { href: "https://linkedin.com/company/trivokenya", icon: Globe, label: "LinkedIn", hoverColor: "hover:text-blue-600" },
];

export default function Footer() {
  return (
    <footer className="border-t border-default bg-card py-16 text-sm">
      <div className="container mx-auto px-4 md:px-8">
        {/* Apple-style Multi-column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-block transition-opacity hover:opacity-90">
              <img 
                src="/logo-transparent.svg" 
                alt="Trivo Kenya Logo" 
                className="h-10 w-auto" 
              />
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              Your reliable store for genuine tech gadgets in Kenya. Easy WhatsApp ordering, free Nairobi delivery, and pay on delivery.
            </p>
            <div className="flex gap-4 pt-2">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-subtle transition-colors ${s.hoverColor}`}
                    aria-label={s.label}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Shop Collections</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/categories/audio" className="hover:text-accent transition-colors">Audio Equipment</Link>
              </li>
              <li>
                <Link href="/categories/car-accessories" className="hover:text-accent transition-colors">Car Upgrades</Link>
              </li>
              <li>
                <Link href="/categories/smart-home" className="hover:text-accent transition-colors">Smart Home Tech</Link>
              </li>
              <li>
                <Link href="/categories/cables" className="hover:text-accent transition-colors">Cables & Charging</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Customer Support</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/how-to-order" className="hover:text-accent transition-colors">How to Order</Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-accent transition-colors">Delivery Information</Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-accent transition-colors">Returns & Guarantee</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-accent transition-colors">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Contact / Location */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Corporate</h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">About Trivo Kenya</Link>
              </li>
              <li>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="hover:text-accent transition-colors flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp Concierge
                </a>
              </li>
              <li className="text-[11px] text-muted-foreground/75 leading-relaxed pt-2">
                <span>📍 Dispatch Hubs: Nairobi, Kenya</span>
                <br />
                <span>🚚 Free Delivery in Nairobi</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="border-t border-subtle pt-8 text-center text-[11px] text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Trivo Kenya. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Terms of Service</Link>
            <Link href="/" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
