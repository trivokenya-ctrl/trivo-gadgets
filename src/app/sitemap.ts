import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Fetch all products dynamically so new products appear in sitemap automatically
  const { data: products } = await supabase
    .from('products')
    .select('id, category, created_at')

  const productUrls: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `https://trivokenya.store/products/${product.id}`,
    lastModified: new Date(product.created_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Extract unique categories for category pages
  const categories = Array.from(new Set((products || []).map(p => p.category).filter(Boolean)))
  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `https://trivokenya.store/categories/${encodeURIComponent(cat!.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    {
      url: 'https://trivokenya.store',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://trivokenya.store/products',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://trivokenya.store/how-to-order',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://trivokenya.store/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://trivokenya.store/delivery',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://trivokenya.store/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://trivokenya.store/returns',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://trivokenya.store/reviews',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    ...categoryUrls,
    ...productUrls,
  ]
}
