"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/auth/useAuth";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { label: "Home", href: "/#home", sectionId: "home" },
  { label: "How It Works", href: "/#how-it-works", sectionId: "how-it-works" },
  { label: "Recent Items", href: "/#recent-items", sectionId: "recent-items" },
  { label: "Success Stories", href: "/#testimonials", sectionId: "testimonials" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  function go(path: string) {
    router.push(path);
  }

  function goProtected(path: string) {
    if (loading) return;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  }

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle scroll for active tab detection
  useEffect(() => {
    const sections = navLinks.map((link) => link.sectionId);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(sections[i]);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Set initial active tab
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-white shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Logo href="#home" size="lg" />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeTab === link.sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActiveTab(link.sectionId)}
                  className={`text-sm font-medium transition-all duration-200 relative group ${
                    isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  {isActive ? (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                  ) : (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => go((user as any).role === "admin" ? "/admin" : "/dashboard")}
                >
                  {(user as any).role === "admin" ? "Admin Dashboard" : "Dashboard"}
                </Button>
                <Button variant="ghost" size="sm" onClick={async () => {
                  await logout();
                  router.push("/");
                }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => goProtected("/browse")}>
                  Browse Found Items
                </Button>
                <Button variant="ghost" size="sm" onClick={() => go("/login")}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => goProtected("/report")}>
                  Report Item
                </Button>
              </>
            )}
          </div>

          {/* Mobile actions */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              className="text-muted hover:text-app p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white backdrop-blur-md rounded-2xl mb-4 p-4 border border-gray-200 shadow-lg">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const isActive = activeTab === link.sectionId;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => {
                      setActiveTab(link.sectionId);
                      setMobileOpen(false);
                    }}
                    className={`py-2 px-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-200">
                {user ? (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setMobileOpen(false);
                        go("/dashboard");
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={async () => {
                        setMobileOpen(false);
                        await logout();
                        router.push("/");
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setMobileOpen(false);
                        goProtected("/browse");
                      }}
                    >
                      Browse Found Items
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setMobileOpen(false);
                        go("/login");
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setMobileOpen(false);
                        goProtected("/report");
                      }}
                    >
                      Report Item
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
