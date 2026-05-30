"use client";

import React, { useState } from "react";
import { Mail, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function EmailSubscriptionSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    // Simulate network latency
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you for subscribing! Check your inbox for healthcare tips.");
      setEmail("");
    }, 1200);
  };

  return (
    <section className="bg-background py-20 lg:py-24 relative overflow-hidden">
      
      {/* Background soft glowing circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Card Layout */}
        <div className="bg-card border border-border/85 rounded-3xl p-8 md:p-12 shadow-sm text-center max-w-4xl mx-auto relative overflow-hidden">
          
          {/* Subtle side design lines */}
          <div className="absolute top-0 bottom-0 left-0 w-[4px] bg-gradient-to-b from-primary via-primary/30 to-transparent" />
          
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Stay Updated with Wellness Insights
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Subscribe to our weekly newsletter to receive clinical health tips, upcoming specialty checkup campaigns, and priority access to slot bookings.
              </p>
            </div>

            {/* Newsletter Input Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your professional email..."
                  className="w-full pl-10 pr-4 h-10.5 rounded-xl border-border bg-background/50 focus-visible:ring-1"
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="h-10.5 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-colors flex items-center justify-center gap-2 px-6 shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Subtext info */}
            <p className="text-[11px] text-muted-foreground/60">
              We respect your privacy. Opt-out at any single click. No third-party spam.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}
