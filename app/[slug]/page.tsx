import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Shield } from "@/components/glyphs";
import { calculators } from "@/components/calculators/registry";
import { getTool, tools } from "@/lib/tools";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `/${tool.slug}` },
  };
}

export default async function CalculatorPage({ params }: Params) {
  const { slug } = await params;
  const tool = getTool(slug);
  const Calculator = calculators[slug];
  if (!tool || !Calculator) notFound();

  // the three calculators that follow this one in the list
  const index = tools.findIndex((t) => t.slug === slug);
  const more = [1, 2, 3].map((n) => tools[(index + n) % tools.length]);

  return (
    <main className="mx-auto max-w-6xl px-5 pb-8">
      <nav aria-label="Breadcrumb" className="pt-6 text-sm text-ink-soft">
        <Link href="/" className="underline-offset-4 hover:underline">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{tool.name}</span>
      </nav>

      <div className="mt-5 flex items-center gap-4 sm:gap-5">
        <Shield glyph={tool.glyph} tone={tool.tone} size={64} />
        <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {tool.name}
        </h1>
      </div>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{tool.description}</p>

      <div className="mt-8">
        <Calculator />
      </div>

      <section className="mt-20 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 className="font-display text-2xl font-bold">How it is worked out</h2>
          <p className="mt-4 rounded-2xl bg-paper-deep/70 p-5 text-lg font-medium leading-relaxed">
            {tool.formula}
          </p>
        </div>
        <div className="lg:col-span-6">
          <h2 className="font-display text-2xl font-bold">Good to know</h2>
          <ul className="mt-4 space-y-3">
            {tool.tips.map((tip) => (
              <li key={tip} className="flex gap-3 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-hwy ring-2 ring-ink"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-display text-2xl font-bold">Next calculators</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {more.map((t) => (
            <Link
              key={t.slug}
              href={`/${t.slug}`}
              className="group flex items-center gap-4 rounded-2xl border-2 border-ink/80 bg-card p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_6px_0_var(--color-ink)]"
            >
              <Shield glyph={t.glyph} tone={t.tone} size={44} />
              <span>
                <span className="block font-display text-lg font-bold leading-tight">{t.name}</span>
                <span className="mt-0.5 block text-sm text-ink-soft">{t.get}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
