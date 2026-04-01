import { render, screen } from '@testing-library/react'
import Weather from '@/components/Weather'
import type { WeatherData } from '@/types'

const mockWeather: WeatherData = {
	current: {
		temperature: 14,
		windspeed: 20,
		weathercode: 3,
		description: 'Overcast',
		humidity: 70,
	},
	pollen: {
		level: 'High',
		dominant: 'Birch',
		value: 120,
	},
	forecast: [
		{
			date: '2026-04-02',
			weathercode: 61,
			description: 'Slight rain',
			maxTemp: 12,
			minTemp: 7,
			precipitation: 5.2,
			maxWindspeed: 35,
		},
		{
			date: '2026-04-03',
			weathercode: 2,
			description: 'Partly cloudy',
			maxTemp: 14,
			minTemp: 8,
			precipitation: 0,
			maxWindspeed: 15,
		},
		{
			date: '2026-04-04',
			weathercode: 0,
			description: 'Clear sky',
			maxTemp: 17,
			minTemp: 9,
			precipitation: 0,
			maxWindspeed: 12,
		},
	],
}

describe('Weather', () => {
	it('renders current temperature and description', () => {
		render(<Weather data={mockWeather} />)

		expect(screen.getByText('°C')).toBeInTheDocument()
		expect(screen.getByText('Overcast')).toBeInTheDocument()
	})

	it('renders pollen level with correct label', () => {
		render(<Weather data={mockWeather} />)

		expect(screen.getByTestId('pollen-level')).toHaveTextContent('High')
	})

	it('renders 3-day forecast', () => {
		render(<Weather data={mockWeather} />)

		expect(screen.getByText('Slight rain')).toBeInTheDocument()
		expect(screen.getByText('Partly cloudy')).toBeInTheDocument()
		expect(screen.getByText('Clear sky')).toBeInTheDocument()
	})

	it('renders unavailable message when data is null', () => {
		render(<Weather data={null} />)

		expect(screen.getByText(/unavailable/i)).toBeInTheDocument()
	})

	it('shows wind and humidity stats', () => {
		render(<Weather data={mockWeather} />)

		expect(screen.getByText('20 mph')).toBeInTheDocument()
		expect(screen.getByText('70%')).toBeInTheDocument()
	})
})
