'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'

function getUKDateTime() {
	return new Date().toLocaleString('en-GB', {
		timeZone: 'Europe/London',
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	})
}

export default function DateTime() {
	const t = useTranslations('dateTime')
	const [dateTime, setDateTime] = useState<string | null>(null)

	useEffect(() => {
		setDateTime(getUKDateTime())
		const id = setInterval(() => setDateTime(getUKDateTime()), 1000)

		return () => clearInterval(id)
	}, [])

	if (!dateTime) {
		return (
			<div className="card flex min-h-20 items-center justify-center">
				<span className="text-gray-600 text-sm">—</span>
			</div>
		)
	}

	const [weekdayDate, time] = dateTime.split(' at ')
	const parts = weekdayDate?.split(', ') ?? []
	const weekday = parts[0] ?? ''
	const date = parts.slice(1).join(', ')

	return (
		<div
			className="card flex flex-col justify-center gap-1"
			data-testid="datetime"
		>
			<p className="text-xs font-medium uppercase tracking-widest text-gray-500">
				{weekday}
			</p>
			<p className="text-lg font-semibold text-gray-100">{date}</p>
			<p
				className="font-mono text-3xl font-bold tabular-nums text-blue-400 xl:text-4xl"
				aria-live="polite"
				aria-label={t('currentTime')}
			>
				{time}
			</p>
		</div>
	)
}
