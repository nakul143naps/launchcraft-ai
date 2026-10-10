import { sampleSite } from '../data/sampleSite';

const rawBase = (import.meta.env.VITE_API_BASE || '').trim().replace(/\/$/, '');
const API_BASE = rawBase ? (rawBase.endsWith('/api') ? rawBase : `${rawBase}/api`) : '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Backend responded with error');
    return await res.json();
  } catch (err) {
    return { status: 'offline', offlineMode: true, geminiAvailable: false };
  }
}

export async function enhancePromptApi(prompt) {
  try {
    const res = await fetch(`${API_BASE}/enhance-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error(`API failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side enhancement fallback:', err);
    // Graceful offline enhancement fallback
    return {
      enhancedPrompt: `Create a conversion-optimized, professional landing page for "${prompt}". Include an attention-grabbing hero section, a 3-column feature showcase with performance metrics, clear membership or pricing tiers, authentic testimonial cards with 5-star social proof, and a high-converting email capture CTA. Use a modern, responsive layout with high-contrast typography.`
    };
  }
}

export async function generatePageApi(prompt, theme = 'bold') {
  try {
    const res = await fetch(`${API_BASE}/generate-page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, theme }),
    });
    if (!res.ok) throw new Error(`API failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side generator fallback:', err);
    // Create intelligent customized fallback based on the user's prompt
    const customSite = JSON.parse(JSON.stringify(sampleSite));
    customSite.site.theme = theme;
    
    // Custom name from prompt if detected
    const titleMatch = prompt.match(/(?:for|called|named)\s+([A-Z][a-zA-Z0-9\s]+?)(?:,|\.|\s+with|\s+a|\s+and|$)/i);
    if (titleMatch && titleMatch[1]) {
      customSite.site.name = titleMatch[1].trim();
    } else if (prompt.toLowerCase().includes('cloud') || prompt.toLowerCase().includes('saas')) {
      customSite.site.name = 'CloudPulse AI';
      customSite.site.description = 'Autonomous cloud infrastructure optimization and cost reduction.';
    } else if (prompt.toLowerCase().includes('restaurant') || prompt.toLowerCase().includes('pasta')) {
      customSite.site.name = 'Bella Tavola';
      customSite.site.description = 'Artisan wood-fired Italian trattoria with handmade pasta.';
    } else if (prompt.toLowerCase().includes('dev') || prompt.toLowerCase().includes('portfolio')) {
      customSite.site.name = 'Alex Rivera';
      customSite.site.description = 'Senior Distributed Systems Engineer & Open Source Architect.';
    }

    return customSite;
  }
}

export async function regenerateSectionApi(currentSite, sectionId, instruction) {
  try {
    const res = await fetch(`${API_BASE}/regenerate-section`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site: currentSite, sectionId, instruction }),
    });
    if (!res.ok) throw new Error(`API failed: ${res.statusText}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client-side section regeneration fallback:', err);
    // Find target section
    const sec = currentSite.sections.find(s => s.id === sectionId);
    if (!sec) return sec;

    const cloned = JSON.parse(JSON.stringify(sec));
    if (cloned.type === 'hero') {
      cloned.content.headline = `Reimagined: ${cloned.content.headline}`;
      cloned.content.subtitle = `Refined with: "${instruction}". Optimized for maximum conversion and reader engagement.`;
    } else if (cloned.type === 'features') {
      cloned.content.title = `Upgraded Features: ${cloned.content.title}`;
    } else if (cloned.type === 'pricing') {
      cloned.content.title = `Special Offer Plans (${instruction})`;
    } else if (cloned.type === 'testimonials') {
      cloned.content.title = `Verified Success Stories`;
    } else if (cloned.type === 'contact') {
      cloned.content.headline = `Let's Connect — ${instruction}`;
    }
    return cloned;
  }
}
