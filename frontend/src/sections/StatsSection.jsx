import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';
import { IconRenderer } from '../components/IconRenderer';

export function StatsSection({ section, theme = DEFAULT_THEME, isSelected, onSelect, onInlineEdit }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {}, variant = 'grid' } = section;
  const {
    badge = 'By the Numbers',
    title = 'Proven Metrics & Quantitative Impact',
    description = ''
  } = content;

  const rawStats = content.metrics || content.stats || [
    { value: '50,000+', label: 'Titles Cataloged', description: 'Real-time stack tracking', icon: 'book' },
    { value: '3.2x', label: 'Faster Checkout', description: 'Instant barcode scan', icon: 'zap' },
    { value: '94%', label: 'On-Time Returns', description: 'Zero overdue backlog', icon: 'activity' },
    { value: '$0', label: 'Late Fee Surprises', description: 'Transparent grace periods', icon: 'shield' }
  ];

  const updateItem = (idx, key, val) => {
    if (!onInlineEdit) return;
    const newItems = [...rawStats];
    newItems[idx] = { ...newItems[idx], [key]: val };
    const fieldName = content.metrics ? 'metrics' : 'stats';
    onInlineEdit(section.id, fieldName, newItems);
  };

  const editableClass = onInlineEdit
    ? 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/60 focus:outline-solid focus:outline-2 focus:outline-indigo-500 rounded px-1 transition-all cursor-text'
    : '';

  return (
    <section
      id="stats"
      onClick={onSelect}
      className={`py-16 px-4 sm:px-6 lg:px-8 border-b ${currentTheme.border} relative cursor-pointer transition ${
        isSelected ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-500/5' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto text-center">
        {badge && (
          <div className="inline-block mb-3">
            <span
              contentEditable={Boolean(onInlineEdit)}
              suppressContentEditableWarning
              onBlur={(e) => onInlineEdit && onInlineEdit(section.id, 'badge', e.currentTarget.textContent.trim())}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${currentTheme.accentTag} ${editableClass}`}
            >
              {badge}
            </span>
          </div>
        )}

        {title && (
          <h2
            contentEditable={Boolean(onInlineEdit)}
            suppressContentEditableWarning
            onBlur={(e) => onInlineEdit && onInlineEdit(section.id, 'title', e.currentTarget.textContent.trim())}
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 ${currentTheme.text} ${editableClass}`}
          >
            {title}
          </h2>
        )}

        {description && (
          <p
            contentEditable={Boolean(onInlineEdit)}
            suppressContentEditableWarning
            onBlur={(e) => onInlineEdit && onInlineEdit(section.id, 'description', e.currentTarget.textContent.trim())}
            className={`text-sm sm:text-base ${currentTheme.muted} max-w-2xl mx-auto mb-10 ${editableClass}`}
          >
            {description}
          </p>
        )}

        {/* 1. Minimal Typographic Row */}
        {variant === 'minimal-stats' && (
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 py-8 divide-y sm:divide-y-0 sm:divide-x ${currentTheme.border}`}>
            {rawStats.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center px-4 py-2">
                <div
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'value', e.currentTarget.textContent.trim())}
                  className={`text-4xl sm:text-5xl font-black tracking-tight text-indigo-600 mb-1 ${editableClass}`}
                >
                  {item.value}
                </div>
                <div
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'label', e.currentTarget.textContent.trim())}
                  className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${currentTheme.muted} ${editableClass}`}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Inline Bar Ribbon */}
        {variant === 'inline-bar' && (
          <div className={`p-6 rounded-2xl ${currentTheme.card} ${currentTheme.border} flex flex-wrap items-center justify-around gap-6 shadow-xl`}>
            {rawStats.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'value', e.currentTarget.textContent.trim())}
                  className={`text-2xl sm:text-3xl font-extrabold text-indigo-600 ${editableClass}`}
                >
                  {item.value}
                </div>
                <div className="text-left">
                  <div
                    contentEditable={Boolean(onInlineEdit)}
                    suppressContentEditableWarning
                    onBlur={(e) => updateItem(idx, 'label', e.currentTarget.textContent.trim())}
                    className={`text-xs font-bold ${currentTheme.text} uppercase tracking-wider ${editableClass}`}
                  >
                    {item.label}
                  </div>
                  {(item.description || item.subtext) && (
                    <div className={`text-[11px] ${currentTheme.muted}`}>
                      {item.description || item.subtext}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Cards & Grid Layouts (Default fallback) */}
        {(variant === 'grid' || variant === 'cards' || (!['minimal-stats', 'inline-bar'].includes(variant))) && (
          <div className={`grid gap-6 ${
            rawStats.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            {rawStats.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border shadow-lg flex flex-col items-center text-center transition hover:-translate-y-1 ${currentTheme.card} ${currentTheme.border}`}
              >
                {item.icon && (
                  <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center ${currentTheme.accentTag}`}>
                    <IconRenderer name={item.icon} className="w-5 h-5" />
                  </div>
                )}
                <div
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'value', e.currentTarget.textContent.trim())}
                  className={`text-3xl sm:text-4xl font-extrabold text-indigo-600 mb-1 ${editableClass}`}
                >
                  {item.value}
                </div>
                <div
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'label', e.currentTarget.textContent.trim())}
                  className={`text-sm font-semibold ${currentTheme.text} mb-1 ${editableClass}`}
                >
                  {item.label}
                </div>
                {(item.description || item.subtext) && (
                  <div
                    contentEditable={Boolean(onInlineEdit)}
                    suppressContentEditableWarning
                    onBlur={(e) => updateItem(idx, item.description ? 'description' : 'subtext', e.currentTarget.textContent.trim())}
                    className={`text-xs ${currentTheme.muted} leading-relaxed ${editableClass}`}
                  >
                    {item.description || item.subtext}
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
