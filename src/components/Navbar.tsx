"use client";

import { useState } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Moon,
  Sun,
  Menu,
  X,
  Wallet,
  Users,
  PieChart,
  CreditCard,
  LogIn,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Use Clerk's useUser hook to get authentication status
  const { isSignedIn, isLoaded } = useUser();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Define nav links for reuse
  const authenticatedLinks = [
    { to: "/dashboard", label: "Dashboard", icon: PieChart },
    { to: "/transactions", label: "Transactions", icon: CreditCard },
    { to: "/split", label: "Split Bills", icon: Users },
    { to: "/expenses", label: "Expenses", icon: PieChart },
    { to: "/budget", label: "Budget", icon: Wallet },
  ];

  const guestLinks = [
    { to: "/#features", label: "Features" },
    { to: "/#pricing", label: "Pricing" },
    { to: "/#about", label: "About" },
  ];

  return (
    <header className="sticky top-0 px-4  z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2"
          onClick={closeMenu}
        >
          <div className="hero-gradient p-2 rounded-xl">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold primary-gradient bg-clip-text text-transparent">
            Finice
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {(isSignedIn ? authenticatedLinks : guestLinks).map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className="text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end space-x-4">
          <DarkModeToggle />
          {
            // Only show buttons after Clerk has loaded its state
            isLoaded &&
              (isSignedIn ? (
                <UserButton />
              ) : (
                <div className="space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/sign-in">Log In</Link>
                  </Button>
                  <Button asChild size="sm" className=" " variant={"hero"}>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              ))
          }
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-2">
          <DarkModeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-md border-t border-border animate-in fade-in-20 slide-in-from-top-4">
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              {(isSignedIn ? authenticatedLinks : guestLinks).map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
                  onClick={closeMenu}
                >
                  {
                    //@ts-ignore
                    link.icon && (<link.icon className="h-4 w-4 text-foreground/60" />)
                  }
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
            {isLoaded && !isSignedIn && (
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  onClick={closeMenu}
                >
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2"
                  >
                    <LogIn className="h-4 w-4" /> Log In
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full hero-gradient"
                  onClick={closeMenu}
                >
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-4 w-4" /> Sign Up
                  </Link>
                </Button>
              </div>
            )}
            {isLoaded && isSignedIn && (
              <div className="pt-4 border-t border-border">
                <UserButton
                  showName appearance={{
                    
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
