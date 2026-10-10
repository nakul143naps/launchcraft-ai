import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCcw,
  Sparkles,
  Wand2
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  {
    label: '🏋️ Fitness Studio',
    prompt: 'Create a modern website for a premium fitness studio called IronPeak Athletics. Use a dark background with electric green accents, a strong hero section, membership pricing, trainer profiles, customer testimonials, and a contact form.'
  },
  {
    label: '🚀 SaaS Platform',
    prompt: 'Build a high-converting landing page for CloudPulse, an automated AI cloud infrastructure optimization platform for engineering teams. Highlight latency drops, AWS cost savings, tiered pricing, and social proof.'
  },
  {
    label: '🍕 Artisan Bistro',
    prompt: 'Design a warm and inviting website for Bella Tavola, a wood-fired Italian trattoria featuring seasonal organic pasta, reservation booking, chef story, reviews, and a welcoming neighborhood ambiance.'
  },
  {
    label: '🏡 Luxury Real Estate',
    prompt: 'Create an elegant, minimalist website for Aura Living, a boutique luxury real estate agency showcasing modern architectural villas, private penthouses, and bespoke concierge buying services.'
  },
  {
    label: '👟 Sneaker Store',
    prompt: 'Design a high-energy streetwear e-commerce page for Veloce Kicks, an authenticated limited-edition sneaker marketplace featuring exclusive drops, buyer protection, and VIP collector passes.'
  },
  {
    label: '📈 Growth Agency',
    prompt: 'Create a bold website for Nova Studio, a digital product and performance marketing agency scaling venture-backed brands through creative testing and full-stack engineering.'
  }
];

export function PromptPanel({
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
  backendOnline
}) {
  const [showEnhanced, setShowEnhanced] = useState(false);

  const handleSelectExample = (item) => {
    setPrompt(item.prompt);
    setEnhancedPrompt('');
    setShowEnhanced(false);
  };

  const handleClear = () => {
    setPrompt('');
    setEnhancedPrompt('');
    setShowEnhanced(false);
  };

  return (
    <div className="w-80 lg:w-96 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col h-full shrink-0 select-none overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold text-white">AI Website Generator</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <span className="text-[11px] font-medium text-slate-400">
            {backendOnline ? (isOfflineMode ? 'Preset Mode' : 'AI Ready') : 'Backend Offline'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Quick Example Presets */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
            Example Ideas
          </label>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectExample(item)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Prompt Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your Description
            </label>
            {prompt && (
              <button
                onClick={handleClear}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition"
                title="Clear prompt"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setEnhancedPrompt('');
            }}
            rows={5}
            placeholder="Type your new website description here (e.g. 'Build a website for a luxury real estate agency called Aura Living with villa listings and VIP concierge...')"
            className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-950/70 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition resize-none leading-relaxed"
          />

          {/* Enhance Prompt Button */}
          <button
            onClick={async () => {
              await onEnhancePrompt();
              setShowEnhanced(true);
            }}
            disabled={!prompt.trim() || isEnhancing || isGenerating}
            className="mt-2 w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-indigo-300 hover:text-indigo-200 border border-indigo-500/20 flex items-center justify-center gap-2 transition disabled:opacity-40"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Enhancing Brief with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enhance Prompt with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Enhanced Prompt Display (Editable) */}
        {enhancedPrompt && (
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowEnhanced(!showEnhanced)}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-200">AI Enhanced Brief</span>
              </div>
              {showEnhanced ? (
                <ChevronUp className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </div>

            {showEnhanced && (
              <textarea
                value={enhancedPrompt}
                onChange={(e) => setEnhancedPrompt(e.target.value)}
                rows={4}
                className="w-full mt-2 px-3 py-2 rounded-lg text-xs bg-slate-950/90 border border-indigo-500/20 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            )}
          </div>
        )}

        {/* Generate Button */}
        <div>
          <button
            onClick={onGenerateSite}
            disabled={!prompt.trim() || isGenerating || isEnhancing}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating New Website...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Landing Page</span>
              </>
            )}
          </button>
        </div>

        {/* Status / Progress Indicator */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{statusMessage}</span>
          </div>
        )}

        {/* Informative Note */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
          <p className="font-semibold text-slate-300 mb-1">💡 Real-Time Generation</p>
          Type any description or business idea above. LaunchCraft AI extracts your brand name, value proposition, and industry features to synthesize a complete 5-section landing page.
        </div>
      </div>
    </div>
  );
}
