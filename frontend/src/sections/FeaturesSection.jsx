import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';
import { IconRenderer } from '../components/IconRenderer';

export function FeaturesSection({
  section,
  theme = DEFAULT_THEME,
  isSelected,
  onSelect,
  onInlineEdit
}) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content, variant = 'three-column' } = section;
  const {
    badge = 'Key Features',
    title = 'Powerful Features Built for Modern Teams',
    description = 'Streamline your workflow with tools that scale alongside your ambitions.',
    items = []
  } = content || {};

  const handleBlur = (field, e) => {
    if (onInlineEdit) {
      onInlineEdit(section.id, field, e.currentTarget.innerText.trim());
    }
  };

  const handleItemBlur = (idx, subField, e) => {
    if (onInlineEdit) {
      const newItems = [...items];
      newItems[idx] = { ...newItems[idx], [subField]: e.currentTarget.innerText.trim() };
      onInlineEdit(section.id, 'items', newItems);
    }
  };

  const editableClass = onInlineEdit
    ? 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/60 focus:outline-solid focus:outline-2 focus:outline-indigo-500 rounded px-1 transition-all cursor-text'
    : '';

  const isLightTheme = ['bright', 'sunny', 'minimal', 'fresh'].includes(theme);

  return (
    <section
      id="features"
      onClick={onSelect}
      className={`relative w-full py-20 px-6 transition-all cursor-pointer ${
        isSelected ? 'ring-2 ring-indigo-500 shadow-xl' : 'hover:ring-1 hover:ring-indigo-500/30'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && (
            <div
              contentEditable={!!onInlineEdit}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleBlur('badge', e)}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${currentTheme.accentTag} ${editableClass}`}
              title="Click to edit badge"
            >
              {badge}
            </div>
          )}
          <h2
            contentEditable={!!onInlineEdit}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleBlur('title', e)}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${currentTheme.text} ${editableClass}`}
            title="Click to edit section title"
          >
            {title}
          </h2>
          <p
            contentEditable={!!onInlineEdit}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleBlur('description', e)}
            className={`text-base sm:text-lg ${currentTheme.muted} max-w-2xl mx-auto ${editableClass}`}
            title="Click to edit description"
          >
            {description}
          </p>
        </div>

        {variant === 'bento-grid' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {items.map((item, idx) => {
              // Asymmetric bento styling: First item is wide (col-span-8), second is col-span-4, rest are col-span-4 or 6
              const colSpan = idx === 0 ? 'md:col-span-8' : idx === 1 ? 'md:col-span-4' : items.length % 2 === 0 ? 'md:col-span-6' : 'md:col-span-4';
              const isLead = idx === 0;

              return (
                <div
                  key={idx}
                  className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between ${colSpan} ${
                    isLead
                      ? (isLightTheme
                          ? 'bg-gradient-to-br from-indigo-50 via-white to-sky-50 border-indigo-200 shadow-xl shadow-indigo-100/50'
                          : 'bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-900/60 border-indigo-500/30 shadow-xl')
                      : `${currentTheme.card} ${currentTheme.border}`
                  }`}
                >
                  {isLead && (
                    <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16 ${
                      isLightTheme ? 'bg-indigo-300/20' : 'bg-indigo-500/10'
                    }`} />
                  )}

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center shadow-inner ${
                      isLead
                        ? (isLightTheme ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30')
                        : currentTheme.accentTag
                    }`}>
                      <IconRenderer name={item.icon} className="w-6 h-6" />
                    </div>
                    <h3
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleItemBlur(idx, 'title', e)}
                      className={`text-xl sm:text-2xl font-bold mb-3 ${currentTheme.text} ${editableClass}`}
                    >
                      {item.title}
                    </h3>
                    <p
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleItemBlur(idx, 'description', e)}
                      className={`text-sm sm:text-base ${currentTheme.muted} leading-relaxed ${editableClass}`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {isLead && (
                    <div className={`mt-8 pt-4 border-t flex items-center gap-2 text-xs font-semibold ${
                      isLightTheme ? 'border-indigo-100 text-indigo-600' : 'border-indigo-500/20 text-indigo-400'
                    }`}>
                      <span>Core Architecture Pillar</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {(variant === 'three-column' || (!['four-column', 'alternating', 'bento-grid'].includes(variant))) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`p-8 ${currentTheme.card} flex flex-col items-start transition-all duration-200 hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${currentTheme.accentTag}`}>
                  <IconRenderer name={item.icon} className="w-6 h-6" />
                </div>
                <h3
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleItemBlur(idx, 'title', e)}
                  className={`text-xl font-bold mb-3 ${currentTheme.text} ${editableClass}`}
                  title="Click to edit feature name"
                >
                  {item.title}
                </h3>
                <p
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleItemBlur(idx, 'description', e)}
                  className={`text-sm sm:text-base ${currentTheme.muted} leading-relaxed ${editableClass}`}
                  title="Click to edit feature description"
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {variant === 'four-column' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 ${currentTheme.card} flex flex-col items-start transition hover:-translate-y-1`}
              >
                <div className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center ${currentTheme.accentTag}`}>
                  <IconRenderer name={item.icon} className="w-5 h-5" />
                </div>
                <h3
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleItemBlur(idx, 'title', e)}
                  className={`text-lg font-bold mb-2 ${currentTheme.text} ${editableClass}`}
                >
                  {item.title}
                </h3>
                <p
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleItemBlur(idx, 'description', e)}
                  className={`text-xs sm:text-sm ${currentTheme.muted} leading-relaxed ${editableClass}`}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {variant === 'alternating' && (
          <div className="space-y-8 max-w-4xl mx-auto">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`p-8 ${currentTheme.card} flex flex-col sm:flex-row items-center gap-6 sm:gap-8 ${
                  idx % 2 === 1 ? 'sm:flex-row-reverse' : ''
                }`}
              >
                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${currentTheme.accentTag}`}>
                  <IconRenderer name={item.icon} className="w-8 h-8" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleItemBlur(idx, 'title', e)}
                    className={`text-xl font-bold mb-2 ${currentTheme.text} ${editableClass}`}
                  >
                    {item.title}
                  </h3>
                  <p
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleItemBlur(idx, 'description', e)}
                    className={`text-sm sm:text-base ${currentTheme.muted} leading-relaxed ${editableClass}`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
