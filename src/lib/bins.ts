import type { BinCollection } from '@/types'

interface RawBinItem {
	type: string
	collectionDate?: string
}

interface RawBinResponse {
	bins?: RawBinItem[]
}

function normalizeBinType(type: string): string {
	const normalizedType = type.toLowerCase()

	if (
		normalizedType.includes('refuse') ||
		normalizedType.includes('black') ||
		normalizedType.includes('general')
	) {
		return 'Black Bin'
	}

	return type
}

const MONTH_INDEX: Record<string, number> = {
	january: 0,
	february: 1,
	march: 2,
	april: 3,
	may: 4,
	june: 5,
	july: 6,
	august: 7,
	september: 8,
	october: 9,
	november: 10,
	december: 11,
}

/**
 * Splits compound strings like "Today then Wednesday 8th April, Tuesday 14th April"
 * into individual date-per-item entries so every date shows in the dashboard.
 */
function expandCollectionDates(item: RawBinItem): RawBinItem[] {
	const dateValue = item.collectionDate?.trim() ?? ''

	if (!dateValue) {
		return []
	}

	const parts = dateValue.split(/\s+then\s+|,\s+|\s+and\s+/i)

	if (parts.length <= 1) {
		return [{ ...item, collectionDate: dateValue }]
	}

	return parts.map((part) => ({ type: item.type, collectionDate: part.trim() }))
}

function normalizeRawItem(item: RawBinItem): RawBinItem {
	const rawType = item.type?.trim() ?? ''
	const rawDate = item.collectionDate?.trim() ?? ''

	if (rawDate) {
		return { type: rawType, collectionDate: rawDate }
	}

	const colonIndex = rawType.indexOf(':')

	if (colonIndex === -1) {
		return { type: rawType, collectionDate: rawDate }
	}

	const parsedType = rawType.slice(0, colonIndex).trim()
	const parsedDate = rawType.slice(colonIndex + 1).trim()

	return {
		type: parsedType || rawType,
		collectionDate: parsedDate,
	}
}

function normalizePayload(
	payload: RawBinItem[] | RawBinResponse | string
): RawBinItem[] {
	if (typeof payload === 'string') {
		return normalizePayload(
			JSON.parse(payload) as RawBinItem[] | RawBinResponse
		)
	}

	const items = Array.isArray(payload) ? payload : (payload.bins ?? [])

	return items.map(normalizeRawItem).flatMap(expandCollectionDates)
}

function parseBinDate(dateStr: string): Date {
	const trimmed = dateStr.trim()
	const lower = trimmed.toLowerCase()

	// Handles 'Today' appearing anywhere in text, e.g. 'Wednesday 8th April (Today)'
	if (/\btoday\b/i.test(lower)) {
		const d = new Date()
		d.setHours(0, 0, 0, 0)

		return d
	}

	// Handles 'Tomorrow' appearing anywhere in text
	if (/\btomorrow\b/i.test(lower)) {
		const d = new Date()
		d.setHours(0, 0, 0, 0)
		d.setDate(d.getDate() + 1)

		return d
	}

	// Handles DD/MM/YYYY
	if (trimmed.includes('/')) {
		const [day, month, year] = trimmed.split('/').map(Number)

		return new Date(year, month - 1, day)
	}

	// Handles human-readable ordinal dates like "Wednesday 8th April" or "8th April 2026"
	const stripped = trimmed
		.replace(/(\d+)(st|nd|rd|th)/gi, '$1')
		.replace(
			/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\s+/i,
			''
		)
		.replace(/[()]/g, '')
		.trim()

	const m = stripped.match(/^(\d{1,2})\s+([a-z]+)(?:\s+(\d{4}))?$/i)

	if (m) {
		const day = parseInt(m[1], 10)
		const month = MONTH_INDEX[m[2].toLowerCase()]
		const year = m[3] ? parseInt(m[3], 10) : new Date().getFullYear()

		if (month !== undefined) {
			return new Date(year, month, day)
		}
	}

	return new Date(trimmed)
}

export async function fetchBinsData(): Promise<BinCollection[]> {
	const baseUrl = process.env.BIN_SERVICE_URL
	const council = process.env.BIN_COLLECTION_COUNCIL
	const collectionUrl = process.env.BIN_COLLECTION_URL
	const uprn = process.env.BIN_COLLECTION_UPRN

	if (!baseUrl || !council || !collectionUrl || !uprn) {
		throw new Error('Bin collection service not configured')
	}

	const apiUrl =
		`${baseUrl}${council}` +
		`?url=${encodeURIComponent(collectionUrl)}&uprn=${uprn}`

	const res = await fetch(apiUrl, { next: { revalidate: 21600 } })

	if (!res.ok) {
		throw new Error(`Bin service returned ${res.status}`)
	}

	const payload = (await res.json()) as RawBinItem[] | RawBinResponse | string
	const data = normalizePayload(payload)

	const today = new Date()
	today.setHours(0, 0, 0, 0)

	const upcoming = data
		.map((item) => {
			if (!item.collectionDate) {
				return null
			}

			const date = parseBinDate(item.collectionDate)

			if (Number.isNaN(date.getTime())) {
				return null
			}

			date.setHours(0, 0, 0, 0)
			const daysUntil = Math.round(
				(date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
			)

			return {
				type: normalizeBinType(item.type),
				date: item.collectionDate,
				daysUntil,
			}
		})
		.filter((b): b is BinCollection => b !== null)
		.filter((b) => b.daysUntil >= 0)

	const nextByType = new Map<string, BinCollection>()

	for (const entry of upcoming) {
		const existing = nextByType.get(entry.type)

		if (!existing || entry.daysUntil < existing.daysUntil) {
			nextByType.set(entry.type, entry)
		}
	}

	return Array.from(nextByType.values()).sort(
		(a, b) => a.daysUntil - b.daysUntil
	)
}
