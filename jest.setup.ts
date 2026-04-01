import '@testing-library/jest-dom'
import enMessages from '@/i18n/messages/en.json'

function lookupMessage(namespace: string | undefined, key: string): string {
	const fullKey = namespace ? `${namespace}.${key}` : key
	const value = fullKey.split('.').reduce<unknown>((acc, part) => {
		if (acc && typeof acc === 'object' && part in acc) {
			return (acc as Record<string, unknown>)[part]
		}

		return undefined
	}, enMessages)

	if (typeof value === 'string') {
		return value
	}

	return key
}

jest.mock('next-intl', () => ({
	useTranslations: (namespace?: string) => {
		return (key: string, values?: Record<string, string | number>) => {
			const template = lookupMessage(namespace, key)

			if (!values) {
				return template
			}

			return template.replace(/\{(\w+)\}/g, (_m, token: string) => {
				return String(values[token] ?? `{${token}}`)
			})
		}
	},
	NextIntlClientProvider: ({ children }: { children: unknown }) => children,
}))
