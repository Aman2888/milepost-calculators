import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="font-display text-7xl font-extrabold">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">That road does not go anywhere</h1>
      <p className="mt-3 text-lg text-ink-soft">
        The page you wanted is missing or the link has changed. Pick a calculator from the list
        and you are back on the route.
      </p>
      <Link
        href="/#tools"
        className="mt-8 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-white transition-colors hover:bg-sign"
      >
        See all calculators
      </Link>
    </main>
  );
}
