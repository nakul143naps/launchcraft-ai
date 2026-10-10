import React, { useState } from 'react';
import {
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Loader2,
  Palette,
  Sparkles,
  Wand2,
  Zap
} from 'lucide-react';
import { THEMES } from '../../themes/themes';
import { STUDIO_THEMES } from '../../themes/studioThemes';

const EXAMPLE_PROMPTS = [
  {
    id: 'library',
    label: '📚 Library System',
    prompt: 'Create a high-converting, modern landing page for i want  to create library management system landing page  with features like  differnt kind of books lending prices , books borrowing , books returning etc. Feature an impactful headline with clear conversion hook, 3 key feature pillars with metrics, transparent tiered pricing or membership options, authentic customer review cards with 5-star ratings, and a high-visibility lead capture CTA form with zero friction.'
  },
  {
    id: 'saas',
    label: '🚀 SaaS Platform',
    prompt: 'Build a high-converting landing page for CloudPulse, an automated AI cloud infrastructure optimization platform for engineering teams. Highlight latency drops, AWS cost savings, tiered pricing, and social proof.'
  },
  {
    id: 'fitness',
    label: '🏋️ Fitness Studio',
    prompt: 'Create a modern website for a premium fitness studio called IronPeak Athletics. Use a dark background with electric green accents, a strong hero section, membership pricing, trainer profiles, customer testimonials, and a contact form.'
  },
  {
    id: 'realestate',
    label: '🏡 Luxury Real Estate',
    prompt: 'Create an elegant, minimalist website for Aura Living, a boutique luxury real estate agency showcasing modern architectural villas, private penthouses, and bespoke concierge buying services.'
  },
  {
    id: 'sneakers',
    label: '👟 Sneaker Store',
    prompt: 'Design a high-energy streetwear e-commerce page for Veloce Kicks, an authenticated limited-edition sneaker marketplace featuring exclusive drops, buyer protection, and VIP collector passes.'
  },
  {
    id: 'bistro',
    label: '🍕 Artisan Bistro',
    prompt: 'Design a warm and inviting website for Bella Tavola, a wood-fired Italian trattoria featuring seasonal organic pasta, reservation booking, chef story, reviews, and a welcoming neighborhood ambiance.'
  }
];

export function HeroPromptStudio({
  prompt,
  setPrompt,
  enhancedPrompt,
  setEnhancedPrompt,
  onEnhancePrompt,
  onGenerateSite,
  isEnhancing,
  isGenerating,
  statusMessage,
  isOfflineMode,
  backendOnline,
  currentTheme,
  onSelectTheme,
  onScrollToWorkspace,
  studioTheme = 'dark'
}) {
  const [showEnhanced, setShowEnhanced] = useState(false);
  const st = STUDIO_THEMES[studioTheme] || STUDIO_THEMES.dark;

  const handleSelectExample = (item) => {
    setPrompt(item.prompt);
    setEnhancedPrompt('');
    setShowEnhanced(false);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (prompt.trim() && !isGenerating) {
        onGenerateSite();
      }
    }
  };

  const sectionBgClass =
    studioTheme === 'light'
      ? 'bg-gradient-to-b from-slate-100 via-white to-slate-100 border-b border-slate-300'
      : studioTheme === 'midnight'
      ? 'bg-gradient-to-b from-black via-zinc-950 to-black border-b border-zinc-900'
      : 'bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950 border-b border-slate-800/80';

  return (
    <section className={`relative w-full pt-4 pb-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center transition-colors duration-300 ${sectionBgClass}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-tr from-indigo-600/15 via-violet-500/10 to-cyan-500/15 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl w-full flex flex-col items-center text-center">
        {/* Compact Header */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${st.accentTag} border text-xs font-semibold mb-2 shadow-inner`}>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>LaunchCraft AI • Natural Language Website Generator</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </div>

        <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${st.textHeading} mb-2`}>
          Describe it. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-400">Design it.</span> Launch it.
        </h1>
        <p className={`text-xs sm:text-sm ${st.muted} max-w-2xl leading-relaxed mb-4`}>
          Type your idea in plain English below. We build a high-converting 5-section landing page that you can preview and visually customize in the split workspace below.
        </p>

        {/* Main Studio Card */}
        <div className={`w-full ${st.cardBg} border ${st.border} rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-left relative transition-colors duration-300`}>
          {/* Quick Idea Chips */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${st.muted} flex items-center gap-1.5`}>
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                Quick Prompts
              </span>
              <span className={`text-[10px] ${st.muted} hidden sm:inline`}>Press Ctrl+Enter to generate</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {EXAMPLE_PROMPTS.map((item) => {
                const isActive = prompt === item.prompt;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectExample(item)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 transition flex items-center gap-1 ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-500/25'
                        : `${st.controlBg} hover:${st.hoverBg} ${st.muted} hover:${st.textHeading} ${st.controlBorder}`
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Textarea */}
          <div className="relative mb-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your website or app idea... (e.g., A modern library management system landing page with book borrowing, returns tracking, tiered membership prices, and 3 key metrics)"
              rows={3}
              className={`w-full ${st.inputBg} border ${st.inputBorder} rounded-xl p-3 text-xs sm:text-sm ${st.inputText} placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none leading-relaxed shadow-inner max-h-32 overflow-y-auto`}
            />
            {prompt && (
              <button
                onClick={() => { setPrompt(''); setEnhancedPrompt(''); }}
                className={`absolute top-2.5 right-2.5 text-[11px] ${st.muted} hover:${st.textHeading} px-2 py-0.5 rounded ${st.controlBg} hover:${st.hoverBg} border ${st.controlBorder} transition`}
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>

          {/* Enhanced Prompt Drawer (if active) */}
          {enhancedPrompt && (
            <div className={`mb-3 p-3 rounded-xl border transition ${
              studioTheme === 'light'
                ? 'bg-indigo-50/80 border-indigo-200 text-slate-800'
                : 'bg-indigo-950/30 border-indigo-800/50 text-slate-300'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  AI Enhanced Conversion Brief
                </span>
                <button
                  onClick={() => setShowEnhanced(!showEnhanced)}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
                >
                  {showEnhanced ? 'Hide' : 'Expand'}
                  {showEnhanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
              <p className={`text-xs leading-relaxed ${studioTheme === 'light' ? 'text-slate-700' : 'text-slate-300'} ${showEnhanced ? '' : 'line-clamp-2'}`}>
                {enhancedPrompt}
              </p>
            </div>
          )}

          {/* Controls Bar: Theme & Generate Button (ALWAYS in view) */}
          <div className={`flex flex-wrap items-center justify-between gap-3 pt-2 border-t ${st.borderSubtle}`}>
            {/* Theme selector */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${st.muted} hidden sm:inline flex items-center gap-1`}>
                <Palette className="w-3.5 h-3.5" />
                Theme:
              </span>
              <div className={`inline-flex p-1 ${st.subsurfaceBg} rounded-xl border ${st.controlBorder}`}>
                {Object.entries(THEMES).map(([themeKey, tData]) => (
                  <button
                    key={themeKey}
                    onClick={() => onSelectTheme(themeKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition flex items-center gap-1.5 ${
                      currentTheme === themeKey
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : `${st.muted} hover:${st.textHeading}`
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        themeKey === 'bright'
                          ? 'bg-sky-400 ring-1 ring-sky-300'
                          : themeKey === 'sunny'
                          ? 'bg-amber-400'
                          : themeKey === 'fresh'
                          ? 'bg-emerald-400'
                          : themeKey === 'minimal'
                          ? 'bg-zinc-400'
                          : 'bg-indigo-400'
                      }`}
                    />
                    {tData.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={onEnhancePrompt}
                disabled={isEnhancing || !prompt.trim()}
                className={`px-3.5 py-2 rounded-xl border ${st.controlBorder} ${st.controlBg} hover:${st.hoverBg} ${st.text} text-xs font-semibold transition disabled:opacity-40 flex items-center gap-1.5 shadow-sm`}
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Enhancing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Enhance Brief</span>
                  </>
                )}
              </button>

              <button
                onClick={onGenerateSite}
                disabled={isGenerating || !prompt.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition disabled:opacity-40 flex items-center gap-2 active:scale-95"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Landing Page</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Status Line & Jump Down CTA */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${st.cardBg} border ${st.border} ${st.muted}`}>
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
              }`}
            />
            <span className="font-medium">
              {backendOnline ? (isOfflineMode ? 'Preset Mode' : 'AI Active') : 'Backend Offline'}
            </span>
            <span className="opacity-40">•</span>
            <span>{statusMessage}</span>
          </div>

          <button
            onClick={onScrollToWorkspace}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full ${st.accentTag} border font-semibold transition hover:opacity-80`}
          >
            <span>Jump to Preview & Editor Below</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
