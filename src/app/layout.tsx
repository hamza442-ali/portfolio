import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { Footer } from "@/components/layout/Footer";
import { Mascot } from "@/components/mascot/Mascot";
import { Nav } from "@/components/layout/Nav";
import { Preloader } from "@/components/layout/Preloader";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const title = `${profile.name} · ${profile.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s · ${profile.name}`,
  },
  description: profile.shortBio,
  keywords: [
    "Ali Hamza",
    "software engineer",
    "full-stack developer",
    "Next.js",
    "React",
    "TypeScript",
    "Go",
    "Node.js",
    "AI engineer",
    "RAG",
    "Regensburg",
    "Germany",
  ],
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  openGraph: {
    type: "website",
    url: siteUrl,
    title,
    description: profile.shortBio,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: profile.shortBio,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/** Public-safe structured data only: no phone, no street address, no birth date. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.shortBio,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.location.city,
    addressCountry: "DE",
  },
  ...(profile.headshotOg ? { image: `${siteUrl}${profile.headshotOg}` } : {}),
  sameAs: [profile.social.github, profile.social.linkedin],
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Go", "PostgreSQL", "AWS", "Docker", "FastAPI", "RAG"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Preloader />
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
        <Mascot />
      </body>
    </html>
  );
}
