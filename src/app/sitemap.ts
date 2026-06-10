import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://hscesut.vercel.app', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://hscesut.vercel.app/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://hscesut.vercel.app/departments', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://hscesut.vercel.app/events', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://hscesut.vercel.app/gallery', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://hscesut.vercel.app/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://hscesut.vercel.app/give', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
