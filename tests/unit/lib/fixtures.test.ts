/**
 * @jest-environment node
 */
import fetchMock from 'jest-fetch-mock'
import { fetchFixturesData } from '@/lib/fixtures'

fetchMock.enableMocks()

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() + 30)
const yr = futureDate.getUTCFullYear()
const mo = String(futureDate.getUTCMonth() + 1).padStart(2, '0')
const dy = String(futureDate.getUTCDate()).padStart(2, '0')

const mockICal = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BCFC//Fixtures//EN
BEGIN:VEVENT
DTSTART:${yr}${mo}${dy}T190000Z
DTEND:${yr}${mo}${dy}T210000Z
SUMMARY:Bristol City vs West Brom - Sky Bet Championship
DESCRIPTION:See more details at https://www.bcfc.co.uk/match-centre/fixtures/example/
LOCATION:Ashton Gate Stadium
UID:fixture-1@bcfc.co.uk
END:VEVENT
END:VCALENDAR`

const pastICal = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20200101T190000Z
DTEND:20200101T210000Z
SUMMARY:Bristol City v Reading
DESCRIPTION:Championship
LOCATION:Ashton Gate Stadium
UID:past-1@bcfc.co.uk
END:VEVENT
END:VCALENDAR`

beforeEach(() => {
	fetchMock.resetMocks()
})

describe('fetchFixturesData', () => {
	it('parses a future fixture correctly', async () => {
		fetchMock.mockResponseOnce(mockICal)

		const fixture = await fetchFixturesData()

		expect(fixture).not.toBeNull()
		expect(fixture?.homeTeam).toBe('Bristol City')
		expect(fixture?.awayTeam).toBe('West Brom')
		expect(fixture?.venue).toBe('Ashton Gate Stadium')
		expect(fixture?.isHome).toBe(true)
		expect(fixture?.competition).toBe('Sky Bet Championship')
	})

	it('returns null when all fixtures are in the past', async () => {
		fetchMock.mockResponseOnce(pastICal)
		const fixture = await fetchFixturesData()

		expect(fixture).toBeNull()
	})

	it('returns null when iCal is empty', async () => {
		fetchMock.mockResponseOnce('BEGIN:VCALENDAR\nEND:VCALENDAR')
		const fixture = await fetchFixturesData()

		expect(fixture).toBeNull()
	})

	it('throws when the API returns an error', async () => {
		fetchMock.mockResponseOnce('', { status: 503 })

		await expect(fetchFixturesData()).rejects.toThrow(
			'Fixtures API returned 503'
		)
	})

	it('identifies away fixtures', async () => {
		const awayICal = mockICal.replace(
			'Bristol City vs West Brom - Sky Bet Championship',
			'West Brom vs Bristol City - Sky Bet Championship'
		)
		fetchMock.mockResponseOnce(awayICal)
		const fixture = await fetchFixturesData()

		expect(fixture?.isHome).toBe(false)
		expect(fixture?.homeTeam).toBe('West Brom')
		expect(fixture?.awayTeam).toBe('Bristol City')
	})
})
