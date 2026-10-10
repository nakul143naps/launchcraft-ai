import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  EyeOff,
  Layers,
  Layout,
  RefreshCw,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';

const VARIANTS = {
  hero: [
    { id: 'split', label: 'Split' },
    { id: 'centered', label: 'Centered' },
    { id: 'image-background', label: 'Overlay' }
  ],
  features: [
    { id: 'three-column', label: '3-Col' },
    { id: 'four-column', label: '4-Col' },
    { id: 'alternating', label: 'Alternate' }
  ],
  pricing: [
    { id: 'highlighted-middle', label: 'Featured' },
    { id: 'cards', label: 'Cards' }
  ],
  testimonials: [
    { id: 'cards', label: 'Cards' },
    { id: 'featured-quote', label: 'Quote' }
  ],
  stats: [
    { id: 'cards', label: 'Cards' },
    { id: 'row', label: 'Row' }
  ],
  showcase: [
    { id: 'grid', label: 'Grid' },
    { id: 'compact', label: 'Compact' }
  ],
  steps: [
    { id: 'numbered', label: 'Numbered' },
    { id: 'timeline', label: 'Timeline' }
  ],
  faq: [
    { id: 'accordion', label: 'Accordion' }
  ],
  contact: [
    { id: 'split', label: 'Split' },
    { id: 'centered', label: 'Centered' }
  ]
};

export function SectionFloatingToolbar({
  section,
  onUpdateVariant,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  onToggleVisibility,
  onOpenAiRewrite,
  onDeselect
}) {
  const [showAiInput, setShowAiInput] = useState(false);
  const [instruction, setInstruction] = useState('');

  if (!section) return null;

  const variants = VARIANTS[section.type] || [];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="sticky top-24 z-30 mx-auto w-fit mb-4 flex flex-col items-center select-none animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/95 border border-indigo-500/50 shadow-2xl backdrop-blur-xl text-white text-xs">
        {/* Section Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-semibold uppercase tracking-wider text-[10px]">
          <Layers className="w-3.5 h-3.5" />
          <span>{section.type}</span>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        {/* Quick Variant Switcher */}
        {variants.length > 0 && (
          <div className="flex items-center gap-1">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => onUpdateVariant(section.id, v.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                  section.variant === v.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`Switch to ${v.label} layout`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        {/* Move Up / Down */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onMoveUp(section.id)}
            disabled={!canMoveUp}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
            title="Move Section Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMoveDown(section.id)}
            disabled={!canMoveDown}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition"
            title="Move Section Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-0.5" />

        {/* AI Rewrite Quick Trigger */}
        <button
          onClick={() => setShowAiInput(!showAiInput)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
            showAiInput
              ? 'bg-indigo-600 text-white'
              : 'text-indigo-300 hover:bg-indigo-500/20'
          }`}
          title="Rewrite section with AI"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">AI Rewrite</span>
        </button>

        {/* Hide Section */}
        <button
          onClick={() => onToggleVisibility(section.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition"
          title="Hide Section"
        >
          <EyeOff className="w-3.5 h-3.5" />
        </button>

        {/* Close / Deselect */}
        <button
          onClick={onDeselect}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Close Selection"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Popout AI Prompt Bar */}
      {showAiInput && (
        <div className="mt-2 w-96 p-2 rounded-2xl bg-slate-900/95 border border-indigo-500/60 shadow-2xl backdrop-blur-xl flex items-center gap-2">
          <input
            type="text"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && instruction.trim()) {
                onOpenAiRewrite(section.id, instruction);
                setInstruction('');
                setShowAiInput(false);
              }
            }}
            placeholder="e.g. Make headline more aggressive with 14-day trial..."
            className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          <button
            onClick={() => {
              if (instruction.trim()) {
                onOpenAiRewrite(section.id, instruction);
                setInstruction('');
                setShowAiInput(false);
              }
            }}
            disabled={!instruction.trim()}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 transition shrink-0"
          >
            Rewrite
          </button>
        </div>
      )}
    </div>
  );
}
