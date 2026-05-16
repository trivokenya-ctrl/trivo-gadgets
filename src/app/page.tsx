/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ProductGrid from "@/components/product/ProductGrid";
import SubscribeSection from "@/components/home/SubscribeSection";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function Home() {
  const supabase = createClient();

  const { data: products } = await (supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false }) as any);

  const featuredProduct = products?.find((p: any) => p.is_featured) || products?.[0] || null;
  const gridProducts = products?.filter((p: any) => p.id !== featuredProduct?.id) || [];

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero product={featuredProduct} />
        <ProductGrid products={gridProducts} />
        <SubscribeSection />
      </main>
      <Footer />
    </>
  );
}
