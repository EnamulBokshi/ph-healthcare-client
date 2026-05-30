"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserInfo } from "@/types/user.type";
import { getDefaultDashboardRoute } from "@/lib/authUtils";
import { logoutUser } from "@/services/auth.services";
import { 
  HeartPulse, 
  Menu, 
  User, 
  Lock, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PublicHeaderContentProps {
  userInfo: UserInfo | null;
}

const PUBLIC_NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Find Doctors", href: "/consultation" },
  { label: "Diagnostics", href: "/diagnostic" },
  { label: "Medicines", href: "/medicine" },
  { label: "Health Plans", href: "/health-plans" },
  { label: "NGO Support", href: "/ngos" },
];

export default function PublicHeaderContent({ userInfo }: PublicHeaderContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const dashboardRoute = userInfo ? getDefaultDashboardRoute(userInfo.role) : "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Branding */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">
            <HeartPulse className="h-6 w-6 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground sm:block">
            Health<span className="text-primary font-extrabold">Care</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {PUBLIC_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                  isActive 
                    ? "text-foreground font-semibold" 
                    : "text-muted-foreground"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Right Side CTA / Dropdown */}
        <div className="hidden md:flex items-center gap-3">
          {userInfo ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 rounded-full border-border bg-background px-4 hover:bg-muted"
                  />
                }
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate text-sm font-medium">
                  {userInfo.name.split(" ")[0]}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userInfo.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
                    <p className="text-[10px] uppercase font-bold text-primary tracking-wider mt-0.5">
                      {userInfo.role.toLowerCase().replace("-", " ")}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" render={<Link href={dashboardRoute} />}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" render={<Link href="/my-profile" />}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" render={<Link href="/change-password" />}>
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-muted-foreground hover:text-foreground">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-lg font-semibold bg-primary text-primary-foreground">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex md:hidden items-center gap-2">
          {userInfo && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
          )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={<Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border" aria-label="Open navigation menu" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 flex flex-col justify-between">
              <div>
                {/* Branding inside mobile drawer */}
                <div className="flex h-16 items-center border-b px-6">
                  <SheetTitle className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    <span className="text-lg font-bold text-foreground">HealthCare</span>
                  </SheetTitle>
                </div>
                
                {/* Mobile Links */}
                <nav className="flex flex-col gap-1 px-4 py-6">
                  {PUBLIC_NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Auth Actions at bottom */}
              <div className="border-t p-6 bg-muted/20">
                {userInfo ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">{userInfo.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{userInfo.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={dashboardRoute} onClick={() => setIsOpen(false)} className="w-full">
                        <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs">
                          <LayoutDashboard className="mr-1.5 h-3.5 w-3.5" />
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/my-profile" onClick={() => setIsOpen(false)} className="w-full">
                        <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs">
                          <User className="mr-1.5 h-3.5 w-3.5" />
                          Profile
                        </Button>
                      </Link>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full rounded-lg text-xs font-bold"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full rounded-lg font-semibold border-border">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                      <Button className="w-full rounded-lg font-semibold bg-primary text-primary-foreground">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
      </div>
    </header>
  );
}
