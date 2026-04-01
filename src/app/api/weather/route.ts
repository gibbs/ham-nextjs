import { type NextRequest, NextResponse } from 'next/server'
import { validateAuth, unauthorizedResponse } from '@/lib/auth'
import { fetchWeatherData } from '@/lib/weather'

export async function GET(request: NextRequest) {
	if (!validateAuth(request)) {
		return unauthorizedResponse()
	}

	try {
		const data = await fetchWeatherData()
		return NextResponse.json(data)
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : 'Failed to fetch weather' },
			{ status: 502 }
		)
	}
}
