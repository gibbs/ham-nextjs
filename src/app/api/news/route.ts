import { type NextRequest, NextResponse } from 'next/server'
import { validateAuth, unauthorizedResponse } from '@/lib/auth'
import { fetchNewsData } from '@/lib/news'

export async function GET(request: NextRequest) {
	if (!validateAuth(request)) {
		return unauthorizedResponse()
	}

	try {
		const data = await fetchNewsData()
		return NextResponse.json(data)
	} catch (err) {
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : 'Failed to fetch news' },
			{ status: 502 }
		)
	}
}
