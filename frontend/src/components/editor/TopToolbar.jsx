import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Code,
  Download,
  FileCode,
  Laptop,
  Maximize2,
  Moon,
  Palette,
  Redo2,
  Smartphone,
  Sparkles,
  Sun,
  Tablet,
  Undo2,
  Wand2
} from 'lucide-react';
import { THEMES } from '../../themes/themes';
import { STUDIO_THEMES } from '../../themes/studioThemes';

const THEME_DOTS = {
  bright: 'bg-sky-400 ring-1 ring-sky-300',
  sunny: 'bg-amber-400',
  fresh: 'bg-emerald-500',
  minimal: 'bg-zinc-200 border border-zinc-400',
  bold: 'bg-indigo-500 shadow-sm shadow-indigo-500/50',
  cyber: 'bg-cyan-400 shadow-sm shadow-cyan-400/50',
  sunset: 'bg-rose-500 shadow-sm shadow-rose-500/50'
};

export function TopToolbar({
  siteName,
  onUpdateSiteName,
  previewMode,
  setPreviewMode,
  currentTheme,
  onSelectTheme,
  onExportReact,
  onExportHtml,
  isExporting,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onScrollToStudio,
  onScrollToWorkspace,
  rectifierAudit,
  onOpenRectifierModal,
  studioTheme = 'dark',
  onSelectStudioTheme
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const st = STUDIO_THEMES[studioTheme] || STUDIO_THEMES.dark;

  return (
    <header className={`sticky top-0 h-16 border-b ${st.border} ${st.headerBg} backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-50 select-none shadow-sm transition-colors duration-200`}>
      {/* Left: Brand & Undo/Redo & Project Name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-base tracking-tight ${st.textHeading} hidden sm:inline`}>
                LaunchCraft <span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hidden md:inline">
                STUDIO v2
              </span>
            </div>
          </div>
        </div>

        <div className={`h-5 w-px ${st.border} mx-1 hidden sm:block`} />

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded-lg ${st.muted} hover:${st.textHeading} hover:${st.hoverBg} disabled:opacity-30 transition`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded-lg ${st.muted} hover:${st.textHeading} hover:${st.hoverBg} disabled:opacity-30 transition`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Editable Site Name */}
        <div className="hidden lg:flex items-center gap-2 ml-1">
          <input
            type="text"
            value={siteName}
            onChange={(e) => onUpdateSiteName(e.target.value)}
            className={`bg-transparent text-xs font-semibold ${st.text} hover:${st.textHeading} focus:${st.textHeading} focus:${st.controlBg} px-2.5 py-1 rounded-md border border-transparent hover:${st.controlBorder} focus:border-indigo-500/50 outline-none transition w-44`}
            title="Click to rename project"
          />
        </div>
      </div>

      {/* Center Controls: Quick Jump & Viewports */}
      <div className="flex items-center gap-3">
        {/* Navigation Quick Jump */}
        <div className={`hidden md:flex items-center ${st.subsurfaceBg} p-1 rounded-xl border ${st.controlBorder}`}>
          <button
            onClick={onScrollToStudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${st.muted} hover:${st.textHeading} hover:${st.hoverBg} transition`}
          >
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Prompt Studio</span>
          </button>
          <button
            onClick={onScrollToWorkspace}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${st.muted} hover:${st.textHeading} hover:${st.hoverBg} transition`}
          >
            <Laptop className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Workspace</span>
          </button>
        </div>

        {/* Viewport switchers */}
        <div className={`flex items-center ${st.subsurfaceBg} p-1 rounded-xl border ${st.controlBorder}`}>
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              previewMode === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : `${st.muted} hover:${st.textHeading}`
            }`}
            title="Desktop View (Full Width)"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setPreviewMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              previewMode === 'tablet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : `${st.muted} hover:${st.textHeading}`
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              previewMode === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : `${st.muted} hover:${st.textHeading}`
            }`}
            title="Mobile View (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Visual Theme Selector Pills (Website Theme) */}
        <div className={`hidden lg:flex items-center ${st.subsurfaceBg} p-1 rounded-xl border ${st.border}`} title="Generated Landing Page Theme">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${st.muted} px-1.5 hidden xl:inline`}>
            Site:
          </span>
          {Object.entries(THEMES).map(([tKey, tData]) => (
            <button
              key={tKey}
              onClick={() => onSelectTheme(tKey)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                currentTheme === tKey
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : `${st.muted} hover:${st.textHeading}`
              }`}
              title={`Switch landing page to ${tData.name} theme`}
            >
              <span className={`w-2 h-2 rounded-full ${THEME_DOTS[tKey] || 'bg-slate-400'}`} />
              <span className="hidden xl:inline">{tData.name}</span>
            </button>
          ))}
        </div>

        {/* Studio UI Theme Switcher (Dark / Midnight / Light Workspace) */}
        {onSelectStudioTheme && (
          <div className={`flex items-center ${st.subsurfaceBg} p-1 rounded-xl border ${st.border}`} title="Studio Workspace Theme">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1.5 hidden 2xl:inline">
              Studio:
            </span>
            <button
              onClick={() => onSelectStudioTheme('dark')}
              className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                studioTheme === 'dark'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Dark Slate Studio (Default)"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden 2xl:inline">Dark</span>
            </button>
            <button
              onClick={() => onSelectStudioTheme('midnight')}
              className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                studioTheme === 'midnight'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Midnight OLED Studio (Pitch Black)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden 2xl:inline">Midnight</span>
            </button>
            <button
              onClick={() => onSelectStudioTheme('light')}
              className={`p-1.5 rounded-lg text-xs transition flex items-center gap-1 ${
                studioTheme === 'light'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-800'
              }`}
              title="Clean Light Studio"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium hidden 2xl:inline">Light</span>
            </button>
          </div>
        )}
      </div>

      {/* Right: Rectifier Audit Badge & Export Menu */}
      <div className="flex items-center gap-2 relative">
        {onOpenRectifierModal && (
          <button
            onClick={onOpenRectifierModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold shadow-sm transition"
            title="Inspect Autonomous AI Rectifier Agent Quality Audit"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">Rectifier:</span>
            <span className="text-emerald-400 font-bold">{rectifierAudit?.alignmentScore || 98}% Match</span>
          </button>
        )}

        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition active:scale-95 disabled:opacity-50"
            title="Download full project code (React + Vite ZIP or Standalone HTML)"
          >
            <Download className="w-4 h-4" />
            <span>Download Project</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">ZIP</span>
          </button>

          {showExportMenu && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-2xl ${st.panelBg} border ${st.border} shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150`}
              onClick={() => setShowExportMenu(false)}
            >
              <div className={`p-2.5 border-b ${st.borderSubtle} mb-1.5`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${st.textHeading} uppercase tracking-wider block`}>
                    Download Final Project
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold border border-emerald-500/20">
                    Production Ready
                  </span>
                </div>
                <span className={`text-[11px] ${st.muted} mt-0.5 block`}>
                  Fully runnable code bundle with zero vendor lock-in.
                </span>
              </div>

              <button
                onClick={onExportReact}
                className={`w-full text-left p-3 rounded-xl hover:${st.hoverBg} ${st.text} flex items-start gap-3 transition group`}
              >
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 mt-0.5 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <Code className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${st.textHeading}`}>React + Vite App (ZIP)</span>
                    <span className="text-[10px] text-indigo-500 font-semibold">Recommended</span>
                  </div>
                  <div className={`text-[11px] ${st.muted} mt-0.5 leading-snug`}>
                    Complete repository with <strong>README.md</strong>, <code>package.json</code>, Tailwind CSS, and all editable section components.
                  </div>
                  <div className="text-[10px] text-emerald-500 font-medium mt-1">
                    ✓ Run locally with: <code>npm run dev</code>
                  </div>
                </div>
              </button>

              <button
                onClick={onExportHtml}
                className={`w-full text-left p-3 rounded-xl hover:${st.hoverBg} ${st.text} flex items-start gap-3 transition group mt-1`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mt-0.5 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${st.textHeading}`}>Single-File Standalone HTML</span>
                    <span className="text-[10px] text-emerald-500 font-semibold">Zero Install</span>
                  </div>
                  <div className={`text-[11px] ${st.muted} mt-0.5 leading-snug`}>
                    Self-contained single file with Tailwind CSS. Double-click to open in any web browser.
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
