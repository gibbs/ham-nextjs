'use client'

import { useTranslations } from 'next-intl'
import type { WeatherData } from '@/types'
import { getWeatherIcon } from '@/lib/weather'

interface Props {
	data: WeatherData | null
}

const POLLEN_CLASS: Record<string, string> = {
	None: 'pollen-none',
	Low: 'pollen-low',
	Moderate: 'pollen-moderate',
	High: 'pollen-high',
	'Very High': 'pollen-very-high',
}

const POLLEN_LEVEL_KEY: Record<
	'None' | 'Low' | 'Moderate' | 'High' | 'Very High',
	'none' | 'low' | 'moderate' | 'high' | 'veryHigh'
> = {
	None: 'none',
	Low: 'low',
	Moderate: 'moderate',
	High: 'high',
	'Very High': 'veryHigh',
}

function formatDay(dateStr: string): string {
	return new Date(dateStr).toLocaleDateString('en-GB', {
		weekday: 'short',
		timeZone: 'UTC',
	})
}

export default function Weather({ data }: Props) {
	const t = useTranslations('weather')

	if (!data) {
		return (
			<div className="card text-sm text-gray-500" data-testid="weather">
				{t('unavailable')}
			</div>
		)
	}

	const { current, pollen, forecast } = data
	const pollenLevelKey = POLLEN_LEVEL_KEY[pollen.level]

	return (
		<div className="card" data-testid="weather">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div className="flex items-center gap-4">
					<span
						className="text-6xl leading-none xl:text-7xl"
						role="img"
						aria-label={current.description}
					>
						{getWeatherIcon(current.weathercode)}
					</span>
					<div>
						<p className="text-6xl font-bold tabular-nums text-gray-100 xl:text-7xl">
							{current.temperature}
							<span className="text-3xl text-gray-400">°C</span>
						</p>
						<p className="mt-1 text-base text-gray-300">
							{current.description}
						</p>
						<p className="text-sm text-gray-500">{t('location')}</p>
					</div>
				</div>

				<div className="flex flex-col gap-2 text-sm">
					<StatRow label={t('humidity')} value={`${current.humidity}%`} />
					<StatRow label={t('wind')} value={`${current.windspeed} mph`} />
					<div className="flex items-center gap-2">
						<span className="w-20 text-gray-500">{t('pollen')}</span>
						<span
							className={`font-semibold ${POLLEN_CLASS[pollen.level] ?? 'pollen-none'}`}
							data-testid="pollen-level"
						>
							{t(`levels.${pollenLevelKey}`)}
						</span>
						{pollen.dominant !== 'None' && (
							<span className="text-gray-500">({pollen.dominant})</span>
						)}
					</div>
				</div>
			</div>

			<div className="mt-5 grid grid-cols-5 gap-3 border-t border-white/[0.06] pt-5">
				{forecast.map((day) => (
					<div
						key={day.date}
						className="flex flex-col items-center gap-1 rounded-lg bg-white/3 p-3"
					>
						<p className="text-xs font-medium uppercase tracking-wide text-gray-500">
							{formatDay(day.date)}
						</p>
						<span
							className="mt-1 text-3xl"
							role="img"
							aria-label={day.description}
						>
							{getWeatherIcon(day.weathercode)}
						</span>
						<p className="text-sm text-gray-300">{day.description}</p>
						<p className="text-sm font-semibold text-gray-100">
							{day.maxTemp}° / {day.minTemp}°
						</p>
						{day.precipitation > 0 && (
							<p className="text-xs text-blue-400">{day.precipitation}mm</p>
						)}
					</div>
				))}
			</div>
		</div>
	)
}

function StatRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center gap-2">
			<span className="w-20 text-gray-500">{label}</span>
			<span className="font-medium text-gray-200">{value}</span>
		</div>
	)
}
