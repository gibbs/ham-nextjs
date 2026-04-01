import Parser from 'rss-parser'
import type { NewsArticle } from '@/types'

const NEWS_FEED_URL = 'https://feeds.bbci.co.uk/news/rss.xml'

interface MediaThumbnail {
	$: {
		url?: string
	}
}

interface BbcNewsFeedItem {
	title?: string
	contentSnippet?: string
	summary?: string
	link?: string
	pubDate?: string
	mediaThumbnail?: MediaThumbnail[]
	enclosure?: {
		url?: string
	}
}

export async function fetchNewsData(): Promise<NewsArticle[]> {
	const parser = new Parser<Record<string, never>, BbcNewsFeedItem>({
		customFields: {
			item: [
				['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
				['enclosure', 'enclosure'],
			],
		},
	})
	const feed = await parser.parseURL(NEWS_FEED_URL)

	return (feed.items ?? []).slice(0, 10).map((item) => ({
		title: item.title ?? '',
		description: item.contentSnippet ?? item.summary ?? '',
		link: item.link ?? '',
		pubDate: item.pubDate ?? '',
		source: feed.title ?? 'BBC News',
		thumbnailUrl:
			item.mediaThumbnail?.[0]?.$?.url ?? item.enclosure?.url ?? undefined,
	}))
}
