import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Play,
  Command,
  Zap,
  Sparkles,
  CheckCircle2,
  ArrowUp,
  Calendar,
  Circle,
  Clock,
} from "lucide-react";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* ========================================== */}
          {/* LEFT COLUMN: Copy & Calls to Action        */}
          {/* ========================================== */}
          <div className="flex flex-col items-start text-left space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-[0_0_15px_rgba(56,19,208,0.05)]">
              <Zap className="mr-2 h-4 w-4 fill-primary" />
              <span className="tracking-wide">Now in Private Beta</span>
            </div>

            {/* Typography - NATURAL INLINE FLOW FIX */}
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl text-foreground leading-[1.15] max-w-2xl">
              Stop planning. <br className="hidden sm:block" />
              Start doing with{" "}
              {/* Inline block prevents the layout from stretching vertically */}
              <span className="relative inline-block align-middle whitespace-nowrap mt-2 sm:mt-0 ml-1">
                <ContainerTextFlip
                  words={["Nova.", "Velocity.", "Focus.", "Execution."]}
                  // Scaled the text size down slightly so the padding doesn't make the box dwarf the rest of the H1
                  className="text-4xl sm:text-5xl lg:text-6xl py-0.5 px-4 md:px-5 shadow-[0_10px_30px_rgba(56,19,208,0.2)] rounded-xl md:rounded-2xl"
                />
              </span>
            </h1>

            <p className="text-lg font-light text-muted-foreground md:text-xl leading-relaxed max-w-xl">
              Dump your thoughts. Let the AI build the plan. A zero-latency task
              manager that shifts the burden of organization from you to the
              system.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg font-medium rounded-full shadow-[0_0_30px_rgba(56,19,208,0.15)] hover:shadow-[0_0_40px_rgba(56,19,208,0.25)] hover:-translate-y-1 transition-all duration-300"
                >
                  Join the Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-normal rounded-full bg-background/50 backdrop-blur-md border-border hover:bg-secondary/40 hover:text-foreground transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof Mini-Section */}
            <div className="flex items-center gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden shadow-sm"
                  >
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="font-medium text-foreground/80">
                Trusted by{" "}
                <span className="text-foreground font-semibold">10,000+</span>{" "}
                doers.
              </p>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: Floating UI Composition      */}
          {/* ========================================== */}
          <div className="hidden lg:flex relative w-full aspect-square lg:aspect-auto lg:h-[550px] items-center justify-center animate-in slide-in-from-right-12 fade-in duration-1000 delay-300 fill-mode-both mt-0 lg:-mt-16">
            {/* Large Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 via-accent/5 to-transparent blur-[80px] rounded-full pointer-events-none" />

            <div className="relative w-full max-w-[540px] ml-4 md:ml-12 lg:ml-0">
              {/* =================================================== */}
              {/* Background Mock Card (The Task List)                */}
              {/* =================================================== */}
              <div className="absolute -top-28 -right-6 md:-right-16 w-full bg-background/95 backdrop-blur-md border border-border/80 rounded-2xl shadow-2xl p-6 md:p-7 rotate-6 hover:rotate-3 hover:-translate-y-2 transition-all duration-500 z-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-5 border-b border-border/40 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground text-base tracking-tight">
                      Today's Execution
                    </span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider bg-secondary text-muted-foreground px-2 py-1 rounded-md">
                    3 Tasks
                  </span>
                </div>

                {/* Realistic Task List */}
                <div className="space-y-3">
                  {[
                    {
                      title: "Finalize AWS Deployment",
                      time: "Today, 8:00 PM",
                      done: true,
                      tag: "Engineering",
                    },
                    {
                      title: "Email Sarah Q3 Targets",
                      time: "Tomorrow, 10:00 AM",
                      done: false,
                      tag: "Comms",
                    },
                    {
                      title: "Review Marketing Deck",
                      time: "Tomorrow, 2:00 PM",
                      done: false,
                      tag: "Review",
                    },
                  ].map((task, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${task.done ? "border-border/40 bg-secondary/20" : "border-border/60 bg-background shadow-sm"}`}
                    >
                      <div className="mt-0.5">
                        {task.done ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p
                          className={`text-base font-medium leading-none ${task.done ? "text-muted-foreground line-through" : "text-foreground"}`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock
                            className={`w-3 h-3 ${task.done ? "text-muted-foreground/50" : "text-accent"}`}
                          />
                          <span className="text-xs text-muted-foreground">
                            {task.time}
                          </span>
                          <span className="text-[10px] font-medium bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-sm ml-auto">
                            {task.tag}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* =================================================== */}
              {/* Foreground Mock Card (The AI Input)                 */}
              {/* =================================================== */}
              <div className="absolute -bottom-12 -left-6 md:-left-16 w-[110%] bg-background/80 backdrop-blur-2xl border border-border/80 rounded-2xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.15)] p-6 md:p-8 -rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shadow-inner">
                    <Sparkles className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-base font-semibold text-foreground tracking-tight">
                    AI Brain Dump
                  </span>
                  <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-[10px] font-mono font-medium text-muted-foreground shadow-sm">
                    <Command className="w-3 h-3" /> K
                  </div>
                </div>

                {/* Realistic Input Field */}
                <div className="relative w-full bg-background border border-primary/30 ring-4 ring-primary/5 rounded-xl p-4 mb-4 shadow-inner transition-all group hover:border-primary/50">
                  <p className="text-base text-foreground/90 font-medium leading-relaxed pr-8">
                    "Need to finalize the AWS deployment tonight and email Sarah
                    about the Q3 targets tomorrow at 10am."
                    {/* Blinking Cursor */}
                    <span className="inline-block w-0.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                  </p>

                  {/* Fake Submit Button */}
                  <div className="absolute bottom-3 right-3 w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105">
                    <ArrowUp className="w-4 h-4 text-primary-foreground" />
                  </div>
                </div>

                {/* Realistic AI Processing Tags */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    Extracting tasks...
                  </span>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-secondary text-muted-foreground rounded-md font-medium border border-border/50">
                      2 Tasks
                    </span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md font-medium border border-primary/20">
                      Auto-scheduling
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
