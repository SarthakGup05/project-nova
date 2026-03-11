import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Inter is the gold standard for clean, modern SaaS interfaces
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// JetBrains Mono perfectly fits the developer/power-user vibe
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nova | Next-Gen Task Management",
  description: "AI-augmented, zero-latency task management.",
};

// In modern Next.js, themeColor is exported via a separate viewport object
export const viewport: Viewport = {
  themeColor: "#ffffff", // Changed to white to match the new light theme notch/status bar
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Removed the "dark" class so the default light theme variables apply
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      {/* antialiased makes the font render slightly thinner and crisper on modern displays */}
      <body className="font-sans bg-background text-foreground antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}