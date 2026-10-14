# Milepost SEO, AEO, GEO and LLMO plan

Part 1 says what is already built into the code. Parts 2 to 5 are the things only the site owner can do: launch steps, off-page SEO, measuring, and what to build next.

Nobody can promise rankings or AI citations. A new domain usually needs several months before search results move, and AI assistants choose their sources in ways nobody controls. The plan below covers what is known to help, done honestly.

---

## 1. What the code already does

| Area | What was added |
|---|---|
| **Technical SEO** | `sitemap.xml` (only changes its "last modified" date when `CONTENT_UPDATED` changes), `robots.txt`, canonical link on every page, `noindex` on the 404 page, web manifest, icons, `theme-color`, security headers, `poweredByHeader` off, every page pre-rendered as static HTML |
| **On-page SEO** | One `<h1>` per page, titles under 60 characters (with brand), descriptions under 160, Open Graph and Twitter cards, a generated share image for the home page and for each of the 14 tools, breadcrumbs, hand-picked related-tool links, About and Privacy pages |
| **AEO** (answer engines, featured snippets, voice) | An "In short" answer block under every tool title, a worked example, and 4 visible FAQs per tool (6 on the home page), each written to stand alone as an answer |
| **Structured data** | JSON-LD for `Organization`, `WebSite`, `ItemList`, `WebApplication`, `BreadcrumbList`, `FAQPage` and `AboutPage`. Every FAQ in the markup is also visible on the page, which Google requires |
| **GEO / LLMO** (being quoted by ChatGPT, Claude, Perplexity, Gemini, Copilot) | `/llms.txt` (a map of the site for AI assistants), `/llms-full.txt` (all tool content in one plain-text file), explicit welcome for AI crawlers in `robots.txt`, fact-dense answers with real numbers, a visible "last reviewed" date, a named data source (NHTSA) and a clear "not affiliated" statement |

Every number in the worked examples was produced by the same formulas the calculators use.

### Settings (environment variables)

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Required before deploying.** Your real address, e.g. `https://milepost.com`. Without it canonical links, the sitemap and share images point at localhost |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shows a contact email on the About and Privacy pages and in the structured data |
| `NEXT_PUBLIC_SOCIAL_URLS` | Comma-separated profile links (X, YouTube, LinkedIn, GitHub...). Used as `sameAs` in the Organization data so search and AI systems link your brand to your profiles |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Code from Google Search Console |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Code from Bing Webmaster Tools |
| `ALLOW_AI_CRAWLERS` | `false` asks AI crawlers to stay out. Default is to allow them |

When you edit any written content (formulas, tips, FAQs), change `CONTENT_UPDATED` in `lib/site.ts`. It feeds the sitemap, the "last reviewed" line and the structured data. Do not bump it without a real change.

---

## 2. Launch checklist (week 1)

1. Buy the domain and deploy. Set `NEXT_PUBLIC_SITE_URL` first, then build.
2. Pick one address (with or without `www`) and redirect the other to it with a 301.
3. Open `/robots.txt`, `/sitemap.xml`, `/llms.txt` and view the source of a tool page. Check that every URL shows your domain.
4. **Google Search Console**: add the site, verify (set the verification variable and redeploy), submit `sitemap.xml`, then use URL Inspection to request indexing for the home page and the 14 tools.
5. **Bing Webmaster Tools**: add the site (you can import it from Search Console) and submit the sitemap. Bing's index feeds Copilot and is used by some AI search tools, so do not skip it.
6. **IndexNow** (optional): lets Bing, Yandex and others know about changed pages straight away. Google does not use it.
7. Test pages in the [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/). Test share previews by pasting a link into a chat app or social post.
8. Run PageSpeed Insights on the home page and a tool page on mobile.

---

## 3. Off-page SEO

Off-page SEO means other sites mentioning and linking to Milepost. It cannot be coded, and it matters a lot for competitive searches such as "VIN decoder", "recall check" and "auto loan calculator". These are crowded, so start with the long tail and with real usefulness.

### 3.1 Brand profiles and entity signals
- Create the same-named profiles on the platforms you will actually use: YouTube, X, LinkedIn page, Facebook page, Pinterest, Reddit account, GitHub, Product Hunt. Use the same name, logo (`public/logo.png`) and one-line description everywhere.
- Add them to `NEXT_PUBLIC_SOCIAL_URLS`.
- Keep the description factual and the same everywhere: "Free car calculators and vehicle lookups using official NHTSA data."
- "Milepost" is a common word. A distinctive domain and consistent wording help search and AI systems tell it apart from other things called Milepost.

### 3.2 Link building that works and is safe
1. **Resource pages.** Many car-buying guides, credit-union and university financial-literacy pages, EV owner clubs and driving-school sites keep lists of "useful car tools". Find them with searches like `"car calculators" resources`, `"VIN decoder" links` and `"auto loan calculator" helpful links`, then send a short, personal email suggesting the one tool that fits their page.
2. **Data-led stories.** Build a small page from the NHTSA data you already use, for example "the most-reported problem areas by make", then pitch it to auto bloggers, local news and consumer reporters. Original numbers earn links far more easily than another calculator.
3. **Expert quotes.** Services such as Qwoted, Featured and Source of Sources connect journalists with sources. Answer questions about car costs and recalls with real numbers and a link.
4. **Communities.** Answer questions in r/cars, r/MechanicAdvice, r/whatcarshouldIbuy, forums and Q&A sites. Give a real answer first, mention the tool only when it directly helps, and say it is yours. Links from these are usually `nofollow`, but they bring visitors and the brand mentions that AI assistants pick up.
5. **Broken-link outreach.** On the resource pages from step 1, look for dead links to old VIN or calculator tools and offer a working replacement.
6. **Video and images.** Short YouTube explainers ("how to read a tire size", "how to check a VIN for recalls") and Pinterest infographics of the formulas, each linking back to the matching tool.
7. **Partners.** Used-car dealers, insurance comparison blogs, car loan blogs and EV groups can embed or link to one specific tool.

### 3.3 Getting quoted by AI assistants (GEO and LLMO off-page)
AI assistants lean on pages that are (a) clear and factual, (b) mentioned on other trusted sites and (c) easy to fetch. The code covers (a) and (c). For (b):
- Be present where AI assistants read: Reddit, Quora, Stack Exchange (Motor Vehicle Maintenance & Repair), YouTube transcripts, GitHub, and news and blog sites.
- Get cited next to the primary source. Linking your recall tool to NHTSA and being linked from articles about recalls helps AI systems connect the two.
- Keep facts consistent across the site, your profiles and any press, so every source says the same thing about what Milepost is.

### 3.4 What to avoid
- Buying links, link networks, or large-scale link swaps.
- Mass-posting links in comments or forums.
- Fake reviews, or fake "as seen on" claims.
- Calling the site "official" or implying NHTSA endorses it. The site correctly says it is not affiliated.
- Publishing hundreds of thin, near-identical pages (see 5.2).

---

## 4. Measuring

| What | Where |
|---|---|
| Which searches show the site, and the average position | Google Search Console, Bing Webmaster Tools |
| Indexing problems | Search Console, "Pages" report |
| Whether AI assistants send visitors | Your host's access logs or referrer reports: look for `chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com` |
| Whether assistants quote you | Once a month, ask 10 or so real questions ("how do I decode a VIN", "does a 2018 Honda Civic have recalls", "how do I calculate a car loan payment") in each assistant and note whether Milepost is cited |

The site sets no cookies and runs no analytics, and the Privacy page says so. If you add an analytics tool, update `app/privacy/page.tsx` in the same change. A cookie-free option such as Plausible or Cloudflare Web Analytics keeps that page simple.

---

## 5. What to build next

### 5.1 Guides that feed the tools (highest value)
Each is 600 to 1,200 words with a short answer first, a worked example, and links to the tool:
1. How to read a VIN, character by character, linking to the VIN Decoder
2. How to read a tire sidewall, linking to the Tire Size Calculator
3. How to check a used car for recalls before you buy
4. What do NHTSA safety stars mean, and how do they differ from IIHS ratings
5. How much does it cost to charge an EV at home vs a public charger
6. How to work out your real MPG
7. How long should a car loan be? 48 vs 60 vs 72 months
8. How to read wheel offset and backspacing
9. Horsepower vs kilowatts vs PS
10. What does a car really cost per mile

### 5.2 Pages per vehicle (big opportunity, needs care)
People search for exact vehicles, such as "2018 Honda Civic recalls" or "2020 Toyota RAV4 problems". A page per year, make and model built from the NHTSA data could capture thousands of those searches. Do it only if each page has something of its own (counts, top problem areas, ratings, recall list) and is built from the real data. Search engines penalise large sets of thin, near-identical pages. Start with the 200 most popular models, check that they get indexed and get traffic, then expand.

### 5.3 Product features that earn links
- An embeddable version of each calculator, with a "Powered by Milepost" link.
- A downloadable CSV of a trip or loan result.

---

## 6. 30 / 60 / 90 days

| When | Do |
|---|---|
| **Days 1 to 30** | Launch checklist. Profiles. Publish guides 1 to 3. Submit to 5 to 10 relevant resource pages. Join 2 communities and start giving useful answers |
| **Days 31 to 60** | Guides 4 to 7. Build one data-led story from the NHTSA data and pitch it. Reply to journalist requests weekly. Check Search Console and fix anything flagged |
| **Days 61 to 90** | Guides 8 to 10. Start the per-vehicle pages with a small set (5.2). Review which pages get impressions and improve their titles and answers. Run the first AI-citation check |
