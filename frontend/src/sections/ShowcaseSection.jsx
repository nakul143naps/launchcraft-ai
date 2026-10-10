import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';
import { Tag, ArrowRight } from 'lucide-react';

export function ShowcaseSection({ section, theme = DEFAULT_THEME, isSelected, onSelect, onInlineEdit }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {}, variant = 'grid' } = section;
  const {
    badge = 'Curated Catalog',
    title = 'Featured Collections & Lending Rates',
    description = 'Explore physical editions, digital reserves, and specialized archive tiers available for borrowing.',
    items = [
      {
        title: 'Bestseller Fiction & Literature',
        category: 'General Fiction',
        price: 'Included in Membership',
        period: '21-day loan',
        description: 'New releases and award-winning fiction ready for instant mobile hold and locker pickup.',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
        badge: 'Top Pick'
      },
      {
        title: 'Academic & STEM Research Volumes',
        category: 'Scholarly Archive',
        price: '$4.99 / term',
        period: 'semester loan',
        description: 'Peer-reviewed journals, textbooks, and computational reference volumes with digital access.',
        imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3745b?auto=format&fit=crop&w=600&q=80',
        badge: 'Academic'
      },
      {
        title: 'Rare Manuscripts & Archival Folios',
        category: 'Special Collections',
        price: 'Vault Deposit',
        period: 'reading room only',
        description: 'Climate-controlled historical folios, cartography, and preserved first editions.',
        imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        badge: 'Rare Vault'
      }
    ]
  } = content;

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
      id="showcase"
      onClick={onSelect}
      className={`py-20 px-4 sm:px-6 lg:px-8 border-b ${currentTheme.border} relative cursor-pointer transition ${
        isSelected ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-500/5' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
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

        {/* 1. Compact List Layout */}
        {variant === 'compact-list' && (
          <div className={`max-w-4xl mx-auto divide-y ${currentTheme.border} rounded-2xl ${currentTheme.card} ${currentTheme.border} overflow-hidden shadow-xl`}>
            {items.map((item, idx) => (
              <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:opacity-90 transition">
                <div className="flex items-start gap-4">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className={`w-16 h-16 rounded-xl object-cover shrink-0 border ${currentTheme.border}`} />
                  )}
                  <div>
                    {item.category && <span className="text-[11px] font-bold uppercase text-indigo-500 block mb-0.5">{item.category}</span>}
                    <h3
                      contentEditable={Boolean(onInlineEdit)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateItem(idx, 'title', e.currentTarget.textContent.trim())}
                      className={`text-base font-bold ${currentTheme.text} ${editableClass}`}
                    >
                      {item.title}
                    </h3>
                    <p
                      contentEditable={Boolean(onInlineEdit)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateItem(idx, 'description', e.currentTarget.textContent.trim())}
                      className={`text-xs ${currentTheme.muted} mt-0.5 ${editableClass}`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span
                    contentEditable={Boolean(onInlineEdit)}
                    suppressContentEditableWarning
                    onBlur={(e) => updateItem(idx, 'price', e.currentTarget.textContent.trim())}
                    className={`text-xs font-bold text-indigo-600 ${editableClass}`}
                  >
                    {item.price}
                  </span>
                  <button className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${currentTheme.primaryBtn}`}>
                    Borrow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. Featured Horizontal Row */}
        {variant === 'featured-row' && (
          <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`w-80 shrink-0 rounded-2xl ${currentTheme.card} ${currentTheme.border} overflow-hidden shadow-xl flex flex-col group transition`}
              >
                {item.imageUrl && (
                  <div className="h-44 w-full overflow-hidden relative bg-slate-100">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    {item.badge && (
                      <span className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold ${currentTheme.accentTag}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {item.category && <div className="text-[10px] font-bold uppercase text-indigo-500 mb-1">{item.category}</div>}
                    <h3
                      contentEditable={Boolean(onInlineEdit)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateItem(idx, 'title', e.currentTarget.textContent.trim())}
                      className={`text-base font-bold ${currentTheme.text} mb-1 ${editableClass}`}
                    >
                      {item.title}
                    </h3>
                    <p
                      contentEditable={Boolean(onInlineEdit)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateItem(idx, 'description', e.currentTarget.textContent.trim())}
                      className={`text-xs ${currentTheme.muted} line-clamp-2 ${editableClass}`}
                    >
                      {item.description}
                    </p>
                  </div>
                  <div className={`pt-4 mt-3 border-t ${currentTheme.border} flex items-center justify-between`}>
                    <span
                      contentEditable={Boolean(onInlineEdit)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateItem(idx, 'price', e.currentTarget.textContent.trim())}
                      className={`text-xs font-bold text-indigo-600 ${editableClass}`}
                    >
                      {item.price}
                    </span>
                    <button className={`px-3 py-1 rounded-lg text-xs font-semibold ${currentTheme.primaryBtn}`}>
                      Borrow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Grid & Masonry Layouts (Default fallback) */}
        {(variant === 'grid' || variant === 'masonry' || (!['compact-list', 'featured-row'].includes(variant))) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-2xl ${currentTheme.card} ${currentTheme.border} overflow-hidden shadow-xl flex flex-col group transition`}
              >
                {item.imageUrl && (
                  <div className="h-48 w-full overflow-hidden relative bg-slate-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {item.badge && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold ${currentTheme.accentTag}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {item.category && (
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500 mb-1">
                        {item.category}
                      </div>
                    )}

                    <h3
                      contentEditable={Boolean(onInlineEdit)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateItem(idx, 'title', e.currentTarget.textContent.trim())}
                      className={`text-lg font-bold ${currentTheme.text} mb-2 ${editableClass}`}
                    >
                      {item.title}
                    </h3>

                    <p
                      contentEditable={Boolean(onInlineEdit)}
                      suppressContentEditableWarning
                      onBlur={(e) => updateItem(idx, 'description', e.currentTarget.textContent.trim())}
                      className={`text-xs sm:text-sm ${currentTheme.muted} leading-relaxed mb-4 ${editableClass}`}
                    >
                      {item.description}
                    </p>
                  </div>

                  <div className={`pt-4 border-t ${currentTheme.border} flex items-center justify-between`}>
                    <div>
                      <span
                        contentEditable={Boolean(onInlineEdit)}
                        suppressContentEditableWarning
                        onBlur={(e) => updateItem(idx, 'price', e.currentTarget.textContent.trim())}
                        className={`text-sm font-bold text-indigo-600 ${editableClass}`}
                      >
                        {item.price}
                      </span>
                      {item.period && (
                        <span className={`text-[11px] ${currentTheme.muted} ml-1`}>({item.period})</span>
                      )}
                    </div>
                    <button className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${currentTheme.primaryBtn} flex items-center gap-1`}>
                      <span>Borrow</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
