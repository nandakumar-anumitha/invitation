import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    "Join V. Nandakumar and K. Anumitha for their engagement ceremony on 23.08.2026 at Prem Mahal, Mathur.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "V. Nandakumar & K. Anumitha Engagement Invitation",
    description:
      "You are invited to celebrate their engagement on 23.08.2026 at 10:30 AM.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Engagement invitation for V. Nandakumar and K. Anumitha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "V. Nandakumar & K. Anumitha Engagement Invitation",
    description:
      "You are invited to celebrate their engagement on 23.08.2026 at 10:30 AM.",
    images: ["/og.png"],
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
