import { type NextRequest, NextResponse } from 'next/server'
import { validateAuth, unauthorizedResponse } from '@/lib/auth'
import { fetchBinsData } from '@/lib/bins'

export async function GET(request: NextRequest) {
	if (!validateAuth(request)) {
		return unauthorizedResponse()
	}

	try {
		const data = await fetchBinsData()
		return NextResponse.json(data)
	} catch (err) {
		return NextResponse.json(
			{
				error:
					err instanceof Error ? err.message : 'Failed to fetch bin collection',
			},
			{ status: 502 }
		)
	}
}
