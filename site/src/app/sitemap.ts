// Sitemap for vfclamp.com — single-page site
// lastModified is a fixed ISO string updated manually on significant content changes;
// using new Date() would produce a perpetually-changing timestamp on every build.
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://vfclamp.com',
			lastModified: '2026-05-31',
			changeFrequency: 'monthly',
			priority: 1,
		},
		{
			url: 'https://vfclamp.com/talk',
			lastModified: '2026-10-03',
			changeFrequency: 'monthly',
			priority: 0.6,
		},
		{
			url: 'https://vfclamp.com/talk/paper',
			lastModified: '2026-10-03',
			changeFrequency: 'monthly',
			priority: 0.7,
		},
		{
			url: 'https://vfclamp.com/talk/data',
			lastModified: '2026-10-03',
			changeFrequency: 'monthly',
			priority: 0.5,
		},
	]
}
