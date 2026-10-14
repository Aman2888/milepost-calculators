# Milepost

Ten free car and driving calculators, built with Next.js (App Router), TypeScript and Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start
```

## What is inside

| Page | Route |
|---|---|
| Fuel Cost Calculator | `/fuel-cost-calculator` |
| MPG Calculator | `/mpg-calculator` |
| EV Charging Cost Calculator | `/ev-charging-cost-calculator` |
| Road Trip Cost Calculator | `/road-trip-cost-calculator` |
| Tire Size Calculator | `/tire-size-calculator` |
| Car Depreciation Calculator | `/car-depreciation-calculator` |
| Wheel Offset Calculator | `/wheel-offset-calculator` |
| Horsepower Converter | `/horsepower-converter` |
| Cost Per Mile Calculator | `/cost-per-mile-calculator` |
| Auto Loan Calculator | `/auto-loan-calculator` |

## Where things live

- `lib/calc.ts`: all the maths, as plain functions with no React
- `lib/tools.ts`: names, descriptions, formulas and tips for every calculator (also drives the SEO titles)
- `lib/site.ts`: site name and URL. Rename the site here
- `components/calculators/`: one client component per calculator
- `components/ui.tsx`: inputs, the highway-sign result panel and small charts
- `app/globals.css`: colours and fonts (Tailwind `@theme` tokens)

Set `NEXT_PUBLIC_SITE_URL` (for example `https://yoursite.com`) before deploying so canonical links and the sitemap use your real domain.

## Adding an eleventh calculator

1. Add the maths to `lib/calc.ts`.
2. Add an entry to `lib/tools.ts`.
3. Create the component in `components/calculators/` and register it in `registry.ts`.
