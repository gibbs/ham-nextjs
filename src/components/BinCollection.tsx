'use client'

import { useTranslations } from 'next-intl'
import type { BinCollection } from '@/types'

interface Props {
	bins: BinCollection[]
}

const BIN_STYLES: Record<
	string,
	{ bg: string; border: string; dot: string; label: string }
> = {
	black: {
		bg: 'bg-gray-800/60',
		border: 'border-gray-600/50',
		dot: 'bg-gray-400',
		label: 'Black Bin',
	},
	recycling: {
		bg: 'bg-green-900/40',
		border: 'border-green-700/50',
		dot: 'bg-green-400',
		label: 'Recycling',
	},
	garden: {
		bg: 'bg-lime-900/40',
		border: 'border-lime-700/50',
		dot: 'bg-lime-400',
		label: 'Garden Waste',
	},
	food: {
		bg: 'bg-amber-900/30',
		border: 'border-amber-700/50',
		dot: 'bg-amber-400',
		label: 'Food Waste',
	},
}

function getBinStyle(type: string) {
	const key = type.toLowerCase()

	if (
		key.includes('black') ||
		key.includes('refuse') ||
		key.includes('general')
	) {
		return BIN_STYLES.black
	}

	if (key.includes('recycl') || key.includes('blue')) {
		return BIN_STYLES.recycling
	}

	if (key.includes('garden')) {
		return BIN_STYLES.garden
	}

	if (key.includes('food')) {
		return BIN_STYLES.food
	}

	return BIN_STYLES.black
}

function getBinLabelKey(
	type: string
): 'black' | 'recycling' | 'garden' | 'food' {
	const key = type.toLowerCase()

	if (
		key.includes('black') ||
		key.includes('refuse') ||
		key.includes('general')
	) {
		return 'black'
	}

	if (key.includes('recycl') || key.includes('blue')) {
		return 'recycling'
	}

	if (key.includes('garden')) {
		return 'garden'
	}

	if (key.includes('food')) {
		return 'food'
	}

	return 'black'
}

function daysLabel(n: number): string {
	if (n === 0) {
		return 'today'
	}

	if (n === 1) {
		return 'tomorrow'
	}

	return `inDays:${n}`
}

function formatCollectionDate(
	dateStr: string,
	t: ReturnType<typeof useTranslations>
): string {
	const trimmed = dateStr.trim()
	const lower = trimmed.toLowerCase()

	if (lower.includes('today')) {
		return t('today')
	}

	if (lower.includes('tomorrow')) {
		return t('tomorrow')
	}

	// Handles DD/MM/YYYY and YYYY-MM-DD
	const d = trimmed.includes('/')
		? (() => {
				const [dd, mm, yyyy] = trimmed.split('/').map(Number)
				return new Date(yyyy, mm - 1, dd)
			})()
		: new Date(trimmed)

	if (Number.isNaN(d.getTime())) {
		return trimmed
	}

	return d.toLocaleDateString('en-GB', {
		weekday: 'short',
		day: 'numeric',
		month: 'short',
	})
}

export default function BinCollection({ bins }: Props) {
	const t = useTranslations('binCollection')
	const hasRecycling = bins.some((bin) => {
		const key = bin.type.toLowerCase()

		return key.includes('recycl') || key.includes('blue')
	})

	if (!bins.length) {
		return (
			<div className="card text-sm text-gray-500" data-testid="bin-collection">
				{t('noUpcoming')}
			</div>
		)
	}

	return (
		<div className="card" data-testid="bin-collection">
			<h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-gray-500">
				{t('title')}
			</h2>
			{!hasRecycling ? (
				<p className="mb-3 text-xs text-amber-300/80">
					{t('noRecyclingReturned')}
				</p>
			) : null}
			<div className="flex flex-wrap gap-3">
				{bins.map((bin, i) => {
					const style = getBinStyle(bin.type)
					const labelKey = getBinLabelKey(bin.type)
					const dayLabel = daysLabel(bin.daysUntil)
					const dateLabel = formatCollectionDate(bin.date, t)
					const resolvedDayLabel = dayLabel.startsWith('inDays:')
						? t('inDays', { days: bin.daysUntil })
						: t(dayLabel)
					const subtitle =
						dateLabel.toLowerCase() === resolvedDayLabel.toLowerCase()
							? resolvedDayLabel
							: `${resolvedDayLabel} · ${dateLabel}`

					return (
						<div
							key={i}
							className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${style.bg} ${style.border}`}
						>
							<span
								className={`h-3 w-3 shrink-0 rounded-full ${style.dot}`}
								aria-hidden
							/>
							<div>
								<p className="text-sm font-semibold text-gray-100">
									{t(`labels.${labelKey}`)}
								</p>
								<p className="text-xs text-gray-400">{subtitle}</p>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
