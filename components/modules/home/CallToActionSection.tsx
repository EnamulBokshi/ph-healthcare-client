import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallToActionSection() {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Sleek CTA Card Container */}
        <div className="relative overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black p-8 md:p-12 lg:p-16 shadow-2xl text-white">
          
          {/* Glowing Accents */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-64 w-64 rounded-full bg-zinc-700/10 blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Title & Copy */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                Ready to Take Control of <br />
                Your Family’s Health?
              </h2>
              <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed">
                Join thousands of patients who enjoy premium medical attention, instant pharmacy dispatch, and detailed diagnostics coordination. Getting quality healthcare has never been this simple.
              </p>
              
              {/* Bullets List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  "No hidden clinical booking charges",
                  "Secure encrypted clinical files",
                  "Free prescription download PDF",
                  "24/7 client booking assistance",
                ].map((bullet, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-zinc-200">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Buttons Column */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 items-stretch lg:items-end w-full">
              <Link href="/register" className="w-full sm:flex-1 lg:flex-initial">
                <Button size="lg" className="w-full rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group">
                  <span>Create Free Account</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/consultation" className="w-full sm:flex-1 lg:flex-initial">
                <Button variant="outline" size="lg" className="w-full rounded-xl font-semibold border-zinc-700 hover:bg-zinc-800 text-white">
                  <span>Browse Specialists</span>
                </Button>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
