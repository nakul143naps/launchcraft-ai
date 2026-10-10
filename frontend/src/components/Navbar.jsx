import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function Navbar({ siteName, theme = DEFAULT_THEME, onSelect }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];

  return (
    <header className={`w-full border-b ${currentTheme.border} ${currentTheme.bg} sticky top-0 z-30 transition-colors backdrop-blur-md bg-opacity-95`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${currentTheme.primaryBtn} flex items-center justify-center font-bold text-lg shadow-md`}>
            {siteName ? siteName.charAt(0).toUpperCase() : 'L'}
          </div>
          <span className={`text-xl font-bold tracking-tight ${currentTheme.text}`}>
            {siteName || 'LaunchCraft Studio'}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className={`${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>Features</a>
          <a href="#pricing" className={`${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>Pricing</a>
          <a href="#testimonials" className={`${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>Testimonials</a>
          <a href="#contact" className={`${currentTheme.muted} hover:${currentTheme.text} transition-colors`}>Contact</a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${currentTheme.primaryBtn}`}
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
