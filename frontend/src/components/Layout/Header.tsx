/**
 * Header Component
 * Main application header with logo, navigation toggle, and branding
 */

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Navigation from "./Navigation";
// import { cn } from "../../lib/cn.ts";

interface HeaderProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage = "home", onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-neutral-200">
      <div className="mx-auto max-w-7xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600">
              <span className="text-lg font-bold text-white">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                Autism Predictor
              </h1>
              <p className="text-xs text-neutral-500">Gene Expression Analysis</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <Navigation
              currentPage={currentPage}
              onNavigate={onNavigate}
              variant="horizontal"
            />
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-lg p-2 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-neutral-600" />
            ) : (
              <Menu size={24} className="text-neutral-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="border-t border-neutral-200 bg-neutral-50">
            <Navigation
              currentPage={currentPage}
              onNavigate={(page) => {
                setMobileMenuOpen(false);
                onNavigate?.(page);
              }}
              variant="vertical"
            />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;