/**
 * @jest-environment node
 */
import { validateAuth, unauthorizedResponse } from '@/lib/auth'
import { NextRequest } from 'next/server'

const API_KEY = 'test-secret-key'

beforeEach(() => {
	process.env.API_KEY = API_KEY
})

describe('validateAuth', () => {
	it('returns true for a valid Bearer token', () => {
		const req = new NextRequest('http://localhost/api/weather', {
			headers: { Authorization: `Bearer ${API_KEY}` },
		})

		expect(validateAuth(req)).toBe(true)
	})

	it('returns false when no Authorization header', () => {
		const req = new NextRequest('http://localhost/api/weather')

		expect(validateAuth(req)).toBe(false)
	})

	it('returns false for wrong token', () => {
		const req = new NextRequest('http://localhost/api/weather', {
			headers: { Authorization: 'Bearer wrong-key' },
		})

		expect(validateAuth(req)).toBe(false)
	})

	it('returns false for non-Bearer scheme', () => {
		const req = new NextRequest('http://localhost/api/weather', {
			headers: { Authorization: `Basic ${API_KEY}` },
		})

		expect(validateAuth(req)).toBe(false)
	})

	it('returns false when API_KEY env var is not set', () => {
		delete process.env.API_KEY
		const req = new NextRequest('http://localhost/api/weather', {
			headers: { Authorization: `Bearer ${API_KEY}` },
		})

		expect(validateAuth(req)).toBe(false)
	})
})

describe('unauthorizedResponse', () => {
	it('returns a 401 response with error message', async () => {
		const res = unauthorizedResponse()
		const body = await res.json()

		expect(res.status).toBe(401)
		expect(body).toEqual({ error: 'Unauthorized' })
	})
})
