import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import ToastProvider from "@/components/ToastProvider";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://eleczen.app"),
  title: {
    default: "ElecZen | AI-Powered Electronics Platform",
    template: "%s | ElecZen",
  },
  description:
    "The ultimate platform for electronics engineers. Design, simulate, and discover components with AI-powered tools like Circuit Recognizer and Component Scanner.",
  keywords: [
    "electronics",
    "circuit design",
    "simulation",
    "PCB",
    "AI tools",
    "component encyclopedia",
    "engineering",
    "IoT",
    "Arduino",
    "ESP32",
  ],
  authors: [{ name: "ElecZen Team" }],
  creator: "ElecZen",
  publisher: "ElecZen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/eleczen_favicon_32.png", sizes: "32x32", type: "image/png" },
      { url: "/eleczen_favicon_64.png", sizes: "64x64", type: "image/png" },
      { url: "/eleczen_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/eleczen_198.png", sizes: "198x198", type: "image/png" },
      { url: "/eleczen_512.png", sizes: "512x512", type: "image/png" },
    ],
    other: [{ rel: "mask-icon", url: "/icon.svg", color: "#00f3ff" }],
  },
  openGraph: {
    title: "ElecZen | AI-Powered Electronics Platform",
    description:
      "Design, simulate, and discover components with AI-powered tools.",
    url: "https://eleczen.app",
    siteName: "ElecZen",
    images: [
      {
        url: "/og-image.jpg", // We'll need to create this
        width: 1200,
        height: 630,
        alt: "ElecZen Platform Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElecZen | AI-Powered Electronics Platform",
    description: "The ultimate platform for electronics engineers.",
    creator: "@eleczen",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "ElecZen",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black text-white selection:bg-neon-blue/30 relative`}
      >
        {/* Background Grid Effect */}
        <div
          className="fixed inset-0 z-[-1] opacity-20 pointer-events-none"
          style={{ backgroundImage: 'url("/grid.svg")' }}
        />

        <Providers>
          <ToastProvider />
          <Navbar />
          <main className="pt-16 min-h-screen">{children}</main>
          <BottomNav />
        </Providers>
      </body>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3992023609980021"
        crossOrigin="anonymous"></script>
    </html>
  );
}
