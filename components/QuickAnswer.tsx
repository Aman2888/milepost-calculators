/** A short, self-contained answer placed right under the page title. */
export default function QuickAnswer({ children }: { children: string }) {
  return (
    <p className="mt-6 max-w-3xl rounded-2xl border-l-[6px] border-hwy bg-card px-5 py-4 text-lg leading-relaxed">
      <span className="font-display font-bold">In short: </span>
      {children}
    </p>
  );
}
