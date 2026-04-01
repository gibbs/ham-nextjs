import { NextRequest } from 'next/server'

export function validateAuth(request: NextRequest | Request): boolean {
	const authHeader = request.headers.get('Authorization')

	if (!authHeader?.startsWith('Bearer ')) {
		return false
	}

	const token = authHeader.slice(7)
	const apiKey = process.env.API_KEY

	if (!apiKey) {
		return false
	}

	return token === apiKey
}

export function unauthorizedResponse(): Response {
	return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
