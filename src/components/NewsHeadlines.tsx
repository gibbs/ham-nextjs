'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { NewsArticle } from '@/types'

interface Props {
	articles: NewsArticle[]
}

function timeAgo(pubDate: string): string {
	if (!pubDate) {
		return ''
	}

	const diff = Date.now() - new Date(pubDate).getTime()
	const mins = Math.floor(diff / 60000)

	if (mins < 60) {
		return `${mins}m ago`
	}

	const hrs = Math.floor(mins / 60)

	if (hrs < 24) {
		return `${hrs}h ago`
	}

	return `${Math.floor(hrs / 24)}d ago`
}

export default function NewsHeadlines({ articles }: Props) {
	const t = useTranslations('news')

	if (!articles.length) {
		return (
			<div className="card text-sm text-gray-500" data-testid="news-headlines">
				{t('noNews')}
			</div>
		)
	}

	return (
		<div className="card flex flex-col" data-testid="news-headlines">
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-xs font-medium uppercase tracking-widest text-gray-500">
					{articles[0]?.source ?? t('fallbackSource')}
				</h2>
			</div>

			<ul className="flex flex-col divide-y divide-white/5">
				{articles.map((article, i) => {
					return (
						<li key={i} className="py-3 first:pt-0 last:pb-0">
							<a
								href={article.link}
								target="_blank"
								rel="noopener noreferrer"
								className="group flex gap-3"
							>
								{article.thumbnailUrl ? (
									<Image
										src={article.thumbnailUrl}
										alt={`${article.title} thumbnail`}
										width={96}
										height={64}
										className="h-16 w-24 shrink-0 rounded-md object-cover"
										loading="lazy"
										unoptimized
									/>
								) : null}
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium leading-snug text-gray-200 transition-colors group-hover:text-blue-400">
										{article.title}
									</p>
									{article.description && (
										<p className="mt-1 line-clamp-2 text-xs text-gray-500">
											{article.description}
										</p>
									)}
									<p className="mt-1 text-xs text-gray-600">
										{timeAgo(article.pubDate)}
									</p>
								</div>
							</a>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
