/**
 * @jest-environment node
 */
import fetchMock from 'jest-fetch-mock'
import {
	fetchWeatherData,
	getWeatherDescription,
	getWeatherIcon,
} from '@/lib/weather'

fetchMock.enableMocks()

const mockForecastResponse = {
	current: {
		temperature_2m: 14.3,
		windspeed_10m: 18.5,
		weathercode: 3,
		relative_humidity_2m: 72,
	},
	daily: {
		time: [
			'2026-04-01',
			'2026-04-02',
			'2026-04-03',
			'2026-04-04',
			'2026-04-05',
			'2026-04-06',
		],
		weathercode: [3, 61, 2, 0, 1, 80],
		temperature_2m_max: [15.2, 12.1, 13.8, 17.0, 16.5, 14.0],
		temperature_2m_min: [8.4, 7.2, 6.9, 9.1, 8.0, 7.5],
		precipitation_sum: [0, 5.2, 0.1, 0, 0, 3.1],
		windspeed_10m_max: [20.1, 35.3, 15.0, 12.4, 18.0, 22.0],
	},
}

const mockAirQualityResponse = {
	hourly: {
		grass_pollen: [5, 10, 15, 20, 25],
		birch_pollen: [80, 90, 100, 110, 120],
		alder_pollen: [2, 3, 4, 5, 6],
	},
}

beforeEach(() => {
	fetchMock.resetMocks()
})

describe('getWeatherDescription', () => {
	it('returns correct description for known codes', () => {
		expect(getWeatherDescription(0)).toBe('Clear sky')
		expect(getWeatherDescription(3)).toBe('Overcast')
		expect(getWeatherDescription(61)).toBe('Slight rain')
		expect(getWeatherDescription(95)).toBe('Thunderstorm')
	})

	it('returns Unknown for unrecognised codes', () => {
		expect(getWeatherDescription(999)).toBe('Unknown')
	})
})

describe('getWeatherIcon', () => {
	it('returns an emoji for known codes', () => {
		expect(getWeatherIcon(0)).toBe('☀️')
		expect(getWeatherIcon(3)).toBe('☁️')
	})

	it('returns fallback for unknown codes', () => {
		expect(getWeatherIcon(999)).toBe('🌡️')
	})
})

describe('fetchWeatherData', () => {
	it('returns structured weather data', async () => {
		fetchMock.mockResponses(
			[JSON.stringify(mockForecastResponse), { status: 200 }],
			[JSON.stringify(mockAirQualityResponse), { status: 200 }]
		)

		const data = await fetchWeatherData()

		expect(data.current.temperature).toBe(14)
		expect(data.current.windspeed).toBe(19)
		expect(data.current.description).toBe('Overcast')
		expect(data.current.humidity).toBe(72)
		expect(data.forecast).toHaveLength(3)
		expect(data.forecast[0].date).toBe('2026-04-02')
	})

	it('classifies pollen level correctly', async () => {
		fetchMock.mockResponses(
			[JSON.stringify(mockForecastResponse), { status: 200 }],
			[JSON.stringify(mockAirQualityResponse), { status: 200 }]
		)

		const data = await fetchWeatherData()

		expect(data.pollen.level).toBe('High')
		expect(data.pollen.dominant).toBe('Birch')
	})

	it('falls back to None pollen when air-quality call fails', async () => {
		fetchMock.mockResponses(
			[JSON.stringify(mockForecastResponse), { status: 200 }],
			['', { status: 500 }]
		)

		const data = await fetchWeatherData()
		expect(data.pollen.level).toBe('None')
	})

	it('throws when forecast API fails', async () => {
		fetchMock.mockResponses(
			['', { status: 500 }],
			[JSON.stringify(mockAirQualityResponse), { status: 200 }]
		)

		await expect(fetchWeatherData()).rejects.toThrow('Weather API returned 500')
	})
})
