/**
 * @jest-environment node
 */
import fetchMock from 'jest-fetch-mock'
import { fetchBinsData } from '@/lib/bins'

fetchMock.enableMocks()

const mockBinsResponse = [
	{ type: 'Black Bin', collectionDate: '07/04/2026' },
	{ type: 'Recycling', collectionDate: '14/04/2026' },
]

const ENV = {
	BIN_SERVICE_URL: 'http://localhost:8080/api/bin_collection/',
	BIN_COLLECTION_COUNCIL: 'TorridgeDistrictCouncil',
	BIN_COLLECTION_URL: 'https://example.com/service',
	BIN_COLLECTION_UPRN: '12345',
}

beforeEach(() => {
	fetchMock.resetMocks()
	Object.assign(process.env, ENV)
})

describe('fetchBinsData', () => {
	it('returns sorted upcoming collections', async () => {
		fetchMock.mockResponseOnce(JSON.stringify({ bins: mockBinsResponse }))

		const result = await fetchBinsData()

		expect(result.length).toBeGreaterThanOrEqual(1)
		result.forEach((b) => expect(b.daysUntil).toBeGreaterThanOrEqual(0))

		for (let i = 1; i < result.length; i++) {
			expect(result[i].daysUntil).toBeGreaterThanOrEqual(
				result[i - 1].daysUntil
			)
		}
	})

	it('throws when env vars are missing', async () => {
		delete process.env.BIN_SERVICE_URL

		await expect(fetchBinsData()).rejects.toThrow(
			'Bin collection service not configured'
		)
	})

	it('throws when bin service returns an error', async () => {
		fetchMock.mockResponseOnce('', { status: 503 })

		await expect(fetchBinsData()).rejects.toThrow('Bin service returned 503')
	})

	it('filters out past collections', async () => {
		const past = [
			{ type: 'Black Bin', collectionDate: '01/01/2020' },
			{ type: 'Recycling', collectionDate: '14/04/2026' },
		]
		fetchMock.mockResponseOnce(JSON.stringify({ bins: past }))

		const result = await fetchBinsData()
		expect(result.every((b) => b.daysUntil >= 0)).toBe(true)
	})

	it('supports both object and array response shapes', async () => {
		fetchMock.mockResponseOnce(JSON.stringify(mockBinsResponse))

		const result = await fetchBinsData()

		expect(result).toHaveLength(2)
	})

	it('supports string-wrapped JSON responses from the bins service', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify(JSON.stringify({ bins: mockBinsResponse }))
		)

		const result = await fetchBinsData()

		expect(result).toHaveLength(2)
	})

	it('normalizes Refuse to Black Bin', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				bins: [{ type: 'Refuse', collectionDate: '07/04/2026' }],
			})
		)

		const result = await fetchBinsData()

		expect(result[0]?.type).toBe('Black Bin')
	})

	it('handles "Today" literal as daysUntil 0', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				bins: [
					{ type: 'Recycling', collectionDate: 'Today' },
					{ type: 'Black Bin', collectionDate: '14/04/2026' },
				],
			})
		)

		const result = await fetchBinsData()

		expect(result[0]?.type).toBe('Recycling')
		expect(result[0]?.daysUntil).toBe(0)
	})

	it('handles "Tomorrow" literal as daysUntil 1', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				bins: [{ type: 'Black Bin', collectionDate: 'Tomorrow' }],
			})
		)

		const result = await fetchBinsData()

		expect(result[0]?.daysUntil).toBe(1)
	})

	it('expands compound "Today then X, Y" collectionDate into multiple entries', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				bins: [
					{
						type: 'Recycling',
						collectionDate:
							'Today then Wednesday 8th April, Tuesday 14th April',
					},
				],
			})
		)

		const result = await fetchBinsData()
		const recycling = result.filter((b) => b.type === 'Recycling')

		expect(recycling.length).toBeGreaterThanOrEqual(1)
		expect(recycling[0]?.daysUntil).toBe(0)
	})

	it('parses human-readable ordinal dates like "Wednesday 8th April"', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				bins: [{ type: 'Recycling', collectionDate: 'Wednesday 8th April' }],
			})
		)

		const result = await fetchBinsData()

		expect(result[0]?.type).toBe('Recycling')
		expect(result[0]?.daysUntil).toBeGreaterThan(0)
	})

	it('parses service rows where date is embedded in the type string', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				bins: [
					{
						type: 'Recycling: Today then Wednesday 8th April, Tuesday 14th April',
						collectionDate: '',
					},
				],
			})
		)

		const result = await fetchBinsData()

		expect(result.find((b) => b.type === 'Recycling')?.daysUntil).toBe(0)
	})

	it('handles today token when not at the start of the date text', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				bins: [
					{
						type: 'Recycling',
						collectionDate: 'Wednesday 8th April (Today)',
					},
				],
			})
		)

		const result = await fetchBinsData()

		expect(result.find((b) => b.type === 'Recycling')?.daysUntil).toBe(0)
	})

	it('splits compound dates separated by and', async () => {
		fetchMock.mockResponseOnce(
			JSON.stringify({
				bins: [
					{
						type: 'Recycling',
						collectionDate:
							'Today and Wednesday 8th April and Tuesday 14th April',
					},
				],
			})
		)

		const result = await fetchBinsData()
		const recycling = result.filter((b) => b.type === 'Recycling')

		expect(recycling.length).toBeGreaterThanOrEqual(1)
		expect(recycling[0]?.daysUntil).toBe(0)
	})
})
