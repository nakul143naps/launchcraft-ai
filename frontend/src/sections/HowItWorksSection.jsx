import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';
import { ArrowRight } from 'lucide-react';

export function HowItWorksSection({ section, theme = DEFAULT_THEME, isSelected, onSelect, onInlineEdit }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {}, variant = 'process-flow' } = section;
  const {
    badge = 'Workflow',
    title = 'How Borrowing & Circulation Works in 3 Steps',
    description = 'A zero-friction, automated experience designed for both patrons and library staff.',
    steps = [
      {
        stepNumber: 1,
        title: 'Search & Reserve in 1-Tap',
        description: 'Browse real-time shelf availability on mobile or web. Place instant holds on physical books or digital editions.'
      },
      {
        stepNumber: 2,
        title: 'Scan & Self-Checkout',
        description: 'Walk up to any RFID or barcode kiosk. Scan your member card and grab your books in under 10 seconds.'
      },
      {
        stepNumber: 3,
        title: 'Automated Return & Renewals',
        description: 'Drop books into smart drop-chutes anytime. Automated sensors check them back into circulation and clear late fees.'
      }
    ]
  } = content;

  const updateStep = (idx, key, val) => {
    if (!onInlineEdit) return;
    const newSteps = [...steps];
    newSteps[idx] = { ...newSteps[idx], [key]: val };
    onInlineEdit(section.id, 'steps', newSteps);
  };

  const editableClass = onInlineEdit
    ? 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/60 focus:outline-solid focus:outline-2 focus:outline-indigo-500 rounded px-1 transition-all cursor-text'
    : '';

  return (
    <section
      id="how-it-works"
      onClick={onSelect}
      className={`py-20 px-4 sm:px-6 lg:px-8 border-b ${currentTheme.border} relative cursor-pointer transition ${
        isSelected ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-500/5' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && (
            <span
              contentEditable={Boolean(onInlineEdit)}
              suppressContentEditableWarning
              onBlur={(e) => onInlineEdit && onInlineEdit(section.id, 'badge', e.currentTarget.textContent.trim())}
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${currentTheme.accentTag} inline-block mb-3 ${editableClass}`}
            >
              {badge}
            </span>
          )}

          {title && (
            <h2
              contentEditable={Boolean(onInlineEdit)}
              suppressContentEditableWarning
              onBlur={(e) => onInlineEdit && onInlineEdit(section.id, 'title', e.currentTarget.textContent.trim())}
              className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 ${currentTheme.text} ${editableClass}`}
            >
              {title}
            </h2>
          )}

          {description && (
            <p
              contentEditable={Boolean(onInlineEdit)}
              suppressContentEditableWarning
              onBlur={(e) => onInlineEdit && onInlineEdit(section.id, 'description', e.currentTarget.textContent.trim())}
              className={`text-sm sm:text-base ${currentTheme.muted} leading-relaxed ${editableClass}`}
            >
              {description}
            </p>
          )}
        </div>

        {/* 1. Vertical Timeline Variant */}
        {variant === 'timeline' && (
          <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30 z-10">
                  {step.stepNumber || step.number || `0${idx + 1}`}
                </div>
                <div className={`flex-1 p-6 rounded-2xl ${currentTheme.card} ${currentTheme.border} border shadow-lg`}>
                  <h3
                    contentEditable={Boolean(onInlineEdit)}
                    suppressContentEditableWarning
                    onBlur={(e) => updateStep(idx, 'title', e.currentTarget.textContent.trim())}
                    className={`text-lg font-bold ${currentTheme.text} mb-2 ${editableClass}`}
                  >
                    {step.title}
                  </h3>
                  <p
                    contentEditable={Boolean(onInlineEdit)}
                    suppressContentEditableWarning
                    onBlur={(e) => updateStep(idx, 'description', e.currentTarget.textContent.trim())}
                    className={`text-xs sm:text-sm ${currentTheme.muted} leading-relaxed ${editableClass}`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Process Flow with Connectors & Numbered Cards (Default) */}
        {(variant === 'process-flow' || variant === 'cards' || variant === 'numbered' || (!['timeline'].includes(variant))) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl ${currentTheme.card} ${currentTheme.border} shadow-xl flex flex-col justify-between relative group transition`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 font-extrabold text-lg flex items-center justify-center mb-6 shadow-inner">
                    {step.stepNumber || step.number || `0${idx + 1}`}
                  </div>

                  <h3
                    contentEditable={Boolean(onInlineEdit)}
                    suppressContentEditableWarning
                    onBlur={(e) => updateStep(idx, 'title', e.currentTarget.textContent.trim())}
                    className={`text-lg font-bold ${currentTheme.text} mb-3 ${editableClass}`}
                  >
                    {step.title}
                  </h3>

                  <p
                    contentEditable={Boolean(onInlineEdit)}
                    suppressContentEditableWarning
                    onBlur={(e) => updateStep(idx, 'description', e.currentTarget.textContent.trim())}
                    className={`text-xs sm:text-sm ${currentTheme.muted} leading-relaxed ${editableClass}`}
                  >
                    {step.description}
                  </p>
                </div>

                {variant === 'process-flow' && idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="w-6 h-6 text-indigo-500/60" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
