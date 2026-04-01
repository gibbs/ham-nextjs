import { render, screen, act } from '@testing-library/react'
import DateTime from '@/components/DateTime'

describe('DateTime', () => {
	beforeEach(() => {
		jest.useFakeTimers()
		jest.setSystemTime(new Date('2026-03-31T14:30:00Z'))
	})

	afterEach(() => {
		jest.useRealTimers()
	})

	it('renders date and time after mount', async () => {
		render(<DateTime />)

		await act(async () => {
			jest.advanceTimersByTime(100)
		})

		const el = screen.getByTestId('datetime')

		expect(el).toBeInTheDocument()
	})

	it('updates every second', async () => {
		render(<DateTime />)

		await act(async () => {
			jest.advanceTimersByTime(100)
		})

		const before = screen.getByLabelText(/current time/i).textContent

		await act(async () => {
			jest.advanceTimersByTime(1000)
		})

		const after = screen.getByLabelText(/current time/i).textContent

		// After 1 second the seconds digit should change
		expect(before).not.toBe(after)
	})
})
