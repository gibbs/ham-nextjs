/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/bins/route'

const API_KEY = 'test-key'

jest.mock('@/lib/bins', () => ({
	fetchBinsData: jest.fn().mockResolvedValue([
		{
			type: 'Black Bin',
			date: '07/04/2026',
			daysUntil: 6,
		},
	]),
}))

beforeEach(() => {
	process.env.API_KEY = API_KEY
})

describe('GET /api/bins', () => {
	it('returns 401 without auth', async () => {
		const req = new NextRequest('http://localhost/api/bins')
		const res = await GET(req)

		expect(res.status).toBe(401)
	})

	it('returns 200 with valid token', async () => {
		const req = new NextRequest('http://localhost/api/bins', {
			headers: { Authorization: `Bearer ${API_KEY}` },
		})
		const res = await GET(req)
		const body = await res.json()

		expect(res.status).toBe(200)
		expect(Array.isArray(body)).toBe(true)
	})
})
