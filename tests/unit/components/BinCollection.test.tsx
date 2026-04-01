import { render, screen } from '@testing-library/react'
import BinCollection from '@/components/BinCollection'
import type { BinCollection as BinCollectionType } from '@/types'

const mockBins: BinCollectionType[] = [
	{ type: 'Black Bin', date: '07/04/2026', daysUntil: 6 },
	{ type: 'Recycling', date: '14/04/2026', daysUntil: 13 },
]

describe('BinCollection', () => {
	it('renders bin types', () => {
		render(<BinCollection bins={mockBins} />)

		expect(screen.getByText('Black Bin')).toBeInTheDocument()
		expect(screen.getByText('Recycling')).toBeInTheDocument()
	})

	it('renders Refuse as Black Bin in the UI', () => {
		render(
			<BinCollection
				bins={[{ type: 'Refuse', date: '07/04/2026', daysUntil: 6 }]}
			/>
		)

		expect(screen.getByText('Black Bin')).toBeInTheDocument()
	})

	it('shows "Today" for daysUntil = 0', () => {
		render(
			<BinCollection
				bins={[{ type: 'Black Bin', date: '01/04/2026', daysUntil: 0 }]}
			/>
		)

		expect(screen.getByText(/today/i)).toBeInTheDocument()
	})

	it('shows "Tomorrow" for daysUntil = 1', () => {
		render(
			<BinCollection
				bins={[{ type: 'Black Bin', date: '02/04/2026', daysUntil: 1 }]}
			/>
		)

		expect(screen.getByText(/tomorrow/i)).toBeInTheDocument()
	})

	it('shows "In N days" for future collections', () => {
		render(<BinCollection bins={mockBins} />)

		expect(screen.getByText(/In 6 days/i)).toBeInTheDocument()
	})

	it('renders empty state when no bins', () => {
		render(<BinCollection bins={[]} />)

		expect(screen.getByText(/no upcoming/i)).toBeInTheDocument()
	})
})
