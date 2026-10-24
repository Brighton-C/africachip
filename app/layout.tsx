import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { SITE_URL } from "@/lib/contact";

// To change the site fonts, swap these two. The mapping lives in globals.css.
const displayFont = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display-loaded",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AfricaChip | ECU remapping and diagnostics in Harare",
    template: "%s | AfricaChip",
  },
  description:
    "Professional vehicle tuning, diagnostics and ECU services at our workshop in Harare or at your location. Book online.",
  openGraph: {
    type: "website",
    siteName: "AfricaChip",
    locale: "en_ZW",
  },
  twitter: { card: "summary_large_image" },
  // Paste the token from Search Console here (step 2 below).
  verification: {
  google: "0Z1VhD9zuO1eZP8WoZcztrU3emNmYVB8JAvhFaZpyGo",
},
  
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}