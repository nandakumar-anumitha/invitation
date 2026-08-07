import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = "https://nandakumar-anumitha.github.io/invitation/";
const ogImageUrl =
  "https://nandakumar-anumitha.github.io/invitation/og-whatsapp-big.jpg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "V. Nandakumar & K. Anumitha Engagement Invitation",
  description:
    "Join V. Nandakumar and K. Anumitha for their promise ceremony on 23.08.2026 at Prem Mahal, Mathur.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "V. Nandakumar & K. Anumitha Engagement Invitation",
    description:
      "You are invited to celebrate their engagement on 23.08.2026 at 10:30 AM.",
    url: siteUrl,
    siteName: "Nandakumar & Anumitha Engagement Invitation",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 1200,
        type: "image/jpeg",
        alt: "Engagement invitation for V. Nandakumar and K. Anumitha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "V. Nandakumar & K. Anumitha Engagement Invitation",
    description:
      "You are invited to celebrate their engagement on 23.08.2026 at 10:30 AM.",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
