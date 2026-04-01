import { test, expect } from '@playwright/test'
import type { HomeData } from '@/types'

const mockData: HomeData = {
	weather: {
		current: {
			temperature: 14,
			windspeed: 18,
			weathercode: 3,
			description: 'Overcast',
			humidity: 72,
		},
		pollen: { level: 'Low', dominant: 'Grass', value: 15 },
		forecast: [
			{
				date: '2026-04-02',
				weathercode: 61,
				description: 'Slight rain',
				maxTemp: 12,
				minTemp: 7,
				precipitation: 5.2,
				maxWindspeed: 35,
			},
			{
				date: '2026-04-03',
				weathercode: 2,
				description: 'Partly cloudy',
				maxTemp: 14,
				minTemp: 8,
				precipitation: 0,
				maxWindspeed: 15,
			},
			{
				date: '2026-04-04',
				weathercode: 0,
				description: 'Clear sky',
				maxTemp: 17,
				minTemp: 9,
				precipitation: 0,
				maxWindspeed: 12,
			},
			{
				date: '2026-04-05',
				weathercode: 1,
				description: 'Mainly clear',
				maxTemp: 16,
				minTemp: 8,
				precipitation: 0,
				maxWindspeed: 18,
			},
			{
				date: '2026-04-06',
				weathercode: 80,
				description: 'Slight showers',
				maxTemp: 14,
				minTemp: 7,
				precipitation: 3.1,
				maxWindspeed: 22,
			},
		],
	},
	bins: [
		{ type: 'Black Bin', date: '07/04/2026', daysUntil: 6 },
		{ type: 'Recycling', date: '14/04/2026', daysUntil: 13 },
	],
	fixture: {
		homeTeam: 'Bristol City',
		awayTeam: 'West Brom',
		date: '2026-04-15',
		time: '19:45',
		competition: 'Sky Bet Championship',
		venue: 'Ashton Gate Stadium',
		isHome: true,
	},
	news: [
		{
			title: 'Test headline one',
			description: 'Description one.',
			link: 'https://bbc.co.uk/1',
			pubDate: new Date().toUTCString(),
			source: 'BBC News',
			thumbnailUrl: 'https://example.com/thumb-1.jpg',
		},
		{
			title: 'Test headline two',
			description: 'Description two.',
			link: 'https://bbc.co.uk/2',
			pubDate: new Date().toUTCString(),
			source: 'BBC News',
		},
	],
	createdAt: new Date().toISOString(),
}

test.describe('Dashboard', () => {
	test.beforeEach(async ({ page }) => {
		await page.route('/api/data', (route) =>
			route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(mockData),
			})
		)
	})

	test('shows preload screen initially, then renders dashboard', async ({
		page,
	}) => {
		await page.goto('/')

		await expect(page.getByTestId('dashboard')).toBeVisible({ timeout: 10000 })
	})

	test('renders Weather widget', async ({ page }) => {
		await page.goto('/')

		await expect(page.getByTestId('weather')).toBeVisible()
		await expect(page.getByText('Overcast')).toBeVisible()
	})

	test('renders Bin Collection widget', async ({ page }) => {
		await page.goto('/')

		await expect(page.getByTestId('bin-collection')).toBeVisible()
		await expect(page.getByText('Black Bin')).toBeVisible()
	})

	test('renders Fixtures widget', async ({ page }) => {
		await page.goto('/')

		await expect(page.getByTestId('fixtures')).toBeVisible()
		await expect(page.getByText('Bristol City')).toBeVisible()
		await expect(page.getByText('West Brom')).toBeVisible()
	})

	test('renders News Headlines widget', async ({ page }) => {
		await page.goto('/')

		await expect(page.getByTestId('news-headlines')).toBeVisible()
		await expect(page.getByText('Test headline one')).toBeVisible()
	})

	test('renders DateTime widget', async ({ page }) => {
		await page.goto('/')

		await expect(page.getByTestId('datetime')).toBeVisible()
	})
})

test.describe('Error state', () => {
	test('shows error message when API fails', async ({ page }) => {
		await page.route('/api/data', (route) =>
			route.fulfill({ status: 500, body: 'Internal Server Error' })
		)
		await page.goto('/')

		await expect(page.getByTestId('preload-screen')).toBeVisible()
		await expect(page.getByText(/http 500|failed|error/i)).toBeVisible({
			timeout: 10000,
		})
	})
})
