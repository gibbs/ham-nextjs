# Ham Dashboard

[![Test](https://github.com/gibbs/ham-nextjs/actions/workflows/test.yml/badge.svg)](https://github.com/gibbs/ham-nextjs/actions/workflows/test.yml)
[![Build](https://github.com/gibbs/ham-nextjs/actions/workflows/build.yml/badge.svg)](https://github.com/gibbs/ham-nextjs/actions/workflows/build.yml)

Ham personal dashboard SPA with Next.js, React and Tailwind.

## Setup

Copy `.env.example` to `.env` and fill the values you need:

## Local Development

Install dependencies:

```bash
npm install
```

Start the app only:

```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Local Development

The repo includes `compose-dev.yaml` for the app service dependencies.

```bash
docker compose -f compose-dev.yaml --build
docker compose -f compose-dev.yaml up -d
```

## Testing

Run unit tests:

```bash
npm test -- --ci
```

Run end-to-end tests:

```bash
npm run test:e2e
```
