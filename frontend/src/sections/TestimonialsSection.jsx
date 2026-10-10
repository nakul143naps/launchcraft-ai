import React from 'react';
import { Quote, Star } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function TestimonialsSection({
  section,
  theme = DEFAULT_THEME,
  isSelected,
  onSelect,
  onInlineEdit
}) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content, variant = 'cards' } = section;
  const {
    badge = 'Customer Love',
    title = 'Trusted by Industry Leaders',
    description = 'Discover why thousands of professionals rely on our solutions daily.',
    testimonials = []
  } = content || {};

  const handleBlur = (field, e) => {
    if (onInlineEdit) {
      onInlineEdit(section.id, field, e.currentTarget.innerText.trim());
    }
  };

  const handleTestimonialBlur = (idx, subField, e) => {
    if (onInlineEdit) {
      const newT = [...testimonials];
      newT[idx] = { ...newT[idx], [subField]: e.currentTarget.innerText.trim() };
      onInlineEdit(section.id, 'testimonials', newT);
    }
  };

  const editableClass = onInlineEdit
    ? 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/60 focus:outline-solid focus:outline-2 focus:outline-indigo-500 rounded px-1 transition-all cursor-text'
    : '';

  return (
    <section
      id="testimonials"
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

        {variant === 'masonry-reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl ${currentTheme.card} ${currentTheme.border} border shadow-lg flex flex-col justify-between transition hover:-translate-y-1 ${idx % 2 === 1 ? 'md:mt-6' : ''}`}
              >
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {Array.from({ length: item.rating || 5 }).map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTestimonialBlur(idx, 'quote', e)}
                    className={`text-base sm:text-lg ${currentTheme.text} italic mb-6 leading-relaxed ${editableClass}`}
                    title="Click to edit quote"
                  >
                    "{item.quote}"
                  </p>
                </div>
                <div className={`flex items-center gap-3 pt-4 border-t ${currentTheme.border}`}>
                  <img
                    src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-indigo-200"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                  <div>
                    <h4
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleTestimonialBlur(idx, 'name', e)}
                      className={`font-bold text-sm ${currentTheme.text} ${editableClass}`}
                    >
                      {item.name}
                    </h4>
                    <p
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleTestimonialBlur(idx, 'role', e)}
                      className={`text-xs ${currentTheme.muted} ${editableClass}`}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(variant === 'cards' || (!['featured-quote', 'masonry-reviews'].includes(variant))) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className={`p-8 ${currentTheme.card} ${currentTheme.border} border flex flex-col justify-between transition hover:-translate-y-1`}
              >
                <div>
                  <div className="flex gap-1 text-amber-400 mb-6">
                    {Array.from({ length: item.rating || 5 }).map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTestimonialBlur(idx, 'quote', e)}
                    className={`text-base ${currentTheme.text} italic mb-8 leading-relaxed ${editableClass}`}
                    title="Click to edit quote"
                  >
                    "{item.quote}"
                  </p>
                </div>

                <div className={`flex items-center gap-4 pt-4 border-t ${currentTheme.border}`}>
                  <img
                    src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                    }}
                  />
                  <div>
                    <h4
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleTestimonialBlur(idx, 'name', e)}
                      className={`font-bold text-sm ${currentTheme.text} ${editableClass}`}
                      title="Click to edit name"
                    >
                      {item.name}
                    </h4>
                    <p
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handleTestimonialBlur(idx, 'role', e)}
                      className={`text-xs ${currentTheme.muted} ${editableClass}`}
                      title="Click to edit role"
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {variant === 'featured-quote' && (
          <div className="max-w-4xl mx-auto">
            {testimonials[0] && (
              <div className={`p-10 sm:p-14 ${currentTheme.card} text-center flex flex-col items-center relative shadow-xl`}>
                <Quote className="w-12 h-12 text-slate-500/30 mb-6" />
                <p
                  contentEditable={!!onInlineEdit}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleTestimonialBlur(0, 'quote', e)}
                  className={`text-xl sm:text-2xl lg:text-3xl font-medium ${currentTheme.text} italic mb-10 leading-relaxed ${editableClass}`}
                  title="Click to edit featured quote"
                >
                  "{testimonials[0].quote}"
                </p>
                <div className="flex flex-col items-center">
                  <img
                    src={testimonials[0].avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={testimonials[0].name}
                    className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-slate-700"
                  />
                  <h4
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTestimonialBlur(0, 'name', e)}
                    className={`text-lg font-bold ${currentTheme.text} ${editableClass}`}
                    title="Click to edit name"
                  >
                    {testimonials[0].name}
                  </h4>
                  <p
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleTestimonialBlur(0, 'role', e)}
                    className={`text-sm ${currentTheme.muted} ${editableClass}`}
                    title="Click to edit role"
                  >
                    {testimonials[0].role}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
