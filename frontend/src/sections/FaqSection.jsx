import React, { useState } from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function FaqSection({ section, theme = DEFAULT_THEME, isSelected, onSelect, onInlineEdit }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {}, variant = 'accordion' } = section;
  const {
    badge = 'Got Questions?',
    title = 'Frequently Asked Questions',
    description = 'Everything you need to know about book borrowing, lending pricing, and system setup.',
    items = [
      {
        question: 'How do lending prices work for different kinds of books?',
        answer: 'Standard fiction and community editions are 100% included with patron memberships. Specialized academic reserves, textbooks, and rare archival manuscripts can have custom per-term or daily lending fees configured by library administrators.'
      },
      {
        question: 'What happens when books are returned or overdue?',
        answer: 'Our smart drop-box automatically reads the RFID tag upon drop-in, checking the volume back into inventory immediately. Patrons receive instant return confirmation receipts, and automated 48-hour reminders prevent overdue late fees.'
      },
      {
        question: 'Can academic institutions and community branches sync catalogs?',
        answer: 'Yes! The Institutional tier includes multi-branch OPAC synchronization, automated inter-library loan logistics, and full 1-click import/export of existing MARC21 and CSV archives.'
      },
      {
        question: 'Is there a free trial for libraries looking to modernize?',
        answer: 'Yes, we offer a full 14-day zero-risk trial with hands-on catalog migration assistance and staff onboarding included at no cost.'
      }
    ]
  } = content;

  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  const updateItem = (idx, key, val) => {
    if (!onInlineEdit) return;
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [key]: val };
    onInlineEdit(section.id, 'items', newItems);
  };

  const editableClass = onInlineEdit
    ? 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/60 focus:outline-solid focus:outline-2 focus:outline-indigo-500 rounded px-1 transition-all cursor-text'
    : '';

  return (
    <section
      id="faq"
      onClick={onSelect}
      className={`py-20 px-4 sm:px-6 lg:px-8 border-b ${currentTheme.border} relative cursor-pointer transition ${
        isSelected ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-500/5' : ''
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
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

        {/* 1. Two-Column Layout */}
        {variant === 'two-column' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => (
              <div key={idx} className={`p-6 rounded-2xl ${currentTheme.card} ${currentTheme.border} border shadow-md flex flex-col justify-start`}>
                <h3
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'question', e.currentTarget.textContent.trim())}
                  className={`text-base font-bold mb-3 ${currentTheme.text} ${editableClass}`}
                >
                  {item.question}
                </h3>
                <p
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'answer', e.currentTarget.textContent.trim())}
                  className={`text-xs sm:text-sm ${currentTheme.muted} leading-relaxed ${editableClass}`}
                >
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 2. Minimal List Layout */}
        {variant === 'minimal-list' && (
          <div className={`divide-y ${currentTheme.border} border-y ${currentTheme.border}`}>
            {items.map((item, idx) => (
              <div key={idx} className="py-6">
                <h3
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'question', e.currentTarget.textContent.trim())}
                  className={`text-base sm:text-lg font-bold mb-2 ${currentTheme.text} ${editableClass}`}
                >
                  {item.question}
                </h3>
                <p
                  contentEditable={Boolean(onInlineEdit)}
                  suppressContentEditableWarning
                  onBlur={(e) => updateItem(idx, 'answer', e.currentTarget.textContent.trim())}
                  className={`text-sm ${currentTheme.muted} leading-relaxed ${editableClass}`}
                >
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 3. Accordion Layout (Default) */}
        {(variant === 'accordion' || (!['two-column', 'minimal-list'].includes(variant))) && (
          <div className="space-y-4">
            {items.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition overflow-hidden ${currentTheme.card} ${currentTheme.border}`}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(idx);
                    }}
                    className={`w-full p-5 text-left flex items-center justify-between ${currentTheme.text} font-semibold text-base transition`}
                  >
                    <span
                      contentEditable={Boolean(onInlineEdit)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateItem(idx, 'question', e.currentTarget.textContent.trim())}
                      className={editableClass}
                    >
                      {item.question}
                    </span>
                    <div className={`ml-4 p-1.5 rounded-lg ${currentTheme.accentTag} shrink-0`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className={`px-5 pb-5 text-sm ${currentTheme.muted} leading-relaxed border-t ${currentTheme.border} pt-4`}>
                      <p
                        contentEditable={Boolean(onInlineEdit)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateItem(idx, 'answer', e.currentTarget.textContent.trim())}
                        className={editableClass}
                      >
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
