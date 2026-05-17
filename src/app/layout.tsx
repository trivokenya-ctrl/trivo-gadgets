import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CartDrawer from "@/components/cart/CartDrawer";
import ChatWidget from "@/components/chat/ChatWidget";
import PushNotificationPrompt from "@/components/notifications/PushNotificationPrompt";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = "https://trivokenya.store";
const siteName = "Trivo Kenya";
const siteDescription = "Premium tech gadgets, smart home devices, and accessories in Kenya. Shop the latest drops with fast delivery nationwide.";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Premium Tech Gadgets`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteName,
  },
  openGraph: {
    title: `${siteName} | Premium Tech Gadgets`,
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Premium Tech Gadgets`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: ["premium tech gadgets Kenya", "smart home devices Kenya", "tech accessories Kenya", "Trivo Kenya", "online gadget store Kenya"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="color-scheme" content="dark light" />
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var e=localStorage.getItem("trivo_theme")||"dark";document.documentElement.className=e}catch(e){}})()`,
        }} />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased min-h-screen flex flex-col overflow-x-hidden selection:bg-accent selection:text-black`}>
        <ThemeProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
          <ChatWidget />
          <PushNotificationPrompt />
        </ThemeProvider>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: siteName,
              url: siteUrl,
              description: siteDescription,
              image: `${siteUrl}/icons/icon-512x512.svg`,
              address: { "@type": "PostalAddress", addressCountry: "KE" },
              priceRange: "KES 500 - KES 500,000",
            }),
          }}
        />

        {/* PWA Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
