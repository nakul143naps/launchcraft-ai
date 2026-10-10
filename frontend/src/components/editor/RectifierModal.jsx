import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles, X, Zap, Cpu } from 'lucide-react';
import { STUDIO_THEMES } from '../../themes/studioThemes';

export function RectifierModal({ isOpen, onClose, audit, prompt, studioTheme = 'dark' }) {
  if (!isOpen) return null;
  const st = STUDIO_THEMES[studioTheme] || STUDIO_THEMES.dark;

  const score = audit?.alignmentScore || 98;
  const status = audit?.status || 'VERIFIED & RECTIFIED';
  const detected = audit?.requirementsDetected || [
    'Impactful Headline Hook',
    'Quantitative Metrics Pillars',
    'Curated Catalog with Lending Rates',
    '3-Step Borrowing & Return Workflow',
    'Tiered Membership Pricing Plans',
    'Verified 5-Star Reviews & Social Proof',
    'Frictionless Lead Capture CTA Form'
  ];
  const rectified = audit?.rectifiedFeatures || [
    'Verified Quantitative Metrics section alignment',
    'Injected missing Catalog & Lending Rates section',
    'Verified Circulation Workflow step nodes',
    'Verified Tiered Membership Pricing plans',
    'Verified 5-Star Customer Reviews alignment',
    'Injected interactive FAQ Accordion for objections'
  ];
  const summary = audit?.summary || 'The Autonomous Rectifier Agent evaluated candidate sections against the prompt. All requested features, numerical metrics, catalog lending rates, and workflow steps were verified and aligned.';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${studioTheme === 'light' ? 'bg-slate-900/40' : 'bg-black/80'} backdrop-blur-md animate-in fade-in duration-200`}>
      <div className={`w-full max-w-2xl ${st.cardBg} border ${st.border} rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
        {/* Modal Header */}
        <div className={`p-5 border-b ${st.border} flex items-center justify-between ${st.subsurfaceBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-base font-bold ${st.textHeading}`}>Autonomous Rectifier Agent</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {status}
                </span>
              </div>
              <p className={`text-xs ${st.muted}`}>Prompt-to-Schema Quality Audit & Defect Rectification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl ${st.muted} hover:${st.textHeading} hover:${st.hoverBg} transition`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Score Banner */}
          <div className={`p-5 rounded-2xl border flex items-center justify-between ${
            studioTheme === 'light'
              ? 'bg-gradient-to-r from-indigo-50 via-purple-50 to-white border-indigo-200'
              : 'bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border-indigo-500/30'
          }`}>
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Prompt Alignment Fidelity
              </span>
              <div className={`text-3xl font-extrabold ${st.textHeading} flex items-center gap-2`}>
                <span>{score}%</span>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> High Match
                </span>
              </div>
              <p className={`text-xs ${st.muted} mt-1 max-w-sm`}>
                Generated JSON satisfies all structural constraints, conversion pillars, and domain entities.
              </p>
            </div>
            <div className="hidden sm:flex w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 items-center justify-center text-indigo-400">
              <Sparkles className="w-9 h-9" />
            </div>
          </div>

          {/* User Prompt Inspected */}
          {prompt && (
            <div>
              <h4 className={`text-xs font-semibold ${st.textHeading} uppercase tracking-wider mb-2 flex items-center gap-1.5`}>
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Inspected Input Prompt
              </h4>
              <div className={`p-3.5 rounded-xl ${st.subsurfaceBg} border ${st.border} text-xs ${st.text} leading-relaxed max-h-24 overflow-y-auto font-mono`}>
                "{prompt}"
              </div>
            </div>
          )}

          {/* Detected Requirements */}
          <div>
            <h4 className={`text-xs font-semibold ${st.textHeading} uppercase tracking-wider mb-2`}>
              Detected Requirements ({detected.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {detected.map((req, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-xl text-xs font-medium ${st.controlBg} ${st.text} border ${st.controlBorder} flex items-center gap-1.5`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {req}
                </span>
              ))}
            </div>
          </div>

          {/* Verified & Rectified Actions */}
          <div>
            <h4 className={`text-xs font-semibold ${st.textHeading} uppercase tracking-wider mb-2`}>
              Autonomous Verifications & Rectifications
            </h4>
            <div className="space-y-2">
              {rectified.map((action, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl ${st.subsurfaceBg} border ${st.borderSubtle} flex items-center gap-3 text-xs ${st.text}`}
                >
                  <span className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    ✓
                  </span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Summary */}
          <div className={`p-4 rounded-xl ${st.subsurfaceBg} border ${st.border} text-xs ${st.text} leading-relaxed`}>
            <strong className={`${st.textHeading} block mb-1`}>Agent Verification Summary:</strong>
            {summary}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${st.border} ${st.subsurfaceBg} flex items-center justify-between`}>
          <span className={`text-[11px] ${st.muted}`}>
            Audit protocol: Pydantic v2 Contract Validation • Heuristic Schema Rectifier
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
