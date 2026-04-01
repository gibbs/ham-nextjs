import { NextResponse } from 'next/server'
import { fetchWeatherData } from '@/lib/weather'
import { fetchBinsData } from '@/lib/bins'
import { fetchFixturesData } from '@/lib/fixtures'
import { fetchNewsData } from '@/lib/news'

/**
 * Public endpoint to return all data
 */
export async function GET() {
	const [weatherResult, binsResult, fixturesResult, newsResult] =
		await Promise.allSettled([
			fetchWeatherData(),
			fetchBinsData(),
			fetchFixturesData(),
			fetchNewsData(),
		])

	return NextResponse.json({
		weather: weatherResult.status === 'fulfilled' ? weatherResult.value : null,
		bins: binsResult.status === 'fulfilled' ? binsResult.value : [],
		fixture:
			fixturesResult.status === 'fulfilled' ? fixturesResult.value : null,
		news: newsResult.status === 'fulfilled' ? newsResult.value : [],
		createdAt: new Date().toISOString(),
	})
}
