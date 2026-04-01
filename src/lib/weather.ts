import type { WeatherData, WeatherDay, PollenLevel } from '@/types'

const LAT = 50.9889
const LON = -4.2614

const WMO_DESCRIPTIONS: Record<number, string> = {
	0: 'Clear sky',
	1: 'Mainly clear',
	2: 'Partly cloudy',
	3: 'Overcast',
	45: 'Foggy',
	48: 'Icy fog',
	51: 'Light drizzle',
	53: 'Moderate drizzle',
	55: 'Dense drizzle',
	61: 'Slight rain',
	63: 'Moderate rain',
	65: 'Heavy rain',
	71: 'Slight snow',
	73: 'Moderate snow',
	75: 'Heavy snow',
	77: 'Snow grains',
	80: 'Slight showers',
	81: 'Moderate showers',
	82: 'Violent showers',
	85: 'Slight snow showers',
	86: 'Heavy snow showers',
	95: 'Thunderstorm',
	96: 'Thunderstorm with hail',
	99: 'Thunderstorm with heavy hail',
}

const WMO_ICONS: Record<number, string> = {
	0: '☀️',
	1: '🌤️',
	2: '⛅',
	3: '☁️',
	45: '🌫️',
	48: '🌫️',
	51: '🌦️',
	53: '🌦️',
	55: '🌧️',
	61: '🌧️',
	63: '🌧️',
	65: '🌧️',
	71: '❄️',
	73: '❄️',
	75: '❄️',
	77: '🌨️',
	80: '🌩️',
	81: '🌩️',
	82: '⛈️',
	85: '🌨️',
	86: '🌨️',
	95: '⛈️',
	96: '⛈️',
	99: '⛈️',
}

export function getWeatherDescription(code: number): string {
	return WMO_DESCRIPTIONS[code] ?? 'Unknown'
}

export function getWeatherIcon(code: number): string {
	return WMO_ICONS[code] ?? '🌡️'
}

function classifyPollen(value: number): PollenLevel['level'] {
	if (value < 10) {
		return 'None'
	}

	if (value < 30) {
		return 'Low'
	}

	if (value < 80) {
		return 'Moderate'
	}

	if (value < 200) {
		return 'High'
	}

	return 'Very High'
}

export async function fetchWeatherData(): Promise<WeatherData> {
	const baseUrl = `https://api.open-meteo.com/v1/forecast`
	const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality`

	const [forecastRes, airQualityRes] = await Promise.all([
		fetch(
			`${baseUrl}?latitude=${LAT}&longitude=${LON}` +
				`&current=temperature_2m,windspeed_10m,weathercode,relative_humidity_2m` +
				`&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max` +
				`&timezone=Europe/London&forecast_days=6&wind_speed_unit=mph`,
			{ next: { revalidate: 3600 } }
		),
		fetch(
			`${airUrl}?latitude=${LAT}&longitude=${LON}` +
				`&hourly=grass_pollen,birch_pollen,alder_pollen` +
				`&timezone=Europe/London&forecast_days=1`,
			{ next: { revalidate: 3600 } }
		),
	])

	if (!forecastRes.ok) {
		throw new Error(`Weather API returned ${forecastRes.status}`)
	}

	const forecast = await forecastRes.json()
	const airQuality = airQualityRes.ok ? await airQualityRes.json() : null

	let pollen: PollenLevel = { level: 'None', dominant: 'None', value: 0 }
	if (airQuality?.hourly) {
		const grassMax = Math.max(
			...((airQuality.hourly.grass_pollen as number[]) ?? [0])
		)
		const birchMax = Math.max(
			...((airQuality.hourly.birch_pollen as number[]) ?? [0])
		)
		const alderMax = Math.max(
			...((airQuality.hourly.alder_pollen as number[]) ?? [0])
		)
		const maxPollen = Math.max(grassMax, birchMax, alderMax)
		const dominant =
			maxPollen === grassMax
				? 'Grass'
				: maxPollen === birchMax
					? 'Birch'
					: 'Alder'
		pollen = {
			level: classifyPollen(maxPollen),
			dominant,
			value: Math.round(maxPollen),
		}
	}

	const current = {
		temperature: Math.round(forecast.current.temperature_2m as number),
		windspeed: Math.round(forecast.current.windspeed_10m as number),
		weathercode: forecast.current.weathercode as number,
		description: getWeatherDescription(forecast.current.weathercode as number),
		humidity: forecast.current.relative_humidity_2m as number,
	}

	// Indices 1-5 = next 5 days (index 0 = today)
	const forecastDays: WeatherDay[] = (forecast.daily.time as string[])
		.slice(1, 4)
		.map((date: string, i: number) => ({
			date,
			weathercode: (forecast.daily.weathercode as number[])[i + 1],
			description: getWeatherDescription(
				(forecast.daily.weathercode as number[])[i + 1]
			),
			maxTemp: Math.round(
				(forecast.daily.temperature_2m_max as number[])[i + 1]
			),
			minTemp: Math.round(
				(forecast.daily.temperature_2m_min as number[])[i + 1]
			),
			precipitation: (forecast.daily.precipitation_sum as number[])[i + 1],
			maxWindspeed: Math.round(
				(forecast.daily.windspeed_10m_max as number[])[i + 1]
			),
		}))

	return { current, pollen, forecast: forecastDays }
}
