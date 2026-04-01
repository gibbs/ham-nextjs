declare module 'ical' {
	export interface VEventEntry {
		type: 'VEVENT'
		summary?: string
		location?: string
		description?: string
		start?: Date
	}

	export interface CalendarEntry {
		type?: string
		summary?: string
		location?: string
		description?: string
		start?: Date
	}

	export function parseICS(input: string): Record<string, CalendarEntry>

	const ical: {
		parseICS: typeof parseICS
	}

	export default ical
}
