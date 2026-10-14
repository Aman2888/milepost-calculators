// import type { Metadata } from "next";
// import { Bricolage_Grotesque, Figtree } from "next/font/google";
// import "./globals.css";
// import SiteHeader from "@/components/SiteHeader";
// import SiteFooter from "@/components/SiteFooter";
// import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// const display = Bricolage_Grotesque({
//   subsets: ["latin"],
//   variable: "--font-bricolage",
//   display: "swap",
// });

// const body = Figtree({
//   subsets: ["latin"],
//   variable: "--font-figtree",
//   display: "swap",
// });

// export const metadata: Metadata = {
//   metadataBase: new URL(SITE_URL),
//   title: {
//     default: `${SITE_NAME}: ${SITE_TAGLINE}`,
//     template: `%s | ${SITE_NAME}`,
//   },
//   description:
//     "Free calculators for fuel cost, MPG, EV charging, road trips, tire size, depreciation, wheel offset, horsepower, cost per mile and car loans.",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={`${display.variable} ${body.variable}`}>
//       <body className="min-h-screen antialiased">
//         <a
//           href="#main"
//           className="sr-only rounded-lg bg-ink px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
//         >
//           Skip to content
//         </a>
//         <SiteHeader />
//         <div id="main">{children}</div>
//         <SiteFooter />
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Overpass, Public_Sans } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

// Overpass is modelled on the lettering of US highway signs
const display = Overpass({
  subsets: ["latin"],
  variable: "--font-overpass",
  display: "swap",
});

const body = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Free calculators for fuel cost, MPG, EV charging, road trips, tire size, depreciation, wheel offset, horsepower, cost per mile and car loans.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only rounded-lg bg-ink px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}