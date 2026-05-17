import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/account', '/account/', '/api/'],
      },
    ],
    sitemap: 'https://trivokenya.store/sitemap.xml',
    host: 'https://trivokenya.store',
  }
}
