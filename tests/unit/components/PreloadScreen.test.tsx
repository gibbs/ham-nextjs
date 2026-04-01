import { render, screen } from '@testing-library/react'
import PreloadScreen from '@/components/PreloadScreen'

describe('PreloadScreen', () => {
	it('renders loading spinner when no error', () => {
		render(<PreloadScreen error={null} />)

		expect(screen.getByText('Ham Dashboard')).toBeInTheDocument()
		expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
		expect(screen.getByText(/loading data/i)).toBeInTheDocument()
	})

	it('renders error message when error is provided', () => {
		render(<PreloadScreen error="HTTP 500" />)

		expect(screen.getByText('HTTP 500')).toBeInTheDocument()
		expect(screen.queryByRole('status')).not.toBeInTheDocument()
	})
})
