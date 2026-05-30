import React from "react";
import Link from "next/link";
import { HeartPulse, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      
      {/* Top Banner (Value Proposition) */}
      <div className="bg-primary/5 border-b border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HeartPulse className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">Need Urgent Care or Guidance?</h4>
              <p className="text-sm text-muted-foreground">Our network of verified physicians and support lines are here for you 24/7.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+18005550199">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                <Phone className="h-4 w-4 text-primary" />
                <span>Call Hotline</span>
              </button>
            </a>
            <Link href="/consultation">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/95">
                <span>Book Appointment</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-4 lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                Health<span className="text-primary">Care</span>
              </span>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground max-w-sm">
              Professional, reliable, and premium digital healthcare services. Connecting you with top-rated medical specialists, verified diagnostic centers, and on-demand pharmaceutical support.
            </p>
            <div className="flex gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">Our Services</h5>
            <ul className="space-y-2">
              {[
                { label: "Find Doctors", href: "/consultation" },
                { label: "Diagnostics", href: "/diagnostic" },
                { label: "Online Medicine", href: "/medicine" },
                { label: "NGO Support", href: "/ngos" },
                { label: "Health Plans", href: "/health-plans" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">Resources</h5>
            <ul className="space-y-2">
              {[
                { label: "About Us", href: "#" },
                { label: "Contact Us", href: "#" },
                { label: "FAQs & Help", href: "#" },
                { label: "Latest News", href: "#" },
                { label: "Careers", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h5 className="text-sm font-bold uppercase tracking-wider text-foreground">Contact</h5>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary" />
                <span className="text-sm text-muted-foreground leading-snug">
                  123 Wellness Way, Suite 400, Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 shrink-0 text-primary" />
                <a href="tel:+18005550199" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  +880 1711-555666
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 shrink-0 text-primary" />
                <a href="mailto:support@healthcare.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  support@healthcare.com
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Legal Section */}
      <div className="border-t border-border bg-muted/40 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} HealthCare. All rights reserved. Professional healthcare solutions.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
