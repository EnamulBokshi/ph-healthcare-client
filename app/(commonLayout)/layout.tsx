import PublicHeader from "@/components/shared/PublicHeader";
import PublicFooter from "@/components/shared/PublicFooter";
import React from "react";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground">
      {/* Shared Public Header */}
      <PublicHeader />
      
      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Shared Public Footer */}
      <PublicFooter />
    </div>
  );
}
