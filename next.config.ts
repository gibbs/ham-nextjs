import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
	serverExternalPackages: ['rss-parser'],
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'ichef.bbci.co.uk' },
			{ protocol: 'https', hostname: 'upload.wikimedia.org' },
			{ protocol: 'https', hostname: 'images.unsplash.com' },
		],
	},
}

export default withNextIntl(nextConfig)
