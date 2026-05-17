import { WHATSAPP_NUMBER } from "@/lib/config";
import { MessageCircle, Camera, Globe, X } from "lucide-react";
import Link from "next/link";

const socials = [
  { href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: MessageCircle, label: "WhatsApp", hoverColor: "hover:text-accent" },
  { href: "https://instagram.com/trivokenya", icon: Camera, label: "Instagram", hoverColor: "hover:text-pink-500" },
  { href: "https://x.com/trivokenya", icon: X, label: "X / Twitter", hoverColor: "hover:text-blue-400" },
  { href: "https://linkedin.com/company/trivokenya", icon: Globe, label: "LinkedIn", hoverColor: "hover:text-blue-600" },
];

export default function Footer() {
  return (
    <footer className="border-t border-default bg-background py-12">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="flex items-center gap-3 text-foreground mb-2">
            <svg width="24" height="22" viewBox="0 0 36 32" fill="none" className="flex-shrink-0">
              <polygon points="18,3 3,29 33,29" stroke="#2563EB" strokeWidth="3.5" strokeLinejoin="round"/>
              <polygon points="18,14 10,29 26,29" fill="#2563EB" fillOpacity="0.2"/>
            </svg>
            <span className="text-2xl font-bold tracking-tight">TRIVO KENYA</span>
          </Link>
          <p className="text-muted text-sm">
            Kenya&apos;s gadget store — chat, order, delivered.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-subtle ${s.hoverColor} transition-colors`}
                aria-label={s.label}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </a>
            );
          })}
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Trivo Kenya. All rights reserved.
      </div>
    </footer>
  );
}
