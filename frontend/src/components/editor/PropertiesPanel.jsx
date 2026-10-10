import React, { useState } from 'react';
import {
  Copy,
  Eye,
  EyeOff,
  LayoutGrid,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  X
} from 'lucide-react';
import { STUDIO_THEMES } from '../../themes/studioThemes';

const VARIANTS_BY_TYPE = {
  hero: [
    { id: 'split', label: 'Split (Text + Visual)' },
    { id: 'centered', label: 'Centered Layout' },
    { id: 'image-background', label: 'Background Overlay' },
    { id: 'gradient-glow', label: 'Gradient Glow Mesh' }
  ],
  features: [
    { id: 'three-column', label: '3-Column Cards' },
    { id: 'four-column', label: '4-Column Grid' },
    { id: 'alternating', label: 'Alternating Rows' },
    { id: 'bento-grid', label: 'Modern Bento Grid' }
  ],
  stats: [
    { id: 'grid', label: '3-4 Metric Cards Grid' },
    { id: 'inline-bar', label: 'Inline Ribbon Bar' },
    { id: 'cards', label: 'Highlighted Glass Cards' },
    { id: 'minimal-stats', label: 'Clean Typographic Row' }
  ],
  showcase: [
    { id: 'grid', label: 'Catalog / Book Cards' },
    { id: 'featured-row', label: 'Featured Carousel / Row' },
    { id: 'compact-list', label: 'Compact Lending List' },
    { id: 'masonry', label: 'Staggered Card Showcase' }
  ],
  steps: [
    { id: 'process-flow', label: 'Process Flow with Connectors' },
    { id: 'timeline', label: 'Vertical Timeline' },
    { id: 'cards', label: 'Numbered Step Cards' }
  ],
  faq: [
    { id: 'accordion', label: 'Interactive Accordions' },
    { id: 'two-column', label: '2-Column Side-by-Side' },
    { id: 'minimal-list', label: 'Clean Bordered List' }
  ],
  pricing: [
    { id: 'highlighted-middle', label: 'Featured Middle Tier' },
    { id: 'cards', label: 'Uniform Cards' },
    { id: 'minimal-table', label: 'Comparison Table' }
  ],
  testimonials: [
    { id: 'cards', label: 'Testimonial Cards' },
    { id: 'featured-quote', label: 'Featured Quote Hero' },
    { id: 'masonry-reviews', label: 'Masonry Review Grid' }
  ],
  contact: [
    { id: 'split', label: 'Split Layout + Form' },
    { id: 'centered', label: 'Centered Form Box' },
    { id: 'minimal-banner', label: 'Action Ribbon Banner' }
  ]
};

export function PropertiesPanel({
  section,
  onUpdateSection,
  onClose,
  onRegenerateSection,
  isRegeneratingSection,
  sections = [],
  onSelectSection,
  onMoveUp,
  onMoveDown,
  onDuplicateSection,
  onDeleteSection,
  onOpenAddSectionModal,
  studioTheme = 'dark',
  className = ''
}) {
  const [regenInstruction, setRegenInstruction] = useState('');
  const st = STUDIO_THEMES[studioTheme] || STUDIO_THEMES.dark;

  // If no section selected, pick first section
  const activeSection = section || (sections.length > 0 ? sections[0] : null);

  if (!activeSection) {
    return (
      <div className={`p-6 flex flex-col items-center justify-center text-center select-none ${className || `w-full ${st.panelBg} border ${st.border} rounded-3xl`}`}>
        <div className={`w-12 h-12 rounded-2xl ${st.controlBg} border ${st.controlBorder} flex items-center justify-center ${st.muted} mb-4`}>
          <LayoutGrid className="w-6 h-6" />
        </div>
        <h3 className={`text-sm font-semibold ${st.textHeading} mb-1`}>No Section Available</h3>
        <p className={`text-xs ${st.muted} max-w-xs leading-relaxed`}>
          Generate a website using the prompt box above to begin editing.
        </p>
      </div>
    );
  }

  const { type, variant, visible = true, content = {}, customLabel } = activeSection;
  const availableVariants = VARIANTS_BY_TYPE[type] || [];
  const currentIdx = sections.findIndex((s) => s.id === activeSection.id);

  const updateField = (key, value) => {
    onUpdateSection({
      ...activeSection,
      content: {
        ...content,
        [key]: value
      }
    });
  };

  const handleUpdateMeta = (key, value) => {
    onUpdateSection({
      ...activeSection,
      [key]: value
    });
  };

  const handleVariantChange = (newVariant) => {
    onUpdateSection({
      ...activeSection,
      variant: newVariant
    });
  };

  const toggleVisibility = () => {
    onUpdateSection({
      ...activeSection,
      visible: !visible
    });
  };

  const handleRegenerate = async () => {
    if (!regenInstruction.trim()) return;
    await onRegenerateSection(activeSection.id, regenInstruction);
    setRegenInstruction('');
  };

  return (
    <div className={`flex flex-col h-full select-none overflow-hidden ${className || `w-full ${st.panelBg} border ${st.border} rounded-3xl`}`}>
      {/* Top Section Navigator Bar with + Add Button */}
      {sections.length > 0 && onSelectSection && (
        <div className={`p-2.5 border-b ${st.borderSubtle} ${st.subsurfaceBg} flex items-center gap-1.5 overflow-x-auto no-scrollbar`}>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${st.muted} px-1.5 shrink-0`}>
            Sections:
          </span>
          {sections.map((s) => {
            const isCurr = s.id === activeSection.id;
            const labelText = s.customLabel || s.content?.title || s.type;
            return (
              <button
                key={s.id}
                onClick={() => onSelectSection(s.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold capitalize shrink-0 transition flex items-center gap-1.5 ${
                  isCurr
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                    : `${st.controlBg} ${st.muted} hover:${st.textHeading} hover:${st.hoverBg}`
                }`}
                title={labelText}
              >
                <span className="max-w-[110px] truncate">{labelText}</span>
                {s.visible === false && <EyeOff className="w-3 h-3 text-amber-400 shrink-0" />}
              </button>
            );
          })}
          {onOpenAddSectionModal && (
            <button
              onClick={onOpenAddSectionModal}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 shrink-0 transition flex items-center gap-1"
              title="Add a new section template"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      )}

      {/* Section Header */}
      <div className={`p-4 border-b ${st.border} flex items-center justify-between ${st.cardBg}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center text-xs font-bold uppercase shadow-inner">
            {type.slice(0, 2)}
          </div>
          <div>
            <h3 className={`text-sm font-bold ${st.textHeading} capitalize`}>{customLabel || `${type} Section`}</h3>
            <span className={`text-[10px] ${st.muted} font-mono`}>{activeSection.id} • {variant}</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {onMoveUp && currentIdx > 0 && (
            <button
              onClick={() => onMoveUp(activeSection.id)}
              className={`p-1.5 rounded-lg ${st.controlBg} ${st.muted} hover:${st.textHeading} border ${st.controlBorder} transition`}
              title="Move section up"
            >
              ↑
            </button>
          )}
          {onMoveDown && currentIdx < sections.length - 1 && (
            <button
              onClick={() => onMoveDown(activeSection.id)}
              className={`p-1.5 rounded-lg ${st.controlBg} ${st.muted} hover:${st.textHeading} border ${st.controlBorder} transition`}
              title="Move section down"
            >
              ↓
            </button>
          )}
          {onDuplicateSection && (
            <button
              onClick={() => onDuplicateSection(activeSection.id)}
              className={`p-1.5 rounded-lg ${st.controlBg} ${st.muted} hover:${st.textHeading} border ${st.controlBorder} transition`}
              title="Duplicate section"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={toggleVisibility}
            className={`p-1.5 rounded-lg border transition ${
              visible
                ? `${st.controlBg} ${st.muted} hover:${st.textHeading} ${st.controlBorder}`
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
            title={visible ? 'Hide section' : 'Show section'}
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          {onDeleteSection && sections.length > 1 && (
            <button
              onClick={() => onDeleteSection(activeSection.id)}
              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg ${st.controlBg} ${st.muted} hover:${st.textHeading} border ${st.controlBorder} transition`}
              title="Deselect"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Layout Variant Picker */}
        {availableVariants.length > 0 && (
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider ${st.muted} mb-2 block`}>
              Layout Variant
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {availableVariants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVariantChange(v.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium text-left border transition ${
                    variant === v.id
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : `${st.controlBg} ${st.text} ${st.controlBorder} hover:${st.hoverBg}`
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Section Label / Title for navigation */}
        <div className={`p-3 rounded-2xl ${st.subsurfaceBg} border ${st.border} space-y-2`}>
          <label className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 block">
            Section Name / Tab Label
          </label>
          <input
            type="text"
            value={customLabel || ''}
            onChange={(e) => handleUpdateMeta('customLabel', e.target.value)}
            placeholder={`e.g. ${type.toUpperCase()} Section or Curated Collections`}
            className={`w-full px-3 py-2 rounded-lg text-xs ${st.inputBg} border ${st.inputBorder} ${st.inputText} focus:outline-none focus:border-indigo-500 transition font-medium`}
          />
        </div>

        {/* Dynamic Contextual Inputs */}
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Content Properties
          </label>

          {/* Common Badge */}
          {content.badge !== undefined && (
            <div>
              <label className="text-[11px] font-medium text-slate-400 mb-1 block">Badge Tag</label>
              <input
                type="text"
                value={content.badge || ''}
                onChange={(e) => updateField('badge', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          )}

          {/* Hero Section Fields */}
          {type === 'hero' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Headline</label>
                <textarea
                  value={content.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Subtitle</label>
                <textarea
                  value={content.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">Primary CTA</label>
                  <input
                    type="text"
                    value={content.primaryCta || ''}
                    onChange={(e) => updateField('primaryCta', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">Secondary CTA</label>
                  <input
                    type="text"
                    value={content.secondaryCta || ''}
                    onChange={(e) => updateField('secondaryCta', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Image URL</label>
                <input
                  type="text"
                  value={content.imageUrl || ''}
                  onChange={(e) => updateField('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </>
          )}

          {/* Features Section Fields */}
          {type === 'features' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Section Title</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Description</label>
                <textarea
                  value={content.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-2 block">Feature Items ({content.items?.length || 0})</label>
                <div className="space-y-3">
                  {(content.items || []).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => {
                            const newItems = [...content.items];
                            newItems[idx] = { ...newItems[idx], title: e.target.value };
                            updateField('items', newItems);
                          }}
                          placeholder="Feature title"
                          className="flex-1 px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => {
                          const newItems = [...content.items];
                          newItems[idx] = { ...newItems[idx], description: e.target.value };
                          updateField('items', newItems);
                        }}
                        rows={2}
                        placeholder="Feature description"
                        className="w-full px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Stats Section Fields */}
          {type === 'stats' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Section Title</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Description</label>
                <textarea
                  value={content.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-2 block">Metrics / Key Numbers</label>
                <div className="space-y-3">
                  {(content.metrics || []).map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={m.value || ''}
                          onChange={(e) => {
                            const newM = [...content.metrics];
                            newM[idx] = { ...newM[idx], value: e.target.value };
                            updateField('metrics', newM);
                          }}
                          placeholder="e.g. 50,000+"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200 font-bold"
                        />
                        <input
                          type="text"
                          value={m.label || ''}
                          onChange={(e) => {
                            const newM = [...content.metrics];
                            newM[idx] = { ...newM[idx], label: e.target.value };
                            updateField('metrics', newM);
                          }}
                          placeholder="Label (e.g. Titles)"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                      </div>
                      <input
                        type="text"
                        value={m.description || ''}
                        onChange={(e) => {
                          const newM = [...content.metrics];
                          newM[idx] = { ...newM[idx], description: e.target.value };
                          updateField('metrics', newM);
                        }}
                        placeholder="Sub-description"
                        className="w-full px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Showcase Section Fields */}
          {type === 'showcase' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Description</label>
                <textarea
                  value={content.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-2 block">Catalog Items ({content.items?.length || 0})</label>
                <div className="space-y-3">
                  {(content.items || []).map((it, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={it.title || ''}
                          onChange={(e) => {
                            const newItems = [...content.items];
                            newItems[idx] = { ...newItems[idx], title: e.target.value };
                            updateField('items', newItems);
                          }}
                          placeholder="Title / Book Name"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                        <input
                          type="text"
                          value={it.price || ''}
                          onChange={(e) => {
                            const newItems = [...content.items];
                            newItems[idx] = { ...newItems[idx], price: e.target.value };
                            updateField('items', newItems);
                          }}
                          placeholder="Lending Price (e.g. $1.99/wk)"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-indigo-400 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={it.category || ''}
                          onChange={(e) => {
                            const newItems = [...content.items];
                            newItems[idx] = { ...newItems[idx], category: e.target.value };
                            updateField('items', newItems);
                          }}
                          placeholder="Category / Genre"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                        <input
                          type="text"
                          value={it.badge || ''}
                          onChange={(e) => {
                            const newItems = [...content.items];
                            newItems[idx] = { ...newItems[idx], badge: e.target.value };
                            updateField('items', newItems);
                          }}
                          placeholder="Badge (e.g. Available)"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                      </div>
                      <textarea
                        value={it.description || ''}
                        onChange={(e) => {
                          const newItems = [...content.items];
                          newItems[idx] = { ...newItems[idx], description: e.target.value };
                          updateField('items', newItems);
                        }}
                        rows={2}
                        placeholder="Description..."
                        className="w-full px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200 resize-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Steps / How It Works Fields */}
          {type === 'steps' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Description</label>
                <textarea
                  value={content.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-2 block">Step Flow ({content.steps?.length || 0})</label>
                <div className="space-y-3">
                  {(content.steps || []).map((st, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          Step {st.stepNumber || idx + 1}
                        </span>
                        <input
                          type="text"
                          value={st.title || ''}
                          onChange={(e) => {
                            const newSteps = [...content.steps];
                            newSteps[idx] = { ...newSteps[idx], title: e.target.value };
                            updateField('steps', newSteps);
                          }}
                          placeholder="Step title"
                          className="flex-1 px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                      </div>
                      <textarea
                        value={st.description || ''}
                        onChange={(e) => {
                          const newSteps = [...content.steps];
                          newSteps[idx] = { ...newSteps[idx], description: e.target.value };
                          updateField('steps', newSteps);
                        }}
                        rows={2}
                        placeholder="Step description..."
                        className="w-full px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200 resize-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* FAQ Section Fields */}
          {type === 'faq' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Description</label>
                <textarea
                  value={content.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-2 block">Questions & Answers ({content.items?.length || 0})</label>
                <div className="space-y-3">
                  {(content.items || []).map((q, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <input
                        type="text"
                        value={q.question || ''}
                        onChange={(e) => {
                          const newFaq = [...content.items];
                          newFaq[idx] = { ...newFaq[idx], question: e.target.value };
                          updateField('items', newFaq);
                        }}
                        placeholder="Question..."
                        className="w-full px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200 font-medium"
                      />
                      <textarea
                        value={q.answer || ''}
                        onChange={(e) => {
                          const newFaq = [...content.items];
                          newFaq[idx] = { ...newFaq[idx], answer: e.target.value };
                          updateField('items', newFaq);
                        }}
                        rows={2}
                        placeholder="Answer..."
                        className="w-full px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200 resize-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Pricing Section Fields */}
          {type === 'pricing' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-2 block">Plans</label>
                <div className="space-y-3">
                  {(content.plans || []).map((p, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={p.name || ''}
                          onChange={(e) => {
                            const newPlans = [...content.plans];
                            newPlans[idx] = { ...newPlans[idx], name: e.target.value };
                            updateField('plans', newPlans);
                          }}
                          placeholder="Plan name"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                        <input
                          type="text"
                          value={p.price || ''}
                          onChange={(e) => {
                            const newPlans = [...content.plans];
                            newPlans[idx] = { ...newPlans[idx], price: e.target.value };
                            updateField('plans', newPlans);
                          }}
                          placeholder="$99"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                      </div>
                      <input
                        type="text"
                        value={p.cta || ''}
                        onChange={(e) => {
                          const newPlans = [...content.plans];
                          newPlans[idx] = { ...newPlans[idx], cta: e.target.value };
                          updateField('plans', newPlans);
                        }}
                        placeholder="CTA text"
                        className="w-full px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Testimonials Fields */}
          {type === 'testimonials' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={content.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-2 block">Testimonials</label>
                <div className="space-y-3">
                  {(content.testimonials || []).map((t, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                      <textarea
                        value={t.quote || ''}
                        onChange={(e) => {
                          const newT = [...content.testimonials];
                          newT[idx] = { ...newT[idx], quote: e.target.value };
                          updateField('testimonials', newT);
                        }}
                        rows={2}
                        placeholder="Quote..."
                        className="w-full px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200 resize-none leading-relaxed"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={t.name || ''}
                          onChange={(e) => {
                            const newT = [...content.testimonials];
                            newT[idx] = { ...newT[idx], name: e.target.value };
                            updateField('testimonials', newT);
                          }}
                          placeholder="Name"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                        <input
                          type="text"
                          value={t.role || ''}
                          onChange={(e) => {
                            const newT = [...content.testimonials];
                            newT[idx] = { ...newT[idx], role: e.target.value };
                            updateField('testimonials', newT);
                          }}
                          placeholder="Role"
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-900 border border-slate-800 text-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Contact Fields */}
          {type === 'contact' && (
            <>
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Headline</label>
                <input
                  type="text"
                  value={content.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 block">Subtitle</label>
                <textarea
                  value={content.subtitle || ''}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">Button Label</label>
                  <input
                    type="text"
                    value={content.buttonText || ''}
                    onChange={(e) => updateField('buttonText', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 mb-1 block">Email Hint</label>
                  <input
                    type="text"
                    value={content.emailPlaceholder || ''}
                    onChange={(e) => updateField('emailPlaceholder', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-xs bg-slate-950/70 border border-slate-800 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* AI Section Regeneration */}
        <div className={`pt-4 border-t ${st.border}`}>
          <label className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Section Rewrite
          </label>
          <p className={`text-[11px] ${st.muted} mb-2 leading-relaxed`}>
            Instruct AI to revamp only this section without losing your other edits.
          </p>
          <textarea
            value={regenInstruction}
            onChange={(e) => setRegenInstruction(e.target.value)}
            rows={2}
            placeholder="e.g. Make headline more punchy and emphasize 30-day money-back guarantee..."
            className={`w-full px-3 py-2 rounded-lg text-xs ${st.inputBg} border border-indigo-500/30 ${st.inputText} focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed mb-2`}
          />
          <button
            onClick={handleRegenerate}
            disabled={!regenInstruction.trim() || isRegeneratingSection}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 transition disabled:opacity-40"
          >
            {isRegeneratingSection ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Rewriting Section...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate This Section</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
