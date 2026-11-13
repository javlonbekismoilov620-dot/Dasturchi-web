import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ToastProvider } from "@/components/ui/toast";
import { themeScript } from "@/components/ui/theme";
import "./globals.css";

const geist = Geist({ subsets: ["latin", "latin-ext"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dasturchi — IT, dizayn, 3D va video montajni noldan o‘rganing",
    template: "%s · Dasturchi",
  },
  description:
    "O‘zbek tilidagi premium ta’lim platformasi: dasturlash, dizayn, 3D, video montaj va zamonaviy texnologiyalarni mutlaqo noldan professional darajagacha o‘rganing.",
  applicationName: "Dasturchi",
  keywords: ["dasturlash", "o‘zbek tilida", "onlayn kurs", "HTML", "Python", "Blender", "video montaj", "Figma", "UI dizayn"],
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "Dasturchi",
    title: "Dasturchi — bilimni o‘zlashtiring, mahorat yarating",
    description: "IT, dizayn, 3D, video montaj va zamonaviy texnologiyalarni noldan professional darajagacha o‘rganing.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#08080a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uz"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain antialiased">
        <a
          href="#asosiy"
          className="sr-only z-[100] rounded-lg bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Asosiy kontentga o‘tish
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
