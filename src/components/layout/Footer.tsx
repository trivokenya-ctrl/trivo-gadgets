import { WHATSAPP_NUMBER } from "@/lib/config";
import { MessageCircle, Camera, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

const socials = [
  { href: `https://wa.me/${WHATSAPP_NUMBER}`, icon: MessageCircle, label: "WhatsApp", hoverColor: "hover:text-accent" },
  { href: "https://instagram.com/trivokenya", icon: Camera, label: "Instagram", hoverColor: "hover:text-pink-500" },
  { href: "https://x.com/trivokenya", icon: Twitter, label: "X / Twitter", hoverColor: "hover:text-blue-400" },
  { href: "https://linkedin.com/company/trivokenya", icon: Linkedin, label: "LinkedIn", hoverColor: "hover:text-blue-600" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background py-12">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white mb-2">
            TRIVO <span className="text-accent">KENYA</span>
          </Link>
          <p className="text-neutral-400 text-sm">
            Premium tech drops, delivered fast.
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
                className={`flex items-center gap-2 text-neutral-300 ${s.hoverColor} transition-colors`}
                aria-label={s.label}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </a>
            );
          })}
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 mt-8 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} Trivo Kenya. All rights reserved.
      </div>
    </footer>
  );
}
