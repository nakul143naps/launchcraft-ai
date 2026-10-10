import React, { useState, useEffect, useCallback } from 'react';
import { TopToolbar } from './components/editor/TopToolbar';
import { HeroPromptStudio } from './components/editor/HeroPromptStudio';
import { PropertiesPanel } from './components/editor/PropertiesPanel';
import { LandingPage } from './renderer/LandingPage';
import { Toast } from './components/ui/Toast';
import { sampleSite } from './data/sampleSite';
import {
  checkBackendHealth,
  enhancePromptApi,
  generatePageApi,
  regenerateSectionApi
} from './services/api';
import { generateReactZip, generateStandaloneHtml } from './services/exportService';
import { AddSectionModal } from './components/editor/AddSectionModal';
import { RectifierModal } from './components/editor/RectifierModal';
import { createDefaultSection } from './utils/sectionDefaults';
import { STUDIO_THEMES, DEFAULT_STUDIO_THEME } from './themes/studioThemes';
import {
  ArrowDown,
  ArrowUp,
  Columns,
  Download,
  Laptop,
  Maximize2,
  Smartphone,
  Tablet,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'launchcraft_draft_v3';

const DEFAULT_PROMPT =
  'Create a high-converting, modern landing page for i want  to create library management system landing page  with features like  differnt kind of books lending prices , books borrowing , books returning etc. Feature an impactful headline with clear conversion hook, 3 key feature pillars with metrics, transparent tiered pricing or membership options, authentic customer review cards with 5-star ratings, and a high-visibility lead capture CTA form with zero friction.';

export default function App() {
  // Website state initialized from localStorage or sampleSite
  const [siteData, setSiteData] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.site && Array.isArray(parsed?.sections)) {
          if (parsed.site.theme === 'bold') {
            parsed.site.theme = 'bright';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not restore draft from localStorage:', e);
    }
    return sampleSite;
  });

  // Undo / Redo history stack
  const [history, setHistory] = useState([siteData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [selectedSectionId, setSelectedSectionId] = useState('hero-1');
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop | tablet | mobile
  const [zoomLevel, setZoomLevel] = useState(75); // 50 (fit whole page overview) | 75 | 100
  const [viewLayout, setViewLayout] = useState('split'); // 'split' | 'preview-only'
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [isRectifierModalOpen, setIsRectifierModalOpen] = useState(false);
  const [studioTheme, setStudioTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('launchcraft_studio_theme');
      if (saved && saved !== 'dark') return saved;
    } catch {}
    return 'light';
  });

  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegeneratingSection, setIsRegeneratingSection] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Studio ready. Enter your prompt above or scroll down to customize!');
  const [backendOnline, setBackendOnline] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Helper to commit new state with undo history
  const commitState = useCallback((newSite, toastMsg = null) => {
    setSiteData(newSite);
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newSite];
    });
    setHistoryIndex((prev) => prev + 1);
    if (toastMsg) showToast(toastMsg);
  }, [historyIndex]);

  // Undo & Redo Handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setSiteData(prev);
      showToast('↩️ Undone last action');
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setSiteData(next);
      showToast('↪️ Redone action');
    }
  }, [historyIndex, history]);

  // Keyboard shortcut for Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Autosave to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(siteData));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [siteData]);

  // Check backend health on start
  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendOnline(health.status === 'ok');
      setIsOfflineMode(!health.gemini_available);
    });
  }, []);

  // Sync Studio UI theme attribute & persistence
  useEffect(() => {
    document.documentElement.setAttribute('data-studio-theme', studioTheme);
    try {
      localStorage.setItem('launchcraft_studio_theme', studioTheme);
    } catch (e) {
      console.warn('Could not save studio theme to localStorage:', e);
    }
  }, [studioTheme]);

  const handleSelectStudioTheme = (themeId) => {
    setStudioTheme(themeId);
    const stConfig = STUDIO_THEMES[themeId] || STUDIO_THEMES.dark;
    showToast(`🖥️ Studio Theme: ${stConfig.name}`);
  };

  const scrollToWorkspace = () => {
    const el = document.getElementById('workspace-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStudio = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateSiteName = (name) => {
    commitState({
      ...siteData,
      site: { ...siteData.site, name }
    });
  };

  const handleSelectTheme = (themeId) => {
    commitState({
      ...siteData,
      site: { ...siteData.site, theme: themeId }
    }, `🎨 Switched to ${themeId.toUpperCase()} theme`);
    setStatusMessage(`Theme changed to "${themeId}".`);
  };

  const handleSelectSection = (id) => {
    setSelectedSectionId(id);
  };

  // Direct On-Canvas Inline Edit Handler
  const handleInlineEdit = (sectionId, field, value) => {
    const updated = {
      ...siteData,
      sections: siteData.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          content: {
            ...s.content,
            [field]: value
          }
        };
      })
    };
    commitState(updated, `✏️ Updated ${field}`);
  };

  const handleUpdateSection = (updatedSection) => {
    const updated = {
      ...siteData,
      sections: siteData.sections.map((s) => (s.id === updatedSection.id ? updatedSection : s))
    };
    commitState(updated, `⚙️ Updated ${updatedSection.type} section`);
  };

  // Quick Variant switcher
  const handleUpdateVariant = (sectionId, newVariant) => {
    const updated = {
      ...siteData,
      sections: siteData.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return { ...s, variant: newVariant };
      })
    };
    commitState(updated, `📐 Layout switched to ${newVariant}`);
  };

  // Section Reordering: Move Up
  const handleMoveUp = (sectionId) => {
    const idx = siteData.sections.findIndex((s) => s.id === sectionId);
    if (idx <= 0) return;
    const newSections = [...siteData.sections];
    const temp = newSections[idx - 1];
    newSections[idx - 1] = newSections[idx];
    newSections[idx] = temp;
    commitState({ ...siteData, sections: newSections }, '⬆️ Moved section up');
  };

  // Section Reordering: Move Down
  const handleMoveDown = (sectionId) => {
    const idx = siteData.sections.findIndex((s) => s.id === sectionId);
    if (idx < 0 || idx >= siteData.sections.length - 1) return;
    const newSections = [...siteData.sections];
    const temp = newSections[idx + 1];
    newSections[idx + 1] = newSections[idx];
    newSections[idx] = temp;
    commitState({ ...siteData, sections: newSections }, '⬇️ Moved section down');
  };

  // Toggle Visibility
  const handleToggleVisibility = (sectionId) => {
    const sec = siteData.sections.find((s) => s.id === sectionId);
    const newVis = sec ? !sec.visible : true;
    const updated = {
      ...siteData,
      sections: siteData.sections.map((s) => {
        if (s.id !== sectionId) return s;
        return { ...s, visible: newVis };
      })
    };
    commitState(updated, newVis ? '👁️ Section visible' : '🙈 Section hidden');
  };

  // Add New Section from Gallery
  const handleAddSection = (type) => {
    const newSec = createDefaultSection(type);
    const updatedSections = [...siteData.sections, newSec];
    commitState({ ...siteData, sections: updatedSections }, `✨ Added ${newSec.customLabel || type} section!`);
    setSelectedSectionId(newSec.id);
    setIsAddSectionModalOpen(false);
  };

  // Duplicate Section
  const handleDuplicateSection = (sectionId) => {
    const idx = siteData.sections.findIndex((s) => s.id === sectionId);
    if (idx < 0) return;
    const target = siteData.sections[idx];
    const cloneId = `${target.type}-${Date.now().toString().slice(-4)}`;
    const cloned = {
      ...JSON.parse(JSON.stringify(target)),
      id: cloneId,
      customLabel: `${target.customLabel || target.type} (Copy)`
    };
    const newSections = [...siteData.sections];
    newSections.splice(idx + 1, 0, cloned);
    commitState({ ...siteData, sections: newSections }, `📋 Duplicated ${target.customLabel || target.type}!`);
    setSelectedSectionId(cloneId);
  };

  // Delete Section
  const handleDeleteSection = (sectionId) => {
    if (siteData.sections.length <= 1) {
      showToast('⚠️ Cannot delete the only remaining section');
      return;
    }
    const idx = siteData.sections.findIndex((s) => s.id === sectionId);
    if (idx < 0) return;
    const deleted = siteData.sections[idx];
    const remaining = siteData.sections.filter((s) => s.id !== sectionId);
    const nextSelected = remaining[Math.min(idx, remaining.length - 1)]?.id || null;
    commitState({ ...siteData, sections: remaining }, `🗑️ Deleted ${deleted.customLabel || deleted.type}`);
    setSelectedSectionId(nextSelected);
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    setStatusMessage('Analyzing concept & optimizing conversion structure...');
    try {
      const res = await enhancePromptApi(prompt);
      if (res?.enhancedPrompt) {
        setEnhancedPrompt(res.enhancedPrompt);
        setStatusMessage('Brief enhanced! Click "Generate Landing Page" to apply.');
        showToast('✨ Brief enhanced with conversion pillars!');
      }
    } catch (err) {
      setStatusMessage('Enhancement fallback used.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerateSite = async () => {
    const promptToUse = enhancedPrompt?.trim() || prompt?.trim();
    if (!promptToUse) return;

    setIsGenerating(true);
    setStatusMessage('Synthesizing structured landing page...');
    try {
      const generated = await generatePageApi(promptToUse, siteData.site?.theme || 'bright');
      if (generated?.site && Array.isArray(generated?.sections)) {
        commitState(generated, `🎉 Generated "${generated.site.name}"!`);
        setSelectedSectionId(generated.sections[0]?.id || null);
        setStatusMessage(`Successfully generated "${generated.site.name}"! Scroll down to explore.`);
        showToast(`🎉 Generated "${generated.site.name}"!`);

        // Smooth scroll down to the workspace preview and editor
        setTimeout(() => {
          scrollToWorkspace();
        }, 350);
      }
    } catch (err) {
      setStatusMessage('Generation failed. Kept existing layout.');
      showToast('❌ Generation error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSection = async (sectionId, instruction) => {
    setIsRegeneratingSection(true);
    setStatusMessage(`Rewriting section (${sectionId}) with AI...`);
    try {
      const updatedSection = await regenerateSectionApi(siteData, sectionId, instruction);
      if (updatedSection) {
        handleUpdateSection(updatedSection);
        setStatusMessage('Section rewritten successfully!');
        showToast(`✨ Rewrote ${updatedSection.type} section`);
      }
    } catch (err) {
      setStatusMessage('Section rewrite failed.');
    } finally {
      setIsRegeneratingSection(false);
    }
  };

  const handleExportReact = async () => {
    setIsExporting(true);
    setStatusMessage('Packaging runnable React + Vite project ZIP...');
    try {
      await generateReactZip(siteData);
      setStatusMessage('React + Vite project downloaded! Unzip and run "npm install && npm run dev".');
      showToast('📦 Downloaded React + Vite project ZIP!');
    } catch (err) {
      console.error(err);
      setStatusMessage('Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportHtml = () => {
    setIsExporting(true);
    setStatusMessage('Building Standalone HTML page...');
    try {
      generateStandaloneHtml(siteData);
      setStatusMessage('Standalone HTML file downloaded! Double-click to open in any browser.');
      showToast('📄 Downloaded standalone HTML file!');
    } catch (err) {
      console.error(err);
      setStatusMessage('HTML export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  const selectedSection = siteData.sections?.find((s) => s.id === selectedSectionId) || siteData.sections?.[0] || null;
  const st = STUDIO_THEMES[studioTheme] || STUDIO_THEMES.dark;

  return (
    <div
      data-studio-theme={studioTheme}
      className={`min-h-screen w-full ${st.bg} ${st.text} flex flex-col font-sans transition-colors duration-300 selection:bg-indigo-500 selection:text-white`}
    >
      {/* Sticky Top Toolbar with Undo/Redo & Quick Actions */}
      <TopToolbar
        siteName={siteData.site?.name || 'My Project'}
        onUpdateSiteName={handleUpdateSiteName}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        currentTheme={siteData.site?.theme || 'bold'}
        onSelectTheme={handleSelectTheme}
        onExportReact={handleExportReact}
        onExportHtml={handleExportHtml}
        isExporting={isExporting}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onScrollToStudio={scrollToStudio}
        onScrollToWorkspace={scrollToWorkspace}
        rectifierAudit={siteData.site?.rectifierAudit}
        onOpenRectifierModal={() => setIsRectifierModalOpen(true)}
        studioTheme={studioTheme}
        onSelectStudioTheme={handleSelectStudioTheme}
      />

      {/* 1. Beginning Center of Screen: AI Prompt Studio */}
      <HeroPromptStudio
        prompt={prompt}
        setPrompt={setPrompt}
        enhancedPrompt={enhancedPrompt}
        setEnhancedPrompt={setEnhancedPrompt}
        onEnhancePrompt={handleEnhancePrompt}
        onGenerateSite={handleGenerateSite}
        isEnhancing={isEnhancing}
        isGenerating={isGenerating}
        statusMessage={statusMessage}
        isOfflineMode={isOfflineMode}
        backendOnline={backendOnline}
        currentTheme={siteData.site?.theme || 'bold'}
        onSelectTheme={handleSelectTheme}
        onScrollToWorkspace={scrollToWorkspace}
        studioTheme={studioTheme}
      />

      {/* 2. Scroll Down: Dual-Pane Workspace (Half-page Preview & Half-page Editor) */}
      <section id="workspace-anchor" className={`w-full border-t ${st.border} ${st.bg} py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300`}>
        <div className="max-w-[1700px] mx-auto">
          {/* Workspace Title & Viewport Controls Header */}
          <div className={`flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-4 border-b ${st.borderSubtle}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h2 className={`text-xl sm:text-2xl font-bold ${st.textHeading} tracking-tight`}>
                  {viewLayout === 'split' ? 'Dual-Pane Live Studio' : 'Full Preview Canvas'}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${st.accentTag}`}>
                  {viewLayout === 'split' ? 'Half Preview • Half Editor' : 'Expanded Full Overview'}
                </span>
              </div>
              <p className={`text-xs sm:text-sm ${st.muted} mt-1`}>
                {viewLayout === 'split'
                  ? 'Click any text on the preview to edit inline, adjust zoom to see the complete page, or use the editor on the right.'
                  : 'Viewing the full website preview across the entire viewport. Click any section to customize.'}
              </p>
            </div>

            {/* Viewport, Zoom, Layout toggles & Back to top button */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Zoom Controls: Fit whole page vs 75% vs 100% */}
              <div className={`flex items-center ${st.controlBg} p-1 rounded-xl border ${st.controlBorder} text-xs`}>
                <button
                  onClick={() => setZoomLevel(50)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                    zoomLevel === 50 ? 'bg-indigo-600 text-white shadow-sm' : `${st.muted} hover:${st.textHeading}`
                  }`}
                  title="Fit complete landing page on one screen (50% scale overview)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                  <span>Whole Page (50%)</span>
                </button>
                <button
                  onClick={() => setZoomLevel(75)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                    zoomLevel === 75 ? 'bg-indigo-600 text-white shadow-sm' : `${st.muted} hover:${st.textHeading}`
                  }`}
                  title="Comfortable 75% view"
                >
                  75%
                </button>
                <button
                  onClick={() => setZoomLevel(100)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
                    zoomLevel === 100 ? 'bg-indigo-600 text-white shadow-sm' : `${st.muted} hover:${st.textHeading}`
                  }`}
                  title="100% full scale"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>100%</span>
                </button>
              </div>

              {/* View Layout Toggle: Split vs Preview Only */}
              <div className={`flex items-center ${st.controlBg} p-1 rounded-xl border ${st.controlBorder} text-xs`}>
                <button
                  onClick={() => setViewLayout('split')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    viewLayout === 'split' ? 'bg-indigo-600 text-white shadow-sm' : `${st.muted} hover:${st.textHeading}`
                  }`}
                  title="Split View (Preview + Properties Panel)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Split</span>
                </button>
                <button
                  onClick={() => setViewLayout('preview-only')}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                    viewLayout === 'preview-only' ? 'bg-indigo-600 text-white shadow-sm' : `${st.muted} hover:${st.textHeading}`
                  }`}
                  title="Expanded Full Preview (Hide Editor Panel)"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Preview</span>
                </button>
              </div>

              {/* Device Viewport Buttons */}
              <div className={`flex items-center ${st.controlBg} p-1 rounded-xl border ${st.controlBorder}`}>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewMode === 'desktop' ? 'bg-indigo-600 text-white' : `${st.muted} hover:${st.textHeading}`
                  }`}
                  title="Desktop View"
                >
                  <Laptop className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewMode === 'tablet' ? 'bg-indigo-600 text-white' : `${st.muted} hover:${st.textHeading}`
                  }`}
                  title="Tablet View (768px)"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewMode === 'mobile' ? 'bg-indigo-600 text-white' : `${st.muted} hover:${st.textHeading}`
                  }`}
                  title="Mobile View (390px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={scrollToStudio}
                className={`px-3 py-1.5 rounded-xl ${st.controlBg} hover:${st.hoverBg} ${st.muted} hover:${st.textHeading} border ${st.controlBorder} text-xs font-semibold transition flex items-center gap-1.5`}
                title="Scroll back up to prompt studio"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Prompt Top</span>
              </button>
            </div>
          </div>

          {/* Dual-Pane Grid or Full-Width Preview */}
          <div className={viewLayout === 'split' ? 'grid grid-cols-1 xl:grid-cols-2 gap-8 items-start' : 'w-full'}>
            {/* Live Interactive Preview Canvas */}
            <div className={`flex flex-col w-full ${st.panelBg} border ${st.border} rounded-3xl shadow-xl overflow-hidden ${viewLayout === 'split' ? 'h-[84vh] xl:sticky xl:top-20' : 'h-[88vh]'}`}>
              <div className={`p-3.5 border-b ${st.borderSubtle} ${st.subsurfaceBg} flex items-center justify-between shrink-0`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className={`text-xs font-bold uppercase tracking-wider ${st.textHeading}`}>
                    Live Preview Canvas
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.accentTag}`}>
                    Zoom: {zoomLevel}% {zoomLevel === 50 ? '(Whole Page Fit)' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportReact}
                    disabled={isExporting}
                    className="px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                    title="Download complete runnable React + Vite project ZIP with README and all components"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Project (ZIP)</span>
                  </button>
                  {viewLayout === 'preview-only' && (
                    <button
                      onClick={() => setViewLayout('split')}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1"
                    >
                      <Columns className="w-3.5 h-3.5" />
                      <span>Open Section Editor</span>
                    </button>
                  )}
                  <span className={`text-[11px] font-mono ${st.muted} hidden sm:inline`}>
                    ✏️ Click any text to edit directly
                  </span>
                </div>
              </div>

              {/* Scrollable Viewport Canvas with Dynamic Zoom Scaling */}
              <div className={`flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 ${st.canvasBg} flex justify-center items-start`}>
                <div
                  style={
                    zoomLevel < 100
                      ? {
                          transform: `scale(${zoomLevel / 100})`,
                          transformOrigin: 'top center',
                          width: `${(100 / zoomLevel) * 100}%`,
                          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), width 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }
                      : { width: '100%', transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), width 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }
                  }
                  className={`transition-all duration-300 ${
                    previewMode === 'mobile'
                      ? 'max-w-[390px] mx-auto bg-black border-[10px] border-slate-800 rounded-[44px] shadow-2xl overflow-hidden ring-1 ring-slate-700/50 my-2'
                      : previewMode === 'tablet'
                      ? `max-w-[768px] mx-auto shadow-2xl rounded-2xl overflow-hidden border ${st.border} my-2`
                      : `w-full shadow-2xl rounded-2xl overflow-hidden border ${st.border}`
                  }`}
                >
                  {previewMode === 'mobile' && (
                    <div className="w-full bg-slate-900/90 py-2.5 flex items-center justify-center border-b border-slate-800">
                      <div className="w-24 h-3.5 bg-slate-800 rounded-full" />
                    </div>
                  )}

                  <LandingPage
                    siteData={siteData}
                    selectedSectionId={selectedSectionId}
                    onSelectSection={handleSelectSection}
                    onInlineEdit={handleInlineEdit}
                    onUpdateVariant={handleUpdateVariant}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onToggleVisibility={handleToggleVisibility}
                    onOpenAiRewrite={(secId, instr) => handleRegenerateSection(secId, instr)}
                  />
                </div>
              </div>
            </div>

            {/* Right Half: Live Section Inspector & Properties Editor (Shown in Split Mode) */}
            {viewLayout === 'split' && (
              <div className={`w-full h-[84vh] flex flex-col ${st.panelBg} border ${st.border} rounded-3xl shadow-xl overflow-hidden xl:sticky xl:top-20 properties-panel-container`}>
                <PropertiesPanel
                  section={selectedSection}
                  sections={siteData.sections}
                  onSelectSection={handleSelectSection}
                  onUpdateSection={handleUpdateSection}
                  onClose={() => setSelectedSectionId(null)}
                  onRegenerateSection={handleRegenerateSection}
                  isRegeneratingSection={isRegeneratingSection}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onDuplicateSection={handleDuplicateSection}
                  onDeleteSection={handleDeleteSection}
                  onOpenAddSectionModal={() => setIsAddSectionModalOpen(true)}
                  studioTheme={studioTheme}
                  className="w-full h-full border-0 bg-transparent rounded-none"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Quick Action & Jump Pill Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={handleExportReact}
          disabled={isExporting}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-2xl backdrop-blur-md transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          title="Download runnable React + Vite project ZIP with all files and README"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Project (ZIP)</span>
        </button>
        <button
          onClick={scrollToStudio}
          className={`px-3.5 py-2 rounded-full ${st.cardBg} hover:${st.hoverBg} ${st.text} border ${st.border} text-xs font-semibold shadow-2xl backdrop-blur-md transition flex items-center gap-1.5`}
          title="Scroll up to Prompt Studio"
        >
          <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
          <span>Prompt Top</span>
        </button>
        <button
          onClick={scrollToWorkspace}
          className="px-3.5 py-2 rounded-full bg-indigo-600/95 hover:bg-indigo-500 text-white border border-indigo-400/40 text-xs font-semibold shadow-2xl backdrop-blur-md transition flex items-center gap-1.5"
          title="Scroll down to Live Preview & Editor"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>Live Studio</span>
        </button>
      </div>

      {/* Footer Info */}
      <footer className={`border-t ${st.border} ${st.subsurfaceBg} py-6 px-4 text-center text-xs ${st.muted}`}>
        LaunchCraft AI • Prompt to Data, Not Brittle Code • Fully editable responsive web architecture
      </footer>

      {/* Add New Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAddSection={handleAddSection}
        studioTheme={studioTheme}
      />

      {/* Autonomous Rectifier Quality Inspector Modal */}
      <RectifierModal
        isOpen={isRectifierModalOpen}
        onClose={() => setIsRectifierModalOpen(false)}
        audit={siteData.site?.rectifierAudit}
        prompt={enhancedPrompt || prompt}
        studioTheme={studioTheme}
      />

      {/* Real-time Toast Feedback Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
