const BADGE_URLS: Record<string, string> = {
	'bristol city':
		'https://upload.wikimedia.org/wikipedia/en/f/f5/Bristol_City_crest.svg',
}

function normalizeClubName(name: string): string {
	return name
		.toLowerCase()
		.replace(/\s+fc$/i, '')
		.trim()
}

function fallbackBadgeDataUri(name: string): string {
	const initials = name
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join('')
		.slice(0, 2)

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><rect width="72" height="72" rx="18" fill="#111827" stroke="#374151" stroke-width="3"/><text x="36" y="42" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#f3f4f6">${initials}</text></svg>`

	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export function getClubBadgeUrl(name: string): string {
	const normalizedName = normalizeClubName(name)
	return BADGE_URLS[normalizedName] ?? fallbackBadgeDataUri(name)
}
