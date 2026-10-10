import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroSection } from '../sections/HeroSection';
import { StatsSection } from '../sections/StatsSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { ShowcaseSection } from '../sections/ShowcaseSection';
import { HowItWorksSection } from '../sections/HowItWorksSection';
import { PricingSection } from '../sections/PricingSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { FaqSection } from '../sections/FaqSection';
import { ContactSection } from '../sections/ContactSection';
import { SectionFloatingToolbar } from '../components/editor/SectionFloatingToolbar';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

const SECTION_COMPONENTS = {
  hero: HeroSection,
  stats: StatsSection,
  features: FeaturesSection,
  showcase: ShowcaseSection,
  steps: HowItWorksSection,
  pricing: PricingSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  contact: ContactSection,
};

export function LandingPage({
  siteData,
  selectedSectionId,
  onSelectSection,
  onInlineEdit,
  onUpdateVariant,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onOpenAiRewrite,
  isPreviewOnly = false
}) {
  if (!siteData || !siteData.site) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400">
        No website data available.
      </div>
    );
  }

  const { site, sections = [] } = siteData;
  const currentThemeId = site.theme || DEFAULT_THEME;
  const currentTheme = THEMES[currentThemeId] || THEMES[DEFAULT_THEME];

  const visibleSections = sections.filter((s) => s.visible !== false || !isPreviewOnly);

  return (
    <div className={`w-full min-h-full ${currentTheme.bg} ${currentTheme.text} transition-colors duration-300 font-sans relative`}>
      <Navbar
        siteName={site.name}
        theme={currentThemeId}
      />

      <main className="w-full">
        {visibleSections.map((section, idx) => {
          if (isPreviewOnly && section.visible === false) return null;
          const Component = SECTION_COMPONENTS[section.type];
          if (!Component) return null;

          const isSelected = !isPreviewOnly && selectedSectionId === section.id;

          return (
            <div key={section.id} className="relative group">
              {/* Floating Action Toolbar on Selected Section */}
              {isSelected && !isPreviewOnly && (
                <SectionFloatingToolbar
                  section={section}
                  onUpdateVariant={onUpdateVariant}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  canMoveUp={idx > 0}
                  canMoveDown={idx < visibleSections.length - 1}
                  onToggleVisibility={onToggleVisibility}
                  onOpenAiRewrite={onOpenAiRewrite}
                  onDeselect={() => onSelectSection(null)}
                />
              )}

              {/* Section Hover Badge */}
              {!isPreviewOnly && (
                <div className={`absolute top-2 left-6 z-20 pointer-events-none transition opacity-0 group-hover:opacity-100 ${
                  isSelected ? 'opacity-100' : ''
                }`}>
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase bg-slate-900/90 text-indigo-300 border border-slate-700 shadow-md">
                    {section.type} • {section.variant}
                    {section.visible === false ? ' (HIDDEN)' : ''}
                  </span>
                </div>
              )}

              <Component
                section={section}
                theme={currentThemeId}
                isSelected={isSelected}
                onSelect={!isPreviewOnly ? () => onSelectSection(section.id) : undefined}
                onInlineEdit={!isPreviewOnly ? onInlineEdit : undefined}
              />
            </div>
          );
        })}
      </main>

      <Footer
        siteName={site.name}
        description={site.description}
        theme={currentThemeId}
      />
    </div>
  );
}
