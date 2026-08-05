import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://frostedforksweets.com'

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/build-your-own`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/pick-your-cake`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/custom-orders`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/meet-the-baker`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/whats-baking`,
      lastModified: new Date(),
    },
  ]
}
