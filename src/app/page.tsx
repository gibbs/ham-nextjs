'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { HomeData } from '@/types'
import PreloadScreen from '@/components/PreloadScreen'
import Dashboard from '@/components/Dashboard'

export default function Home() {
	const t = useTranslations('home')
	const [data, setData] = useState<HomeData | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		fetch('/api/data')
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP ${res.status}`)
				}

				return res.json() as Promise<HomeData>
			})
			.then(setData)
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : t('loadError'))
			})
	}, [t])

	if (!data) {
		return <PreloadScreen error={error} />
	}

	return <Dashboard data={data} />
}
