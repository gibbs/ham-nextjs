import { type NextRequest, NextResponse } from 'next/server'
import { validateAuth, unauthorizedResponse } from '@/lib/auth'
import { fetchFixturesData } from '@/lib/fixtures'

export async function GET(request: NextRequest) {
	if (!validateAuth(request)) {
		return unauthorizedResponse()
	}

	try {
		const data = await fetchFixturesData()
		return NextResponse.json(data)
	} catch (err) {
		return NextResponse.json(
			{
				error: err instanceof Error ? err.message : 'Failed to fetch fixtures',
			},
			{ status: 502 }
		)
	}
}
