import React from 'react';
import {
  BarChart3,
  BookOpen,
  HelpCircle,
  LayoutGrid,
  ListOrdered,
  Mail,
  Plus,
  Sparkles,
  Tag,
  Users,
  X
} from 'lucide-react';
import { STUDIO_THEMES } from '../../themes/studioThemes';

const SECTION_TEMPLATES = [
  {
    type: 'stats',
    title: 'Key Metrics & Numbers',
    description: 'Showcase quantitative results, active users, speed, and proven ROI metrics.',
    icon: BarChart3,
    badge: 'Proof & Counters',
    defaultVariant: 'grid'
  },
  {
    type: 'showcase',
    title: 'Catalog & Item Showcase',
    description: 'Display products, books, menu items, or projects with prices and action tags.',
    icon: BookOpen,
    badge: 'Catalog & Lending Rates',
    defaultVariant: 'grid'
  },
  {
    type: 'steps',
    title: 'How It Works / Steps',
    description: 'Sequential 3-step process flow guiding users from start to completion.',
    icon: ListOrdered,
    badge: 'Workflow Flow',
    defaultVariant: 'process-flow'
  },
  {
    type: 'features',
    title: 'Feature Pillars Grid',
    description: 'Highlight 3 to 4 core capabilities and technological advantages.',
    icon: LayoutGrid,
    badge: 'Capabilities',
    defaultVariant: 'three-column'
  },
  {
    type: 'pricing',
    title: 'Pricing & Membership Tiers',
    description: 'Transparent pricing packages with highlighted popular plan and feature checklists.',
    icon: Tag,
    badge: 'Monetization',
    defaultVariant: 'highlighted-middle'
  },
  {
    type: 'testimonials',
    title: '5-Star Customer Reviews',
    description: 'Social proof cards with authentic quotes, client roles, and star ratings.',
    icon: Users,
    badge: 'Social Proof',
    defaultVariant: 'cards'
  },
  {
    type: 'faq',
    title: 'Interactive FAQ Accordion',
    description: 'Expandable question cards addressing friction points and common inquiries.',
    icon: HelpCircle,
    badge: 'Objection Handling',
    defaultVariant: 'accordion'
  },
  {
    type: 'hero',
    title: 'Hero Fold & Conversion Hook',
    description: 'Impactful headline, high-converting value proposition, and primary CTAs.',
    icon: Sparkles,
    badge: 'First Fold',
    defaultVariant: 'split'
  },
  {
    type: 'contact',
    title: 'Lead Capture & Contact Form',
    description: 'Zero-friction email submission or booking form to drive conversions.',
    icon: Mail,
    badge: 'Lead Capture',
    defaultVariant: 'split'
  }
];

export function AddSectionModal({ isOpen, onClose, onAddSection, studioTheme = 'dark' }) {
  if (!isOpen) return null;
  const st = STUDIO_THEMES[studioTheme] || STUDIO_THEMES.dark;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${studioTheme === 'light' ? 'bg-slate-900/40' : 'bg-black/80'} backdrop-blur-md animate-in fade-in duration-200`}>
      <div className={`w-full max-w-3xl ${st.cardBg} border ${st.border} rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
        {/* Header */}
        <div className={`p-5 border-b ${st.border} flex items-center justify-between ${st.subsurfaceBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${st.textHeading}`}>Add New Section</h3>
              <p className={`text-xs ${st.muted}`}>Choose a design template block to insert into your landing page</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${st.muted} hover:${st.textHeading} hover:${st.hoverBg} transition`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTION_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.type}
                onClick={() => {
                  onAddSection(tmpl.type, tmpl.defaultVariant);
                  onClose();
                }}
                className={`p-5 rounded-2xl ${st.controlBg} hover:${st.hoverBg} border ${st.borderSubtle} hover:border-indigo-500/50 cursor-pointer transition-all duration-200 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-600 text-indigo-400 group-hover:text-white border border-indigo-500/20 flex items-center justify-center transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.subsurfaceBg} ${st.muted} group-hover:text-indigo-400`}>
                      {tmpl.badge}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold ${st.textHeading} mb-1.5 group-hover:text-indigo-400 transition`}>
                    {tmpl.title}
                  </h4>
                  <p className={`text-xs ${st.muted} leading-relaxed`}>
                    {tmpl.description}
                  </p>
                </div>

                <div className={`mt-4 pt-3 border-t ${st.borderSubtle} flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition`}>
                  <span>+ Insert Section</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${st.border} ${st.subsurfaceBg} flex items-center justify-between text-xs ${st.muted}`}>
          <span>Sections are fully customizable with multiple layout variants and inline editing.</span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl ${st.controlBg} hover:${st.hoverBg} ${st.text} border ${st.controlBorder} font-medium transition`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
