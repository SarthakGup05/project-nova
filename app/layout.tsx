import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      {/* antialiased makes the font render slightly thinner and crisper on modern displays */}
      <body className="font-sans bg-background text-foreground antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}