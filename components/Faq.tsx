import type { Faq as FaqItem } from "@/lib/content";

/** Visible questions and answers. The same list is also sent as FAQPage structured data. */
export default function Faq({ items, title = "Frequently asked questions" }: { items: FaqItem[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title" className="mt-20">
      <h2 id="faq-title" className="font-display text-2xl font-bold">
        {title}
      </h2>
      <dl className="mt-5 grid gap-x-10 gap-y-7 lg:grid-cols-2">
        {items.map((f) => (
          <div key={f.q}>
            <dt className="font-display text-lg font-bold leading-snug">{f.q}</dt>
            <dd className="mt-2 leading-relaxed text-ink-soft">{f.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
