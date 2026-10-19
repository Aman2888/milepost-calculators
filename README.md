# Milepost

Ten free car and driving calculators plus four vehicle lookups (VIN, recalls, safety ratings, owner complaints) that use official NHTSA data. Built with Next.js (App Router), TypeScript and Tailwind CSS v4.

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
| VIN Decoder | `/vin-decoder` |
| Car Recall Check | `/recall-checker` |
| Vehicle Safety Ratings | `/vehicle-safety-ratings` |
| Car Complaints by Model | `/common-problems-lookup` |

## Where things live

- `lib/calc.ts`: all the maths, as plain functions with no React
- `lib/tools.ts`: names, descriptions, formulas and tips for every calculator (also drives the SEO titles)
- `lib/site.ts`: site name, logo and URL, read from environment variables
- `components/calculators/`: one client component per calculator. `registry.ts` maps every slug (calculators and lookups) to its component
- `components/lookups/`: the four NHTSA lookup tools, the year/make/model picker and shared pieces
- `app/api/nhtsa/route.ts`: the server route the lookups call (see below)
- `lib/nhtsa.ts`: response types and formatting helpers shared by the route and the lookups
- `components/ui.tsx`: inputs, the highway-sign result panel and small charts
- `app/globals.css`: colours and fonts (Tailwind `@theme` tokens)

Set `NEXT_PUBLIC_SITE_URL` (for example `https://yoursite.com`) before deploying so canonical links and the sitemap use your real domain.

## The NHTSA lookups

The four lookups use NHTSA's free public APIs (no API key needed):

| Tool | NHTSA API |
|---|---|
| VIN Decoder | vPIC `DecodeVinValues` |
| Car Recall Check | `recalls/recallsByVehicle` |
| Vehicle Safety Ratings | `SafetyRatings` (5-Star program) |
| Car Complaints by Model | `complaints/complaintsByVehicle` |

The browser never talks to NHTSA directly. It calls `/api/nhtsa`, a small server route that:

- only builds fixed NHTSA URLs from inputs it has checked, so it cannot be used as an open proxy,
- caches the make and model lists and the recall, rating and complaint results on the server for an hour to a day (via Next's fetch cache). VINs are never cached,
- trims the replies down to what the pages use (for example the complaints route sends the counts per problem area and the 50 newest complaints, not thousands of rows).

So the site needs a running Node server (`npm start`, Vercel and similar hosts are fine). A fully static export (`output: "export"`) would not work for the lookups.

Two optional environment variables point the route at a different server, which is useful for tests with a fake NHTSA:
`NHTSA_API_BASE` (default `https://api.nhtsa.gov`) and `NHTSA_VPIC_BASE` (default `https://vpic.nhtsa.dot.gov/api/vehicles`).

Things worth knowing about the data:

- The recall list is per model year. NHTSA's public API cannot say whether one specific car has had the repair. The page says so and links to NHTSA's own VIN recall search.
- Complaints are unverified owner reports, and safety ratings only exist for models NHTSA has tested.
- The recall and complaint APIs return slash dates in different orders. The route works the order out from the data (a day above 12 gives it away) before turning them into ISO dates.
- The site is not affiliated with NHTSA. The footer says so, using whatever name `NEXT_PUBLIC_SITE_NAME` is set to.

## SEO, AEO, GEO and LLMO

The site is set up for search engines, answer boxes and AI assistants. See **`SEO-PLAN.md`** for the full list, the launch checklist and the off-page plan. In short:

- `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts` and `app/llms-full.txt/route.ts` build `/sitemap.xml`, `/robots.txt`, `/llms.txt` and `/llms-full.txt`.
- `lib/content.ts` holds the "In short" answer, worked example and FAQs for each tool. The same text is shown on the page, sent as FAQ structured data and written into `/llms-full.txt`. **When you add a tool, add its entry here too** (the page returns 404 without it).
- `lib/seo.ts` builds the page metadata and the JSON-LD. `components/JsonLd.tsx`, `Faq.tsx` and `QuickAnswer.tsx` render them.
- Share images are generated: `app/opengraph-image.tsx` (home) and `app/[slug]/opengraph-image.tsx` (every tool).
- Environment variables (set before you build): `NEXT_PUBLIC_SITE_URL` (required), `NEXT_PUBLIC_SITE_NAME` (default Milepost), `NEXT_PUBLIC_LOGO_URL` (optional path such as `/brand.png`, or a full image URL), `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_SOCIAL_URLS`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION`, `ALLOW_AI_CRAWLERS`. See `lib/site.ts`.
- `CONTENT_UPDATED` in `lib/site.ts` is the "last reviewed" date. Change it when you edit written content.
- The Privacy page says the site sets no cookies and runs no analytics. If you add analytics, update `app/privacy/page.tsx`.

## Adding another calculator

1. Add the maths to `lib/calc.ts`.
2. Add an entry to `lib/tools.ts`.
3. Add its answer, example, FAQs and related tools to `lib/content.ts`.
4. Create the component in `components/calculators/` and register it in `registry.ts`.

## Adding another lookup

1. Add a new `op` to `app/api/nhtsa/route.ts` (check the inputs, build the URL, trim the reply) and its types to `lib/nhtsa.ts`.
2. Add an entry to `lib/tools.ts` with `kind: "lookup"`, and its content to `lib/content.ts`.
3. Build the component in `components/lookups/` (`VehiclePicker` and `useLookup` do most of the work) and register it in `components/calculators/registry.ts`.
