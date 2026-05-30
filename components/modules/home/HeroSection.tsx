import React from "react";
import Link from "next/link";
import { ArrowRight, Stethoscope, ShieldCheck, Activity, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-28">
      
      {/* Decorative Blur Background Circles */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-10 right-10 -z-10 h-60 w-60 rounded-full bg-primary/5 blur-2xl" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(120,120,120,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.04)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Area */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Trusted Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <SparklesIcon className="h-3.5 w-3.5 animate-spin" />
              <span>Your Trusted 24/7 Digital Health Partner</span>
            </div>

            {/* Main Catchy Title */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl leading-tight">
              Your Health Journey, <br className="hidden sm:inline" />
              Guided by <span className="text-primary bg-clip-text">Premium Specialists</span>
            </h1>

            {/* Supporting Pitch */}
            <p className="mx-auto lg:mx-0 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Connect instantly with top verified doctors, schedule lab tests, buy authentic medicines, and secure customized health plans. All within a single, highly-secure platform designed for your peace of mind.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/consultation" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 group shadow-lg shadow-primary/10">
                  <span>Book an Appointment</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/health-plans" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-xl font-semibold border-border hover:bg-muted">
                  <span>Explore Health Plans</span>
                </Button>
              </Link>
            </div>

            {/* Feature Badges list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <span>100% Verified Doctors</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground">
                <Activity className="h-5 w-5 text-primary shrink-0" />
                <span>Smart Prescriptions</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground sm:col-span-1 col-span-2">
                <Award className="h-5 w-5 text-primary shrink-0" />
                <span>Premium Diagnostics</span>
              </div>
            </div>

          </div>

          {/* Visual Interactive Graphic (Right Side) */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Visual Glassmorphic Art Board */}
            <div className="relative w-full max-w-[400px] h-[400px] sm:h-[450px] rounded-3xl border border-border/80 bg-card p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
              
              {/* Abstract soft background wave */}
              <div className="absolute -top-1/4 -right-1/4 w-72 h-72 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500 blur-2xl" />

              {/* Card Header Graphic */}
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Digital Clinic</h3>
                    <p className="text-[10px] text-muted-foreground">Live Teleconsultation</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 animate-pulse">
                  ● Online
                </span>
              </div>

              {/* Central Illustration Area */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 space-y-4">
                <div className="relative h-28 w-28 rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center shadow-inner">
                  <Stethoscope className="h-12 w-12 text-primary animate-bounce" />
                  {/* Small floating tags */}
                  <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                    +
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-sm font-bold text-foreground">Select Your Specialty</h4>
                  <p className="text-[11px] text-muted-foreground max-w-[220px] mx-auto mt-1">
                    Cardiology, Pediatrics, Orthopedics, General Medicine & more.
                  </p>
                </div>
              </div>

              {/* Card Footer Interactive Callouts */}
              <div className="border-t border-border/60 pt-4 space-y-2">
                <div className="flex justify-between items-center bg-muted/50 p-2.5 rounded-xl border border-border/40">
                  <span className="text-[11px] font-semibold text-muted-foreground">Average Consultation Fee</span>
                  <span className="text-xs font-bold text-foreground">$25 - $50</span>
                </div>
                <div className="flex justify-between items-center bg-muted/50 p-2.5 rounded-xl border border-border/40">
                  <span className="text-[11px] font-semibold text-muted-foreground">Booking Duration</span>
                  <span className="text-xs font-bold text-primary">Instant Response</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Dynamic Fact Grid Banner at Bottom */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 rounded-3xl border border-border/80 bg-card/50 backdrop-blur-sm p-8 text-center shadow-lg">
          {[
            { value: "500+", label: "Verified Specialists" },
            { value: "15k+", label: "Successful Consultations" },
            { value: "99.2%", label: "Patient Satisfaction" },
            { value: "24/7", label: "Instant Clinic Support" },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">{stat.value}</h3>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// Custom Micro Sparkles icon
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
    </svg>
  );
}
