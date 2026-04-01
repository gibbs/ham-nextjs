import { render, screen } from '@testing-library/react'
import NewsHeadlines from '@/components/NewsHeadlines'
import type { NewsArticle } from '@/types'

const mockArticles: NewsArticle[] = [
	{
		title: 'Breaking: Something happened',
		description: 'Full details here.',
		link: 'https://bbc.co.uk/1',
		pubDate: new Date(Date.now() - 1000 * 60 * 30).toUTCString(), // 30m ago
		source: 'BBC News',
		thumbnailUrl: 'https://example.com/thumb-1.jpg',
	},
	{
		title: 'Another story',
		description: '',
		link: 'https://bbc.co.uk/2',
		pubDate: new Date(Date.now() - 1000 * 60 * 60 * 3).toUTCString(), // 3h ago
		source: 'BBC News',
	},
]

describe('NewsHeadlines', () => {
	it('renders article headlines', () => {
		render(<NewsHeadlines articles={mockArticles} />)

		expect(screen.getByText('Breaking: Something happened')).toBeInTheDocument()
		expect(screen.getByText('Another story')).toBeInTheDocument()
	})

	it('renders the source label', () => {
		render(<NewsHeadlines articles={mockArticles} />)

		expect(screen.getByText('BBC News')).toBeInTheDocument()
	})

	it('renders article links', () => {
		render(<NewsHeadlines articles={mockArticles} />)
		const links = screen.getAllByRole('link')

		expect(links[0]).toHaveAttribute('href', 'https://bbc.co.uk/1')
	})

	it('shows relative time', () => {
		render(<NewsHeadlines articles={mockArticles} />)

		expect(screen.getByText('30m ago')).toBeInTheDocument()
		expect(screen.getByText('3h ago')).toBeInTheDocument()
	})

	it('renders a thumbnail when one is provided', () => {
		render(<NewsHeadlines articles={mockArticles} />)

		expect(
			screen.getByAltText('Breaking: Something happened thumbnail')
		).toHaveAttribute('src', 'https://example.com/thumb-1.jpg')
	})

	it('renders empty state when no articles', () => {
		render(<NewsHeadlines articles={[]} />)

		expect(screen.getByText(/no news/i)).toBeInTheDocument()
	})
})
