import Link from "next/link";
import { MilepostMark } from "@/components/glyphs";
import { SITE_NAME } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
          <MilepostMark className="h-9 w-7" />
          <span className="font-display text-2xl font-extrabold tracking-tight">{SITE_NAME}</span>
        </Link>
        <Link
          href="/#tools"
          className="rounded-full border-2 border-ink px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink hover:text-white"
        >
          All tools
        </Link>
      </div>
      <div className="centerline" aria-hidden="true" />
    </header>
  );
}
