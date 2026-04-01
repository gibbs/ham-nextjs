'use client'

import { useTranslations } from 'next-intl'

interface Props {
	error: string | null
}

export default function PreloadScreen({ error }: Props) {
	const t = useTranslations('preload')

	return (
		<div
			className="flex min-h-screen flex-col items-center justify-center gap-6"
			data-testid="preload-screen"
		>
			<div className="text-center">
				<h1 className="mb-2 text-3xl font-semibold tracking-tight text-gray-100">
					{t('title')}
				</h1>
				<p className="text-sm text-gray-500">{t('location')}</p>
			</div>

			{error ? (
				<div className="rounded-lg border border-red-800 bg-red-950/40 px-6 py-4 text-sm text-red-400">
					{error}
				</div>
			) : (
				<div className="flex flex-col items-center gap-3">
					<div
						className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500"
						role="status"
						aria-label={t('loadingLabel')}
					/>
					<p className="text-sm text-gray-500">{t('loadingData')}</p>
				</div>
			)}
		</div>
	)
}
