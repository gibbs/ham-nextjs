export const openApiSpec = {
	openapi: '3.0.3',
	info: {
		title: 'Ham Dashboard API',
		description:
			'Personal home dashboard API providing weather, bin collection, football fixtures, and news data.',
		version: '1.0.0',
		contact: {
			name: 'Ham Dashboard',
		},
	},
	servers: [{ url: '/api', description: 'Current server' }],
	components: {
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				scheme: 'bearer',
				description:
					'API key set via the API_KEY environment variable. Pass as `Authorization: Bearer <key>`.',
			},
		},
	},
	security: [],
	paths: {
		'/data': {
			get: {
				summary: 'Get all dashboard data',
				description:
					'Returns all dashboard data in a single request. This endpoint is public and does not require authentication.',
				operationId: 'getAllData',
				tags: ['Dashboard'],
				responses: {
					'200': {
						description: 'All dashboard data',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										weather: { type: 'object', nullable: true },
										bins: { type: 'array' },
										fixture: { type: 'object', nullable: true },
										news: { type: 'array' },
										createdAt: { type: 'string', format: 'date-time' },
									},
								},
							},
						},
					},
				},
			},
		},
		'/weather': {
			get: {
				summary: 'Get weather forecast',
				description:
					'Returns current conditions and 3-day forecast including pollen levels.',
				operationId: 'getWeather',
				tags: ['Weather'],
				security: [{ bearerAuth: [] }],
				responses: {
					'200': { description: 'Weather data' },
					'401': { description: 'Unauthorized' },
				},
			},
		},
		'/bins': {
			get: {
				summary: 'Get bin collection schedule',
				description:
					'Returns upcoming bin collection dates from the local collection service.',
				operationId: 'getBins',
				tags: ['Bin Collection'],
				security: [{ bearerAuth: [] }],
				responses: {
					'200': { description: 'Bin collection schedule' },
					'401': { description: 'Unauthorized' },
					'502': { description: 'Upstream bin service error' },
				},
			},
		},
		'/fixtures': {
			get: {
				summary: 'Get next Bristol City fixture',
				description:
					"Returns the next upcoming Bristol City men's first-team fixture.",
				operationId: 'getFixtures',
				tags: ['Fixtures'],
				security: [{ bearerAuth: [] }],
				responses: {
					'200': { description: 'Fixture data or null if none available' },
					'401': { description: 'Unauthorized' },
				},
			},
		},
		'/news': {
			get: {
				summary: 'Get latest news headlines',
				description: 'Returns the latest headlines from BBC News RSS feed.',
				operationId: 'getNews',
				tags: ['News'],
				security: [{ bearerAuth: [] }],
				responses: {
					'200': { description: 'News articles' },
					'401': { description: 'Unauthorized' },
				},
			},
		},
	},
}
