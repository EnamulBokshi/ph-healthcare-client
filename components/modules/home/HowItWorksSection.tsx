import React from "react";
import { Search, CalendarDays, FileText, ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Find Your Specialist",
      description: "Search from hundreds of certified medical practitioners by clinical specialty, experience levels, average ratings, or appointment fees.",
      icon: Search,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      number: "02",
      title: "Select & Confirm Slot",
      description: "Browse available real-time schedules, pick an online teleconsultation or offline clinic visit slot, and complete booking in seconds.",
      icon: CalendarDays,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      number: "03",
      title: "Consult & Receive Care",
      description: "Engage in highly-encrypted live video sessions, obtain digital smart prescriptions, and automatically sync your laboratory tests.",
      icon: FileText,
      color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <section className="bg-muted/30 py-20 lg:py-24 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Header Description */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Three Steps to Better Health
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            How HealthCare Works
          </h2>
          <p className="text-base text-muted-foreground">
            Getting professional healthcare should be straightforward. We have streamlined the entire process from specialist discovery to digital diagnosis.
          </p>
        </div>

        {/* 3 Step Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector line for large screens */}
          <div className="hidden lg:block absolute top-[68px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-violet-500/20 -z-10" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index} 
                className="relative flex flex-col items-center text-center bg-card rounded-2xl border border-border/80 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/40 group"
              >
                
                {/* Float Step Number */}
                <span className="absolute top-4 right-6 text-3xl font-black text-muted/20 group-hover:text-primary/15 transition-colors select-none">
                  {step.number}
                </span>

                {/* Step Circle Icon Wrapper */}
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} shadow-inner transition-transform duration-300 group-hover:scale-105 mb-6`}>
                  <Icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  {step.description}
                </p>

                {/* Micro Indicator Arrow */}
                {index < 2 && (
                  <div className="hidden md:flex lg:hidden absolute -right-4 top-[84px] h-8 w-8 items-center justify-center rounded-full border border-border bg-background shadow-sm text-muted-foreground -mr-1">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
