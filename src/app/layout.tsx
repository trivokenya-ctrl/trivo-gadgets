import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Trivo Kenya | Premium Tech Gadgets",
  description: "Get exclusive premium tech gadgets, smart home devices, and accessories in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
