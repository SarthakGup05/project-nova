import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/20">
      <div className="container flex h-16 max-w-6xl mx-auto items-center justify-between px-4 md:px-6">
        
        {/* 1. Refined Logo Section */}
        <Link href="/" className="flex items-center space-x-2.5 transition-opacity hover:opacity-80 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/20 transition-all duration-300">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">
            Nova<span className="text-primary">.</span>
          </span>
        </Link>

        {/* 2. Floating Pill Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/40 bg-card/30 px-1.5 py-1.5 shadow-sm backdrop-blur-md">
          {['Features', 'Pricing', 'About'].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all rounded-full hover:bg-secondary hover:text-foreground"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* 3. Action Buttons & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="h-9 px-4 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-transparent">
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button className="h-9 rounded-full px-5 text-sm font-medium shadow-[0_0_15px_rgba(234,88,12,0.15)] hover:shadow-[0_0_25px_rgba(234,88,12,0.35)] hover:-translate-y-0.5 transition-all duration-300">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Hamburger */}
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
        
      </div>
    </header>
  );
}