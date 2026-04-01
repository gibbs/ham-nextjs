'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Fixture } from '@/types'
import { getClubBadgeUrl } from '@/lib/club-badges'

interface Props {
	fixture: Fixture | null
}

function formatMatchDate(date: string, time: string): string {
	const d = new Date(`${date}T${time}:00`)

	return d.toLocaleDateString('en-GB', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}

export default function Fixtures({ fixture }: Props) {
	const t = useTranslations('fixtures')

	if (!fixture) {
		return (
			<div className="card text-sm text-gray-500" data-testid="fixtures">
				{t('noUpcoming')}
			</div>
		)
	}

	return (
		<div className="card" data-testid="fixtures">
			<div className="mb-5 text-center">
				<p className="text-sm text-gray-400">
					{formatMatchDate(fixture.date, fixture.time)} · {fixture.time}
				</p>
			</div>

			<div className="flex items-center justify-between gap-4">
				<TeamBlock name={fixture.homeTeam} isHome />
				<div className="flex flex-col items-center">
					<p className="text-2xl font-bold text-gray-500">v</p>
				</div>
				<TeamBlock name={fixture.awayTeam} isHome={false} />
			</div>

			<p className="mt-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
				{fixture.competition}
			</p>

			<p className="mt-2 text-center text-xs text-gray-500">{fixture.venue}</p>

			<p className="mt-1 text-center text-xs text-gray-600">
				{fixture.isHome ? t('homeFixture') : t('awayFixture')}
			</p>
		</div>
	)
}

function TeamBlock({ name, isHome }: { name: string; isHome: boolean }) {
	return (
		<div
			className={`flex flex-1 flex-col items-center gap-2 ${isHome ? 'text-left' : 'text-right'}`}
		>
			<Image
				src={getClubBadgeUrl(name)}
				alt={`${name} badge`}
				width={56}
				height={56}
				className="h-14 w-14 rounded-full border-2 border-white/10 bg-white/5 object-contain p-1"
				loading="lazy"
				unoptimized
			/>
			<p
				className={`text-center text-sm font-bold leading-tight text-gray-100 xl:text-base ${isHome ? 'text-red-300' : ''}`}
			>
				{name}
			</p>
		</div>
	)
}
