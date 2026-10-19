import { MilepostMark } from "@/components/glyphs";
import { SITE_LOGO } from "@/lib/site";

/** The header and footer mark. Uses NEXT_PUBLIC_LOGO_URL when set, otherwise the built-in mark. */
export default function SiteLogo({ className }: { className?: string }) {
  if (SITE_LOGO) {
    return <img src={SITE_LOGO} alt="" className={`object-contain ${className ?? ""}`} />;
  }
  return <MilepostMark className={className} />;
}
