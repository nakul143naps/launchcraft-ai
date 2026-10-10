import React from 'react';
import { Check, Star } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function PricingSection({
  section,
  theme = DEFAULT_THEME,
  isSelected,
  onSelect,
  onInlineEdit
}) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content, variant = 'highlighted-middle' } = section;
  const {
    badge = 'Transparent Pricing',
    title = 'Simple, Predictable Plans',
    description = 'Start free and upgrade as your team expands. No hidden charges.',
    plans = []
  } = content || {};

  const handleBlur = (field, e) => {
    if (onInlineEdit) {
      onInlineEdit(section.id, field, e.currentTarget.innerText.trim());
    }
  };

  const handlePlanBlur = (idx, subField, e) => {
    if (onInlineEdit) {
      const newPlans = [...plans];
      newPlans[idx] = { ...newPlans[idx], [subField]: e.currentTarget.innerText.trim() };
      onInlineEdit(section.id, 'plans', newPlans);
    }
  };

  const editableClass = onInlineEdit
    ? 'hover:outline-dashed hover:outline-1 hover:outline-indigo-400/60 focus:outline-solid focus:outline-2 focus:outline-indigo-500 rounded px-1 transition-all cursor-text'
    : '';

  return (
    <section
      id="pricing"
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
            title="Click to edit title"
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

        {variant === 'minimal-table' ? (
          <div className={`max-w-5xl mx-auto overflow-x-auto rounded-3xl ${currentTheme.card} ${currentTheme.border} shadow-xl backdrop-blur-md`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${currentTheme.border}`}>
                  <th className={`p-6 text-sm font-bold ${currentTheme.text}`}>Plan & Scope</th>
                  <th className={`p-6 text-sm font-bold ${currentTheme.text}`}>Price</th>
                  <th className={`p-6 text-sm font-bold ${currentTheme.text}`}>Included Features</th>
                  <th className={`p-6 text-sm font-bold ${currentTheme.text} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${currentTheme.border}`}>
                {plans.map((plan, idx) => (
                  <tr key={idx} className={`transition hover:opacity-90 ${plan.highlighted ? 'bg-indigo-50/50' : ''}`}>
                    <td className="p-6 align-top">
                      <div className="flex items-center gap-2">
                        <span
                          contentEditable={!!onInlineEdit}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handlePlanBlur(idx, 'name', e)}
                          className={`text-base font-bold ${currentTheme.text} ${editableClass}`}
                        >
                          {plan.name}
                        </span>
                        {plan.highlighted && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${currentTheme.accentTag}`}>
                            Popular
                          </span>
                        )}
                      </div>
                      {plan.description && (
                        <p
                          contentEditable={!!onInlineEdit}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handlePlanBlur(idx, 'description', e)}
                          className={`text-xs ${currentTheme.muted} mt-1 ${editableClass}`}
                        >
                          {plan.description}
                        </p>
                      )}
                    </td>
                    <td className="p-6 align-top whitespace-nowrap">
                      <div className="flex items-baseline gap-1">
                        <span
                          contentEditable={!!onInlineEdit}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handlePlanBlur(idx, 'price', e)}
                          className={`text-2xl font-black ${currentTheme.text} ${editableClass}`}
                        >
                          {plan.price}
                        </span>
                        <span
                          contentEditable={!!onInlineEdit}
                          suppressContentEditableWarning={true}
                          onBlur={(e) => handlePlanBlur(idx, 'period', e)}
                          className={`text-xs ${currentTheme.muted} ${editableClass}`}
                        >
                          {plan.period || '/mo'}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 align-top">
                      <ul className={`space-y-1.5 text-xs ${currentTheme.muted}`}>
                        {(plan.features || []).map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-6 align-top text-right whitespace-nowrap">
                      <span
                        contentEditable={!!onInlineEdit}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handlePlanBlur(idx, 'cta', e)}
                        className={`inline-block px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          plan.highlighted ? currentTheme.primaryBtn : currentTheme.secondaryBtn
                        } ${editableClass}`}
                      >
                        {plan.cta || 'Select'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {plans.map((plan, idx) => {
              const isMiddle = variant === 'highlighted-middle' ? (plan.highlighted ?? idx === 1) : plan.highlighted;

              return (
                <div
                  key={idx}
                  className={`p-8 ${currentTheme.card} flex flex-col justify-between relative transition-all duration-200 ${
                    isMiddle ? `${currentTheme.highlightPlan} md:-translate-y-2` : ''
                  }`}
                >
                  {isMiddle && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentTheme.primaryBtn}`}>
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div>
                    <h3
                      contentEditable={!!onInlineEdit}
                      suppressContentEditableWarning={true}
                      onBlur={(e) => handlePlanBlur(idx, 'name', e)}
                      className={`text-xl font-bold mb-2 ${currentTheme.text} ${editableClass}`}
                      title="Click to edit plan name"
                    >
                      {plan.name}
                    </h3>
                    {plan.description && (
                      <p
                        contentEditable={!!onInlineEdit}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handlePlanBlur(idx, 'description', e)}
                        className={`text-sm ${currentTheme.muted} mb-6 min-h-[40px] ${editableClass}`}
                        title="Click to edit plan summary"
                      >
                        {plan.description}
                      </p>
                    )}

                    <div className="flex items-baseline gap-1 mb-8">
                      <span
                        contentEditable={!!onInlineEdit}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handlePlanBlur(idx, 'price', e)}
                        className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${currentTheme.text} ${editableClass}`}
                        title="Click to edit price"
                      >
                        {plan.price}
                      </span>
                      <span
                        contentEditable={!!onInlineEdit}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handlePlanBlur(idx, 'period', e)}
                        className={`text-sm ${currentTheme.muted} ${editableClass}`}
                        title="Click to edit period"
                      >
                        {plan.period || '/month'}
                      </span>
                    </div>

                    <ul className="space-y-3.5 mb-8">
                      {(plan.features || []).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-sm">
                          <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${currentTheme.accentTag}`}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                          <span className={currentTheme.muted}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span
                    contentEditable={!!onInlineEdit}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handlePlanBlur(idx, 'cta', e)}
                    className={`w-full py-3.5 rounded-xl text-center text-sm font-semibold transition cursor-pointer ${
                      isMiddle ? currentTheme.primaryBtn : currentTheme.secondaryBtn
                    } ${editableClass}`}
                    title="Click to edit button text"
                  >
                    {plan.cta || 'Get Started'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
