import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HAOFLOW | Creative Digital Agency",
  description: "Crafting digital experiences that push boundaries and inspire creativity. Design, Develop, Animate, Launch.",
  keywords: ["design", "development", "creative", "digital", "agency", "web", "motion"],
  authors: [{ name: "HAOFLOW" }],
  openGraph: {
    title: "HAOFLOW | Creative Digital Agency",
    description: "Crafting digital experiences that push boundaries and inspire creativity.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}