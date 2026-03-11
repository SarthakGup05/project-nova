import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Navbar } from "@/components/home/navbar";
import { WaitlistCTA } from "@/components/home/waitlist-cta";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <Navbar />
      <Hero />
      <Features />
      <WaitlistCTA />
    </main>
  );
}
