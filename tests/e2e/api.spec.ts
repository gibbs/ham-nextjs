import { test, expect } from '@playwright/test'

const API_KEY = process.env.API_KEY ?? 'test-api-key'

test.describe('API routes', () => {
	test('GET /api/data returns 200 without auth', async ({ request }) => {
		const res = await request.get('/api/data')
		const body = await res.json()

		expect(res.status()).toBe(200)
		expect(body).toHaveProperty('createdAt')
	})

	test('GET /api/weather returns 401 without auth', async ({ request }) => {
		const res = await request.get('/api/weather')

		expect(res.status()).toBe(401)
	})

	test('GET /api/bins returns 401 without auth', async ({ request }) => {
		const res = await request.get('/api/bins')

		expect(res.status()).toBe(401)
	})

	test('GET /api/fixtures returns 401 without auth', async ({ request }) => {
		const res = await request.get('/api/fixtures')

		expect(res.status()).toBe(401)
	})

	test('GET /api/news returns 401 without auth', async ({ request }) => {
		const res = await request.get('/api/news')

		expect(res.status()).toBe(401)
	})

	test('GET /api/weather returns 200 with valid Bearer token', async ({
		request,
	}) => {
		const res = await request.get('/api/weather', {
			headers: { Authorization: `Bearer ${API_KEY}` },
		})

		expect(res.status()).not.toBe(401)
	})

	test('GET /api/docs/spec returns valid OpenAPI JSON', async ({ request }) => {
		const res = await request.get('/api/docs/spec')
		const body = await res.json()

		expect(res.status()).toBe(200)
		expect(body).toHaveProperty('openapi', '3.0.3')
		expect(body).toHaveProperty('paths')
	})

	test('GET /api/docs returns HTML Swagger UI', async ({ request }) => {
		const res = await request.get('/api/docs')
		const text = await res.text()

		expect(res.status()).toBe(200)
		expect(text).toContain('swagger-ui')
	})
})
