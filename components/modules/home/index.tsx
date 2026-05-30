import React from "react";
import HeroSection from "./HeroSection";
import HowItWorksSection from "./HowItWorksSection";
import FeaturedConsultantsSection from "./FeaturedConsultantsSection";
import CallToActionSection from "./CallToActionSection";
import TestimonialSection from "./TestimonialSection";
import EmailSubscriptionSection from "./EmailSubscriptionSection";

export default function Home() {
  return (
    <div className="relative">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. How It Works Section */}
      <HowItWorksSection />

      {/* 3. Featured Top Consultants Section */}
      <FeaturedConsultantsSection />

      {/* 4. Engaging Call To Action Banner */}
      <CallToActionSection />

      {/* 5. Patient Testimonial Reviews Grid */}
      <TestimonialSection />

      {/* 6. Newsletter Email Subscription Block */}
      <EmailSubscriptionSection />

    </div>
  );
}
