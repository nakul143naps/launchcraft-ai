import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function Footer({ siteName, description, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];

  return (
    <footer className={`w-full border-t ${currentTheme.border} ${currentTheme.bg} py-14 transition-colors`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${currentTheme.primaryBtn} flex items-center justify-center font-bold text-sm`}>
              {siteName ? siteName.charAt(0).toUpperCase() : 'L'}
            </div>
            <span className={`text-lg font-bold tracking-tight ${currentTheme.text}`}>
              {siteName || 'LaunchCraft Studio'}
            </span>
          </div>
          {description && (
            <p className={`text-sm ${currentTheme.muted} max-w-sm text-center md:text-left`}>
              {description}
            </p>
          )}
        </div>

        <div className={`text-xs ${currentTheme.muted} flex flex-col md:flex-row items-center gap-4`}>
          <span>&copy; {new Date().getFullYear()} {siteName || 'LaunchCraft'}. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#privacy" className={`hover:${currentTheme.text} transition`}>Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className={`hover:${currentTheme.text} transition`}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
