/**
 * @jest-environment node
 */
import { GET } from '@/app/api/data/route'

jest.mock('@/lib/weather', () => ({
	fetchWeatherData: jest.fn().mockResolvedValue({
		current: {
			temperature: 12,
			windspeed: 10,
			weathercode: 2,
			description: 'Partly cloudy',
			humidity: 68,
		},
		pollen: { level: 'Low', dominant: 'Grass', value: 20 },
		forecast: [],
	}),
}))

jest.mock('@/lib/bins', () => ({
	fetchBinsData: jest.fn().mockResolvedValue([
		{
			type: 'Black Bin',
			date: '07/04/2026',
			daysUntil: 6,
		},
	]),
}))

jest.mock('@/lib/fixtures', () => ({
	fetchFixturesData: jest.fn().mockResolvedValue(null),
}))

jest.mock('@/lib/news', () => ({
	fetchNewsData: jest.fn().mockResolvedValue([
		{
			title: 'Test headline',
			description: 'Desc',
			link: 'https://example.com',
			pubDate: '',
			source: 'BBC News',
		},
	]),
}))

describe('GET /api/data', () => {
	it('returns all dashboard fields without auth', async () => {
		const res = await GET()
		const body = await res.json()

		expect(res.status).toBe(200)
		expect(body).toHaveProperty('weather')
		expect(body).toHaveProperty('bins')
		expect(body).toHaveProperty('fixture')
		expect(body).toHaveProperty('news')
		expect(body).toHaveProperty('createdAt')
	})

	it('returns partial data when a service fails', async () => {
		const { fetchWeatherData } = await import('@/lib/weather')
		;(fetchWeatherData as jest.Mock).mockRejectedValueOnce(
			new Error('Weather service down')
		)

		const res = await GET()
		const body = await res.json()

		expect(res.status).toBe(200)
		expect(body.weather).toBeNull()
		expect(Array.isArray(body.bins)).toBe(true)
	})
})
