import { ImageResponse } from "next/og";
import { OgFrame } from "@/components/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME}: ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <OgFrame>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 980 }}>
            Free car calculators for the cost of the drive.
          </div>
          <div style={{ fontSize: 34, color: "#4a5966" }}>
            Fuel cost, MPG and a VIN decoder, plus recall and complaint lookups
          </div>
        </div>
      </OgFrame>
    ),
    size,
  );
}
