import React from "react";
import { Star, Quote, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Elizabeth Mercer",
      location: "Dhaka, BD",
      role: "Patient (Cardiology Clinic)",
      rating: 5,
      quote: "The booking process was absolutely seamless. I managed to consult Dr. Jenkins within 30 minutes. The smart digital prescription sync was exceptionally helpful!",
      initials: "EM",
    },
    {
      name: "Rahman Al-Hasan",
      location: "Chittagong, BD",
      role: "Regular Patient (Pediatrics)",
      rating: 5,
      quote: "My pediatrician search resolved in seconds. Being able to browse authentic medical reviews and consult online saved us a trip to the crowded clinic.",
      initials: "RA",
    },
    {
      name: "Sophia Martinez",
      location: "Sylhet, BD",
      role: "Diagnostic Plan Member",
      rating: 5,
      quote: "Finding a diagnostic slot was simple. The lab reports synchronized straight to my patient dashboard, and my consulting physician reviewed them instantly.",
      initials: "SM",
    },
  ];

  return (
    <section className="bg-muted/20 py-20 lg:py-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Patient Stories
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Loved by Thousands of Patients
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            We are dedicated to offering the finest healthcare experiences. Read the real-world experiences of patients who booked specialist attention.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <div 
              key={idx} 
              className="bg-card border border-border/80 rounded-2xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-primary/30 transition-all duration-300 relative group"
            >
              
              {/* Quote Mark Decorative */}
              <Quote className="absolute top-6 right-8 h-10 w-10 text-muted/15 select-none" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />
                  ))}
                </div>
                
                {/* Quote Text */}
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{test.quote}"
                </p>
              </div>

              {/* Patient Bio */}
              <div className="flex items-center gap-3.5 border-t border-border/60 pt-5 mt-6">
                <Avatar className="h-10 w-10 border border-primary/20">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                    {test.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-foreground truncate flex items-center gap-1.5">
                    <span>{test.name}</span>
                    <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0" />
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate leading-normal">
                    {test.role} • {test.location}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
