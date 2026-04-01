export interface WeatherCurrent {
	temperature: number
	windspeed: number
	weathercode: number
	description: string
	humidity: number
}

export interface WeatherDay {
	date: string
	weathercode: number
	description: string
	maxTemp: number
	minTemp: number
	precipitation: number
	maxWindspeed: number
}

export interface PollenLevel {
	level: 'None' | 'Low' | 'Moderate' | 'High' | 'Very High'
	dominant: string
	value: number
}

export interface WeatherData {
	current: WeatherCurrent
	pollen: PollenLevel
	forecast: WeatherDay[]
}

export interface BinCollection {
	type: string
	date: string
	daysUntil: number
}

export interface Fixture {
	homeTeam: string
	awayTeam: string
	date: string
	time: string
	competition: string
	venue: string
	isHome: boolean
}

export interface NewsArticle {
	title: string
	description: string
	link: string
	pubDate: string
	source: string
	thumbnailUrl?: string
}

export interface HomeData {
	weather: WeatherData | null
	bins: BinCollection[]
	fixture: Fixture | null
	news: NewsArticle[]
	createdAt: string
}
