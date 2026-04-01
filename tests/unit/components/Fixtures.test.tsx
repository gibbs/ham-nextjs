import { render, screen } from '@testing-library/react'
import Fixtures from '@/components/Fixtures'
import type { Fixture } from '@/types'

const mockFixture: Fixture = {
	homeTeam: 'Bristol City',
	awayTeam: 'West Brom',
	date: '2026-04-15',
	time: '19:45',
	competition: 'Sky Bet Championship',
	venue: 'Ashton Gate Stadium',
	isHome: true,
}

describe('Fixtures', () => {
	it('renders team names', () => {
		render(<Fixtures fixture={mockFixture} />)

		expect(screen.getByText('Bristol City')).toBeInTheDocument()
		expect(screen.getByText('West Brom')).toBeInTheDocument()
	})

	it('renders competition and venue', () => {
		render(<Fixtures fixture={mockFixture} />)

		expect(screen.getByText(/sky bet championship/i)).toBeInTheDocument()
		expect(screen.getByText(/ashton gate/i)).toBeInTheDocument()
	})

	it('renders club badge graphics', () => {
		render(<Fixtures fixture={mockFixture} />)

		expect(screen.getByAltText('Bristol City badge')).toBeInTheDocument()
		expect(screen.getByAltText('West Brom badge')).toBeInTheDocument()
	})

	it('renders match time', () => {
		render(<Fixtures fixture={mockFixture} />)

		expect(screen.getByText(/19:45/)).toBeInTheDocument()
	})

	it('renders empty state when fixture is null', () => {
		render(<Fixtures fixture={null} />)

		expect(screen.getByText(/no upcoming fixture/i)).toBeInTheDocument()
	})

	it('shows Home fixture indicator', () => {
		render(<Fixtures fixture={mockFixture} />)

		expect(screen.getByText(/home/i)).toBeInTheDocument()
	})

	it('shows Away fixture indicator for away games', () => {
		render(<Fixtures fixture={{ ...mockFixture, isHome: false }} />)

		expect(screen.getByText(/away/i)).toBeInTheDocument()
	})
})
