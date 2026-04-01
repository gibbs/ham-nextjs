import type { Fixture } from '@/types'
import ical from 'ical'

const FIXTURES_URL =
	'https://www.bcfc.co.uk/wp-json/afz/v1/fixtures/ical/upcoming/men'

function parseSummary(summary: string): {
	homeTeam: string
	awayTeam: string
	competition: string | null
} | null {
	const match = summary.match(/^(.*?)\s+vs?\s+(.*?)(?:\s+-\s+(.*))?$/i)

	if (!match) {
		return null
	}

	const [, homeTeam, awayTeam, competition] = match

	return {
		homeTeam: homeTeam.trim(),
		awayTeam: awayTeam.trim(),
		competition: competition?.trim() ?? null,
	}
}

function getCompetition(summary: string, description: string): string {
	const parsedSummary = parseSummary(summary)

	if (parsedSummary?.competition) {
		return parsedSummary.competition
	}

	const cleanDescriptionLines = description
		.replace(/\\n/g, '\n')
		.split('\n')
		.map((line) => line.trim())
		.filter(
			(line) => line.length > 0 && !line.startsWith('See more details at ')
		)

	return cleanDescriptionLines[0] ?? 'Championship'
}

function parseICal(icalText: string): Fixture | null {
	const events = Object.values(ical.parseICS(icalText))

	for (const event of events) {
		if (!event || event.type !== 'VEVENT') {
			continue
		}

		const summary = typeof event.summary === 'string' ? event.summary : ''
		const location = typeof event.location === 'string' ? event.location : ''
		const description =
			typeof event.description === 'string' ? event.description : ''
		const startDate = event.start instanceof Date ? event.start : null

		if (!summary || !startDate) {
			continue
		}

		if (!startDate || startDate < new Date()) {
			continue
		}

		const parsedSummary = parseSummary(summary)

		if (!parsedSummary) {
			continue
		}

		const { homeTeam, awayTeam } = parsedSummary
		const isHome = homeTeam.toLowerCase().includes('bristol city')
		const competition = getCompetition(summary, description)

		const pad = (n: number) => String(n).padStart(2, '0')
		const date = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`
		const time = `${pad(startDate.getHours())}:${pad(startDate.getMinutes())}`

		return {
			homeTeam,
			awayTeam,
			date,
			time,
			competition,
			venue: location || (isHome ? 'Ashton Gate Stadium' : 'Away'),
			isHome,
		}
	}

	return null
}

export async function fetchFixturesData(): Promise<Fixture | null> {
	const res = await fetch(FIXTURES_URL, { next: { revalidate: 10800 } })

	if (!res.ok) {
		throw new Error(`Fixtures API returned ${res.status}`)
	}

	const ical = await res.text()
	return parseICal(ical)
}
