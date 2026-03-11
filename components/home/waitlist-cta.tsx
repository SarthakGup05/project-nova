import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export function WaitlistCTA() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-background overflow-hidden border-t border-border/40">
      
      {/* Background Gradients & Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-4xl text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Currently in Private Beta</span>
        </div>

        {/* Headings */}
        <h2 className="text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Ready to stop managing tasks <br className="hidden md:block" />
          <span className="text-muted-foreground font-light text-3xl md:text-5xl lg:text-5xl inline-block mt-2">and start executing?</span>
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Join a curated group of early adopters using Nova to eliminate planning friction and reclaim their deep work.
        </p>

        {/* Form / CTA Area */}
        <div className="max-w-md mx-auto relative animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur-xl opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
            
            <form className="relative flex items-center bg-background border border-border/80 rounded-2xl shadow-xl overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
              <Input 
                type="email" 
                placeholder="Enter your email address..." 
                className="flex-1 border-0 bg-transparent h-12 px-4 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                required
              />
              <Button type="submit" size="lg" className="h-12 rounded-xl px-6 font-medium shadow-none">
                Join Waitlist
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

          <p className="text-xs text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            No spam. Unsubscribe anytime.
          </p>
        </div>

      </div>
    </section>
  );
}
