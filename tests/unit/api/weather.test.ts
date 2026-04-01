/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/weather/route'

const API_KEY = 'test-key'

jest.mock('@/lib/weather', () => ({
	fetchWeatherData: jest.fn().mockResolvedValue({
		current: {
			temperature: 10,
			windspeed: 15,
			weathercode: 1,
			description: 'Mainly clear',
			humidity: 75,
		},
		pollen: {
			level: 'Low',
			dominant: 'Grass',
			value: 15,
		},
		forecast: [],
	}),
}))

beforeEach(() => {
	process.env.API_KEY = API_KEY
})

describe('GET /api/weather', () => {
	it('returns 401 without Authorization header', async () => {
		const req = new NextRequest('http://localhost/api/weather')
		const res = await GET(req)

		expect(res.status).toBe(401)
	})

	it('returns 401 with wrong token', async () => {
		const req = new NextRequest('http://localhost/api/weather', {
			headers: { Authorization: 'Bearer wrong' },
		})
		const res = await GET(req)

		expect(res.status).toBe(401)
	})

	it('returns 200 with valid token', async () => {
		const req = new NextRequest('http://localhost/api/weather', {
			headers: { Authorization: `Bearer ${API_KEY}` },
		})
		const res = await GET(req)
		const body = await res.json()

		expect(res.status).toBe(200)
		expect(body).toHaveProperty('current')
		expect(body).toHaveProperty('pollen')
		expect(body).toHaveProperty('forecast')
	})
})
