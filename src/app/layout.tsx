import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dravion | Premium Web Agency & Digital Business Card SaaS",
    template: "%s | Dravion"
  },
  description: "Building digital experiences that grow businesses. Create your professional digital visiting card for free or hire our premium engineering agency for web, mobile, and AI solutions.",
  metadataBase: new URL("https://dravion.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dravion | Web Agency & Digital Card SaaS",
    description: "Create your free professional digital business card in minutes, or build custom enterprise websites and AI applications.",
    url: "https://dravion.site",
    siteName: "Dravion",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dravion | Web Agency & Digital Card SaaS",
    description: "Create your free professional digital business card in minutes.",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
