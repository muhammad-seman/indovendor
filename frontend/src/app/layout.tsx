import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IndoVendor - EO/WO Marketplace Indonesia",
  description: "Platform marketplace terpercaya untuk Event Organizer dan Wedding Organizer di Indonesia. Temukan vendor terbaik untuk acara impian Anda.",
  keywords: ["event organizer", "wedding organizer", "marketplace", "indonesia", "EO", "WO"],
  authors: [{ name: "IndoVendor Team" }],
  openGraph: {
    title: "IndoVendor - EO/WO Marketplace Indonesia",
    description: "Platform marketplace terpercaya untuk Event Organizer dan Wedding Organizer di Indonesia",
    type: "website",
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
