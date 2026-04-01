import type { HomeData } from '@/types'
import DateTime from '@/components/DateTime'
import Weather from '@/components/Weather'
import BinCollection from '@/components/BinCollection'
import Fixtures from '@/components/Fixtures'
import NewsHeadlines from '@/components/NewsHeadlines'

interface Props {
	data: HomeData
}

export default function Dashboard({ data }: Props) {
	return (
		<main className="min-h-screen p-4 lg:p-6 xl:p-8" data-testid="dashboard">
			<div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
				<DateTime />
				<div className="sm:col-span-1 xl:col-span-2">
					<BinCollection bins={data.bins} />
				</div>
			</div>

			<div className="mb-4">
				<Fixtures fixture={data.fixture} />
			</div>

			<div className="mb-4">
				<Weather data={data.weather} />
			</div>

			<div className="grid grid-cols-1 gap-4">
				<NewsHeadlines articles={data.news} />
			</div>
		</main>
	)
}
