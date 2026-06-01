import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://betobaltazar.vercel.app';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/imoveis`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/anuncie`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  return staticPages;
}
