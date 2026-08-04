import type { Metadata } from "next";
import { Syne, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { Toaster } from "sonner";
import GlobalBackground from "@/components/GlobalBackground";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ZPAY — Agentic Global Payment Router",
  description: "Send money to anyone, anywhere — instantly. AI agents transact 24/7 on your behalf with sub-cent fees on the Stellar network. Universal IDs, escrow, UPI bridge, and more.",
  metadataBase: new URL("https://zpayrouter.me"),
  openGraph: {
    title: "ZPAY — Agentic Global Payment Router",
    description: "Cross-border payments, escrow, group bills, and on-chain savings — all on Stellar. Send to alice@Zp instead of a 56-char wallet address.",
    url: "https://zpayrouter.me",
    siteName: "ZPAY",
    images: [
      {
        url: "/images/dashboard_hero.png",
        width: 1200,
        height: 630,
        alt: "ZPAY Dashboard — Agentic Global Payment Router",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZPAY — Agentic Global Payment Router",
    description: "Send money to anyone, anywhere — instantly. AI agents transact 24/7 on your behalf with sub-cent fees.",
    site: "@Zpayroute",
    creator: "@Zpayroute",
    images: ["/images/dashboard_hero.png"],
  },
  keywords: ["payments", "stellar", "blockchain", "crypto", "cross-border", "escrow", "AI agents", "x402", "UPI", "ZPAY"],
  authors: [{ name: "ZPAY Technologies" }],
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${plusJakarta.variable}`}>
      <body className="antialiased bg-black font-[family-name:var(--font-jakarta)] text-white">
        <GlobalBackground />
        <ErrorReporter />
        <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#18181b',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              },
            }}
          />
          <VisualEditsMessenger />
      </body>
    </html>
  );
}
