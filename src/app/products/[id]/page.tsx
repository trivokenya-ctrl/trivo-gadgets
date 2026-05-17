import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) return { title: "Product Not Found | Trivo Kenya" };

  const seoTitle = product.seo_title || `${product.name} | Trivo Kenya`;
  const seoDesc = product.seo_description || product.description || `Shop ${product.name} at Trivo Kenya. Premium tech gadgets in Kenya. Best price guaranteed.`;

  return {
    title: seoTitle,
    description: seoDesc,
    keywords: product.focus_keyword || undefined,
    openGraph: {
      title: product.seo_title || `${product.name} — Trivo Kenya`,
      description: seoDesc,
      url: `https://trivokenya.store/products/${params.id}`,
      siteName: "Trivo Kenya",
      images: product.image_url ? [{ url: product.image_url, width: 1200, height: 1200 }] : [],
      locale: "en_KE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo_title || `${product.name} | Trivo Kenya`,
      description: seoDesc,
      images: product.image_url ? [product.image_url] : [],
    },
    alternates: {
      canonical: `/products/${params.id}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from("products")
    .select("*")
    .neq("id", params.id)
    .limit(4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.image_url,
            category: product.category,
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "KES",
              availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url: `https://trivokenya.store/products/${params.id}`,
            },
          }),
        }}
      />
      <ProductDetailClient product={product} relatedProducts={related || []} />
    </>
  );
}
