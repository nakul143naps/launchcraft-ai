import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function ContactSection({
  section,
  theme = DEFAULT_THEME,
  isSelected,
  onSelect,
  onInlineEdit
}) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content, variant = 'split' } = section;
  const {
    badge = 'Get Started Today',
    headline = 'Ready to Supercharge Your Results?',
    subtitle = 'Join thousands of satisfied users. Enter your email and start your journey now.',
    buttonText = 'Get Started',
    emailPlaceholder = 'Enter your email address...',
    secondaryText = 'No credit card required • Instant access'
  } = content || {};

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail('');
    }, 4000);
  };

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
      id="contact"
      onClick={onSelect}
      className={`relative w-full py-24 px-6 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:ring-1 hover:ring-indigo-500/30'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {variant === 'centered' && (
          <div className="max-w-3xl mx-auto text-center">
            {badge && (
              <div
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('badge', e)}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 ${currentTheme.accentTag} ${editableClass}`}
                title="Click to edit badge"
              >
                {badge}
              </div>
            )}
            <h2
              contentEditable={!!onInlineEdit}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur('headline', e)}
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 ${currentTheme.text} ${editableClass}`}
              title="Click to edit headline"
            >
              {headline}
            </h2>
            <p
              contentEditable={!!onInlineEdit}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur('subtitle', e)}
              className={`text-base sm:text-lg ${currentTheme.muted} mb-10 max-w-xl mx-auto leading-relaxed ${editableClass}`}
              title="Click to edit subtitle"
            >
              {subtitle}
            </p>

            {submitted ? (
              <div className={`p-6 ${currentTheme.card} flex items-center justify-center gap-3 text-emerald-400 max-w-md mx-auto`}>
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <span className="font-semibold text-sm">Thank you! We'll be in touch very soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={emailPlaceholder}
                  required
                  className={`w-full px-5 py-3.5 rounded-xl text-sm border focus:outline-none transition ${currentTheme.border} ${
                    !isLightTheme ? 'bg-slate-900 text-white placeholder-slate-500 focus:border-indigo-500' : 'bg-white text-slate-900 placeholder-slate-400 focus:border-indigo-500 shadow-sm'
                  }`}
                />
                <button
                  type="submit"
                  className={`w-full sm:w-auto px-7 py-3.5 rounded-xl text-sm font-semibold whitespace-nowrap flex items-center justify-center gap-2 ${currentTheme.primaryBtn}`}
                >
                  <span
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleBlur('buttonText', e)}
                    className={editableClass}
                  >
                    {buttonText}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </form>
            )}

            {secondaryText && (
              <p className={`text-xs ${currentTheme.muted} mt-4`}>
                {secondaryText}
              </p>
            )}
          </div>
        )}

        {variant === 'minimal-banner' && (
          <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 ${
            isLightTheme
              ? 'bg-gradient-to-r from-indigo-50 via-white to-sky-50 border-indigo-200 shadow-indigo-100/50'
              : 'bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/30'
          }`}>
            <div className="max-w-xl text-center lg:text-left">
              {badge && (
                <div
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBlur('badge', e)}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${currentTheme.accentTag} ${editableClass}`}
                >
                  {badge}
                </div>
              )}
              <h2
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('headline', e)}
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 ${currentTheme.text} ${editableClass}`}
              >
                {headline}
              </h2>
              <p
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('subtitle', e)}
                className={`text-sm ${currentTheme.muted} ${editableClass}`}
              >
                {subtitle}
              </p>
            </div>

            <div className="w-full lg:w-auto shrink-0">
              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Success! Check your inbox shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={emailPlaceholder}
                    required
                    className={`w-full sm:w-72 px-4 py-3 rounded-xl text-sm border focus:outline-none transition ${currentTheme.border} ${
                      !isLightTheme ? 'bg-slate-900 text-white placeholder-slate-500 focus:border-indigo-500' : 'bg-white text-slate-900 placeholder-slate-400 focus:border-indigo-500 shadow-sm'
                    }`}
                  />
                  <button
                    type="submit"
                    className={`w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${currentTheme.primaryBtn}`}
                  >
                    <span
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleBlur('buttonText', e)}
                      className={editableClass}
                    >
                      {buttonText}
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {(variant === 'split' || (!['centered', 'minimal-banner'].includes(variant))) && (
          <div className={`p-8 sm:p-14 ${currentTheme.card} grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-xl`}>
            <div className="lg:col-span-7">
              {badge && (
                <div
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleBlur('badge', e)}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${currentTheme.accentTag} ${editableClass}`}
                >
                  {badge}
                </div>
              )}
              <h2
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('headline', e)}
                className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 ${currentTheme.text} ${editableClass}`}
              >
                {headline}
              </h2>
              <p
                contentEditable={!!onInlineEdit}
                suppressContentEditableWarning={true}
                onBlur={(e) => handleBlur('subtitle', e)}
                className={`text-base sm:text-lg ${currentTheme.muted} leading-relaxed ${editableClass}`}
              >
                {subtitle}
              </p>
            </div>

            <div className="lg:col-span-5">
              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-sm">Thank you! We'll be in touch shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${currentTheme.muted}`}>
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={emailPlaceholder}
                      required
                      className={`w-full px-5 py-3.5 rounded-xl text-sm border focus:outline-none transition ${currentTheme.border} ${
                        !isLightTheme ? 'bg-slate-900 text-white placeholder-slate-500 focus:border-indigo-500' : 'bg-white text-slate-900 placeholder-slate-400 focus:border-indigo-500 shadow-sm'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 ${currentTheme.primaryBtn}`}
                  >
                    <span
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleBlur('buttonText', e)}
                      className={editableClass}
                    >
                      {buttonText}
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                  {secondaryText && (
                    <p className={`text-xs ${currentTheme.muted} text-center`}>
                      {secondaryText}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
