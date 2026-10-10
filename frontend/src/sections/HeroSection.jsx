import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function HeroSection({
  section,
  theme = DEFAULT_THEME,
  isSelected,
  onSelect,
  onInlineEdit
}) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content, variant = 'split' } = section;
  const {
    headline = 'Build Something Extraordinary',
    subtitle = 'The platform designed to accelerate your growth and simplify your workflow.',
    primaryCta = 'Get Started Now',
    secondaryCta = 'Learn More',
    imageUrl = '',
    badge = 'Welcome to the Future'
  } = content || {};

  const handleBlur = (field, e) => {
    if (onInlineEdit) {
      onInlineEdit(section.id, field, e.currentTarget.innerText.trim());
    }
  };

  const editableClass = onInlineEdit
    ? 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/60 focus:outline-solid focus:outline-2 focus:outline-indigo-500 rounded px-1 transition-all cursor-text'
    : '';

  const isLightTheme = ['bright', 'sunny', 'minimal', 'fresh'].includes(theme);

  return (
    <section
      id="hero"
      onClick={onSelect}
      className={`relative w-full py-20 lg:py-28 px-6 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:ring-1 hover:ring-indigo-500/30'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {variant === 'centered' && (
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {badge && (
              <div
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('badge', e)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 ${currentTheme.accentTag} ${editableClass}`}
                title="Click to edit badge"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{badge}</span>
              </div>
            )}
            <h1
              contentEditable={!!onInlineEdit}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur('headline', e)}
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 ${currentTheme.text} ${editableClass}`}
              title="Click to edit headline"
            >
              {headline}
            </h1>
            <p
              contentEditable={!!onInlineEdit}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur('subtitle', e)}
              className={`text-lg sm:text-xl ${currentTheme.muted} mb-10 max-w-2xl leading-relaxed ${editableClass}`}
              title="Click to edit subtitle"
            >
              {subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {primaryCta && (
                <span
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBlur('primaryCta', e)}
                  className={`px-8 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 ${currentTheme.primaryBtn} ${editableClass}`}
                  title="Click to edit CTA"
                >
                  {primaryCta}
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </span>
              )}
              {secondaryCta && (
                <span
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBlur('secondaryCta', e)}
                  className={`px-7 py-3.5 rounded-xl text-base font-semibold ${currentTheme.secondaryBtn} ${editableClass}`}
                  title="Click to edit secondary button"
                >
                  {secondaryCta}
                </span>
              )}
            </div>

            {imageUrl && (
              <div className={`mt-14 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border ${currentTheme.border}`}>
                <img
                  src={imageUrl}
                  alt={headline}
                  className="w-full h-auto object-cover max-h-[460px]"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>
        )}

        {variant === 'gradient-glow' && (
          <div className={`relative rounded-3xl overflow-hidden py-24 px-8 sm:px-16 text-center border shadow-2xl backdrop-blur-md ${
            isLightTheme
              ? 'border-indigo-100 bg-gradient-to-b from-indigo-50/70 via-white to-sky-50/50 shadow-indigo-100/40'
              : 'border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 via-slate-900/60 to-slate-950/80'
          }`}>
            {/* Ambient Glow Orbs */}
            <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none -translate-y-1/2 ${
              isLightTheme ? 'bg-indigo-300/20' : 'bg-indigo-500/20'
            }`} />
            <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none translate-y-1/2 ${
              isLightTheme ? 'bg-sky-300/20' : 'bg-cyan-500/15'
            }`} />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
              {badge && (
                <div
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBlur('badge', e)}
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 ${currentTheme.accentTag} shadow-sm ${editableClass}`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{badge}</span>
                </div>
              )}
              <h1
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('headline', e)}
                className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 ${currentTheme.text} ${editableClass}`}
              >
                {headline}
              </h1>
              <p
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('subtitle', e)}
                className={`text-lg sm:text-xl ${currentTheme.muted} mb-10 max-w-2xl leading-relaxed ${editableClass}`}
              >
                {subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                {primaryCta && (
                  <span
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('primaryCta', e)}
                    className={`px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-indigo-500/20 flex items-center gap-2 ${currentTheme.primaryBtn} ${editableClass}`}
                  >
                    {primaryCta}
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </span>
                )}
                {secondaryCta && (
                  <span
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('secondaryCta', e)}
                    className={`px-7 py-4 rounded-xl text-base font-semibold ${currentTheme.secondaryBtn} transition ${editableClass}`}
                  >
                    {secondaryCta}
                  </span>
                )}
              </div>

              {imageUrl && (
                <div className={`w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border ${currentTheme.border}`}>
                  <img
                    src={imageUrl}
                    alt={headline}
                    className="w-full h-auto object-cover max-h-[440px]"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {(variant === 'split' || (!['centered', 'image-background', 'gradient-glow'].includes(variant))) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col items-start">
              {badge && (
                <div
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBlur('badge', e)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 ${currentTheme.accentTag} ${editableClass}`}
                  title="Click to edit badge"
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{badge}</span>
                </div>
              )}
              <h1
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('headline', e)}
                className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 ${currentTheme.text} ${editableClass}`}
                title="Click to edit headline"
              >
                {headline}
              </h1>
              <p
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('subtitle', e)}
                className={`text-lg sm:text-xl ${currentTheme.muted} mb-8 max-w-xl leading-relaxed ${editableClass}`}
                title="Click to edit subtitle"
              >
                {subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                {primaryCta && (
                  <span
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('primaryCta', e)}
                    className={`px-7 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 ${currentTheme.primaryBtn} ${editableClass}`}
                    title="Click to edit CTA"
                  >
                    {primaryCta}
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </span>
                )}
                {secondaryCta && (
                  <span
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('secondaryCta', e)}
                    className={`px-6 py-3.5 rounded-xl text-base font-semibold ${currentTheme.secondaryBtn} ${editableClass}`}
                    title="Click to edit secondary button"
                  >
                    {secondaryCta}
                  </span>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className={`relative rounded-3xl overflow-hidden shadow-2xl border ${currentTheme.border}`}>
                <img
                  src={imageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80'}
                  alt={headline}
                  className="w-full h-80 sm:h-96 lg:h-[420px] object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {variant === 'image-background' && (
          <div className="relative rounded-3xl overflow-hidden py-24 px-8 sm:px-16 text-center border border-slate-700/50">
            {imageUrl && (
              <img
                src={imageUrl}
                alt={headline}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs" />
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              {badge && (
                <div
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBlur('badge', e)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 bg-white/10 text-white backdrop-blur-md ${editableClass}`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>{badge}</span>
                </div>
              )}
              <h1
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('headline', e)}
                className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 ${editableClass}`}
              >
                {headline}
              </h1>
              <p
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('subtitle', e)}
                className={`text-lg sm:text-xl text-slate-200 mb-8 max-w-xl leading-relaxed ${editableClass}`}
              >
                {subtitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {primaryCta && (
                  <span
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('primaryCta', e)}
                    className={`px-7 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 ${currentTheme.primaryBtn} ${editableClass}`}
                  >
                    {primaryCta}
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </span>
                )}
                {secondaryCta && (
                  <span
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('secondaryCta', e)}
                    className={`px-6 py-3.5 rounded-xl text-base font-semibold bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition ${editableClass}`}
                  >
                    {secondaryCta}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
