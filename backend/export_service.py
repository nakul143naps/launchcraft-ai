import io
import json
import zipfile
from typing import Dict, Any

def create_react_zip_buffer(site_data: Dict[str, Any]) -> io.BytesIO:
    """Builds a completely runnable React + Vite project in a memory ZIP buffer with all section renderers."""
    buf = io.BytesIO()
    site = site_data.get("site", {})
    project_slug = (site.get("name") or "launchcraft-site").lower().replace(" ", "-")

    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        # package.json
        pkg = {
            "name": project_slug,
            "private": True,
            "version": "1.0.0",
            "type": "module",
            "scripts": {
                "dev": "vite",
                "build": "vite build",
                "preview": "vite preview"
            },
            "dependencies": {
                "react": "^19.0.0",
                "react-dom": "^19.0.0",
                "lucide-react": "^1.54.0"
            },
            "devDependencies": {
                "@vitejs/plugin-react": "^6.1.1",
                "@tailwindcss/vite": "^4.0.0",
                "tailwindcss": "^4.0.0",
                "vite": "^8.3.0"
            }
        }
        zf.writestr(f"{project_slug}/package.json", json.dumps(pkg, indent=2))

        # vite.config.js
        zf.writestr(f"{project_slug}/vite.config.js", """import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
""")

        # index.html
        zf.writestr(f"{project_slug}/index.html", f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{site.get('name', 'Exported Website')}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
""")

        # .gitignore & README
        zf.writestr(f"{project_slug}/.gitignore", "node_modules/\ndist/\n.DS_Store\n")
        zf.writestr(f"{project_slug}/README.md", f"""# {site.get('name', 'LaunchCraft Website')}

> **{site.get('tagline', 'Modern High-Converting Website')}**  
> {site.get('description', 'Built with LaunchCraft AI — Prompt to Data, Not Brittle Code.')}

---

## 🚀 Quick Start (Run Locally in 60 Seconds)

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed on your computer.

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. Live changes will update immediately via Vite Hot Module Replacement (HMR).

### 3. Build for Production Deployment
```bash
npm run build
```
The compiled production bundle will be output to the `dist/` directory, ready to deploy.

---

## 📁 Project Architecture & Directory Layout

```
{project_slug}/
├── README.md                 # Project documentation & quickstart guide
├── package.json              # Dependencies (React 19, Tailwind CSS, Lucide React, Vite)
├── vite.config.js            # Vite build configuration with Tailwind plugin
├── index.html                # HTML entry point with Plus Jakarta Sans & Inter fonts
├── .gitignore                # Standard git exclusions (node_modules, dist)
└── src/
    ├── main.jsx              # React DOM root entry
    ├── App.jsx               # Root application component
    ├── index.css             # Tailwind CSS styles & reset
    ├── data/
    │   └── site.json         # All website content, copy, metrics, and section config
    ├── themes/
    │   └── themes.js         # Color palettes (Bright Radiant, Sunny Amber, Fresh, etc.)
    ├── components/
    │   ├── Navbar.jsx        # Navigation header with mobile support & brand icon
    │   ├── Footer.jsx        # Footer with links, copyright, and brand tagline
    │   └── IconRenderer.jsx  # Dynamic Lucide icon renderer
    ├── sections/             # Modular section components
    │   ├── HeroSection.jsx
    │   ├── StatsSection.jsx
    │   ├── FeaturesSection.jsx
    │   ├── ShowcaseSection.jsx
    │   ├── HowItWorksSection.jsx
    │   ├── PricingSection.jsx
    │   ├── TestimonialsSection.jsx
    │   ├── FaqSection.jsx
    │   └── ContactSection.jsx
    └── renderer/
        └── LandingPage.jsx   # Master page renderer that composes all sections
```

---

## 🎨 How to Customize Your Website

### Option A: Edit Website Content Without Touching Code
Open `src/data/site.json`. All headlines, text descriptions, metrics, pricing tiers, FAQs, and testimonials are stored as standard JSON. Modify any text or values, save the file, and your website updates instantly!

### Option B: Change Theme & Colors
In `src/data/site.json`, change the `theme` property to any of the 7 built-in design themes:
- `"bright"` — Bright Radiant (Clean light slate & indigo)
- `"sunny"` — Sunny Amber (Warm ivory & golden amber)
- `"fresh"` — Fresh Emerald (Organic mint & sage)
- `"minimal"` — Minimal (Monochrome high-contrast zinc)
- `"bold"` — Bold Navy (Dark slate & electric indigo)
- `"cyber"` — Cyber Neon (Pitch-black with cyan glow)
- `"sunset"` — Sunset Rose (Dark crimson & rose)

---

## ⚡ Tech Stack
- **Framework**: [React 19](https://react.dev/)
- **Bundler**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Generator**: [LaunchCraft AI](https://github.com/)
""")

        # src/data/site.json
        zf.writestr(f"{project_slug}/src/data/site.json", json.dumps(site_data, indent=2))

        # src/index.css
        zf.writestr(f"{project_slug}/src/index.css", """@import "tailwindcss";

@layer base {
  * {
    box-sizing: border-box;
  }
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
}
""")

        # src/main.jsx
        zf.writestr(f"{project_slug}/src/main.jsx", """import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
""")

        # src/themes/themes.js
        zf.writestr(f"{project_slug}/src/themes/themes.js", """export const THEMES = {
  fresh: {
    id: 'fresh',
    name: 'Fresh',
    bg: 'bg-[#faf8f5]',
    text: 'text-[#1c2826]',
    muted: 'text-[#536b63]',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition',
    secondaryBtn: 'bg-[#e7f3ec] hover:bg-[#d4e9dd] text-[#0c4e3a] border border-[#a6d8c0] font-medium transition',
    card: 'bg-white border border-[#e2ece5] shadow-sm rounded-2xl',
    border: 'border-[#e2ece5]',
    accentTag: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    highlightPlan: 'ring-2 ring-emerald-500 shadow-lg',
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    bg: 'bg-[#ffffff]',
    text: 'text-[#09090b]',
    muted: 'text-[#71717a]',
    primaryBtn: 'bg-zinc-900 hover:bg-black text-white font-medium shadow-none transition',
    secondaryBtn: 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 font-medium transition',
    card: 'bg-[#fafafa] border border-zinc-200 shadow-none rounded-xl',
    border: 'border-zinc-200',
    accentTag: 'bg-zinc-100 text-zinc-700 border border-zinc-200',
    highlightPlan: 'ring-2 ring-zinc-900 shadow-md',
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    bg: 'bg-[#0b0f19]',
    text: 'text-[#f8fafc]',
    muted: 'text-[#94a3b8]',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition',
    secondaryBtn: 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium transition',
    card: 'bg-[#111827] border border-slate-800/80 shadow-md rounded-2xl',
    border: 'border-slate-800',
    accentTag: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    highlightPlan: 'ring-2 ring-indigo-500 shadow-xl shadow-indigo-500/10',
  },
};
export const DEFAULT_THEME = 'bold';
""")

        # src/components/IconRenderer.jsx
        zf.writestr(f"{project_slug}/src/components/IconRenderer.jsx", """import React from 'react';
import {
  Activity, ArrowRight, Award, BarChart3, Calendar, Check,
  Clock, Code2, Cpu, Dumbbell, Flame, Heart, Layers, Layout,
  Lock, Mail, MapPin, MessageSquare, Phone, Rocket,
  Shield, Sparkles, Star, Target, TrendingUp, Users, Zap
} from 'lucide-react';

const ICON_MAP = {
  dumbbell: Dumbbell, activity: Activity, sparkles: Sparkles, zap: Zap,
  shield: Shield, target: Target, rocket: Rocket, chart: BarChart3,
  calendar: Calendar, clock: Clock, users: Users, heart: Heart,
  award: Award, trendingup: TrendingUp, lock: Lock, mail: Mail,
  phone: Phone, mappin: MapPin, code: Code2, cpu: Cpu, flame: Flame,
  layers: Layers, layout: Layout, messagesquare: MessageSquare,
  star: Star, check: Check,
};

export function IconRenderer({ name, className = 'w-6 h-6' }) {
  if (!name) return <Sparkles className={className} />;
  const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const Component = ICON_MAP[normalized] || Sparkles;
  return <Component className={className} />;
}
""")

        # src/components/Navbar.jsx
        zf.writestr(f"{project_slug}/src/components/Navbar.jsx", """import React from 'react';
import { ArrowRight } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function Navbar({ siteName, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  return (
    <header className={`w-full border-b ${currentTheme.border} ${currentTheme.bg} sticky top-0 z-30 transition-colors backdrop-blur-md bg-opacity-95`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${currentTheme.primaryBtn} flex items-center justify-center font-bold text-lg`}>
            {siteName ? siteName.charAt(0).toUpperCase() : 'L'}
          </div>
          <span className={`text-xl font-bold tracking-tight ${currentTheme.text}`}>
            {siteName || 'LaunchCraft'}
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className={`${currentTheme.muted} hover:${currentTheme.text} transition`}>Features</a>
          <a href="#pricing" className={`${currentTheme.muted} hover:${currentTheme.text} transition`}>Pricing</a>
          <a href="#testimonials" className={`${currentTheme.muted} hover:${currentTheme.text} transition`}>Testimonials</a>
          <a href="#contact" className={`${currentTheme.muted} hover:${currentTheme.text} transition`}>Contact</a>
        </nav>
        <a href="#contact" className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${currentTheme.primaryBtn}`}>
          Get Started <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
""")

        # src/components/Footer.jsx
        zf.writestr(f"{project_slug}/src/components/Footer.jsx", """import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function Footer({ siteName, description, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  return (
    <footer className={`w-full border-t ${currentTheme.border} ${currentTheme.bg} py-14`}>
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className={`text-lg font-bold tracking-tight ${currentTheme.text}`}>
            {siteName || 'LaunchCraft'}
          </span>
          {description && <p className={`text-sm ${currentTheme.muted} max-w-sm mt-1`}>{description}</p>}
        </div>
        <div className={`text-xs ${currentTheme.muted}`}>
          &copy; {new Date().getFullYear()} {siteName || 'LaunchCraft'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
""")

        # src/sections/HeroSection.jsx
        zf.writestr(f"{project_slug}/src/sections/HeroSection.jsx", """import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function HeroSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {}, variant = 'split' } = section;
  const { headline, subtitle, primaryCta, secondaryCta, imageUrl, badge } = content;

  return (
    <section id="hero" className="relative w-full py-20 lg:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {variant === 'centered' && (
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {badge && <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase mb-6 ${currentTheme.accentTag}`}><Sparkles className="w-3.5 h-3.5" />{badge}</div>}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 ${currentTheme.text}`}>{headline}</h1>
            <p className={`text-lg sm:text-xl ${currentTheme.muted} mb-10 max-w-2xl`}>{subtitle}</p>
            <div className="flex gap-4">
              {primaryCta && <a href="#contact" className={`px-8 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 ${currentTheme.primaryBtn}`}>{primaryCta} <ArrowRight className="w-4 h-4" /></a>}
              {secondaryCta && <a href="#features" className={`px-7 py-3.5 rounded-xl text-base font-semibold ${currentTheme.secondaryBtn}`}>{secondaryCta}</a>}
            </div>
            {imageUrl && <img src={imageUrl} alt={headline} className="mt-14 w-full rounded-2xl shadow-2xl object-cover max-h-[460px]" />}
          </div>
        )}
        {variant === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              {badge && <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase mb-6 ${currentTheme.accentTag}`}><Sparkles className="w-3.5 h-3.5" />{badge}</div>}
              <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 ${currentTheme.text}`}>{headline}</h1>
              <p className={`text-lg sm:text-xl ${currentTheme.muted} mb-8 max-w-xl`}>{subtitle}</p>
              <div className="flex gap-4">
                {primaryCta && <a href="#contact" className={`px-7 py-3.5 rounded-xl text-base font-semibold flex items-center gap-2 ${currentTheme.primaryBtn}`}>{primaryCta} <ArrowRight className="w-4 h-4" /></a>}
                {secondaryCta && <a href="#features" className={`px-6 py-3.5 rounded-xl text-base font-semibold ${currentTheme.secondaryBtn}`}>{secondaryCta}</a>}
              </div>
            </div>
            <div className="lg:col-span-5">
              <img src={imageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80'} alt={headline} className="w-full h-80 sm:h-96 rounded-3xl object-cover shadow-2xl" />
            </div>
          </div>
        )}
        {variant === 'image-background' && (
          <div className="relative rounded-3xl overflow-hidden py-24 px-8 text-center">
            {imageUrl && <img src={imageUrl} alt={headline} className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-slate-950/85" />
            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-white">
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">{headline}</h1>
              <p className="text-lg sm:text-xl text-slate-200 mb-8">{subtitle}</p>
              <div className="flex gap-4">
                {primaryCta && <a href="#contact" className={`px-7 py-3.5 rounded-xl text-base font-semibold ${currentTheme.primaryBtn}`}>{primaryCta}</a>}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
""")

        # src/sections/FeaturesSection.jsx
        zf.writestr(f"{project_slug}/src/sections/FeaturesSection.jsx", """import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';
import { IconRenderer } from '../components/IconRenderer';

export function FeaturesSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {}, variant = 'three-column' } = section;
  const { badge, title, description, items = [] } = content;

  return (
    <section id="features" className="relative w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4 ${currentTheme.accentTag}`}>{badge}</div>}
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${currentTheme.text}`}>{title}</h2>
          <p className={`text-base sm:text-lg ${currentTheme.muted}`}>{description}</p>
        </div>
        <div className={variant === 'four-column' ? 'grid grid-cols-1 md:grid-cols-4 gap-6' : 'grid grid-cols-1 md:grid-cols-3 gap-8'}>
          {items.map((item, idx) => (
            <div key={idx} className={`p-8 ${currentTheme.card} transition hover:-translate-y-1`}>
              <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center ${currentTheme.accentTag}`}>
                <IconRenderer name={item.icon} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${currentTheme.text}`}>{item.title}</h3>
              <p className={`text-sm ${currentTheme.muted}`}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
""")

        # src/sections/PricingSection.jsx
        zf.writestr(f"{project_slug}/src/sections/PricingSection.jsx", """import React from 'react';
import { Check, Star } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function PricingSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {}, variant = 'highlighted-middle' } = section;
  const { badge, title, description, plans = [] } = content;

  return (
    <section id="pricing" className="relative w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4 ${currentTheme.accentTag}`}>{badge}</div>}
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${currentTheme.text}`}>{title}</h2>
          <p className={`text-base sm:text-lg ${currentTheme.muted}`}>{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, idx) => {
            const isMiddle = variant === 'highlighted-middle' ? (plan.highlighted ?? idx === 1) : plan.highlighted;
            return (
              <div key={idx} className={`p-8 ${currentTheme.card} flex flex-col justify-between ${isMiddle ? currentTheme.highlightPlan : ''}`}>
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${currentTheme.text}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-4xl font-extrabold ${currentTheme.text}`}>{plan.price}</span>
                    <span className={`text-sm ${currentTheme.muted}`}>{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {(plan.features || []).map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className={currentTheme.muted}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a href="#contact" className={`w-full py-3.5 rounded-xl text-center text-sm font-semibold ${isMiddle ? currentTheme.primaryBtn : currentTheme.secondaryBtn}`}>
                  {plan.cta || 'Get Started'}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
""")

        # src/sections/TestimonialsSection.jsx
        zf.writestr(f"{project_slug}/src/sections/TestimonialsSection.jsx", """import React from 'react';
import { Star } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function TestimonialsSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {} } = section;
  const { badge, title, description, testimonials = [] } = content;

  return (
    <section id="testimonials" className="relative w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-4 ${currentTheme.accentTag}`}>{badge}</div>}
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${currentTheme.text}`}>{title}</h2>
          <p className={`text-base sm:text-lg ${currentTheme.muted}`}>{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className={`p-8 ${currentTheme.card} flex flex-col justify-between`}>
              <p className={`text-base ${currentTheme.text} italic mb-6`}>"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className={`font-bold text-sm ${currentTheme.text}`}>{t.name}</h4>
                  <p className={`text-xs ${currentTheme.muted}`}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
""")

        # src/sections/ContactSection.jsx
        zf.writestr(f"{project_slug}/src/sections/ContactSection.jsx", """import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function ContactSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {} } = section;
  const { badge, headline, subtitle, buttonText = 'Get Started', emailPlaceholder = 'Enter your email' } = content;
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" className="relative w-full py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {badge && <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase mb-6 ${currentTheme.accentTag}`}>{badge}</div>}
        <h2 className={`text-3xl sm:text-5xl font-extrabold mb-6 ${currentTheme.text}`}>{headline}</h2>
        <p className={`text-base sm:text-lg ${currentTheme.muted} mb-10 max-w-xl mx-auto`}>{subtitle}</p>
        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-400 font-medium text-sm">Thank you! We will get back to you shortly.</div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder={emailPlaceholder} required className={`flex-1 px-4 py-3 rounded-xl text-sm border ${currentTheme.border} ${currentTheme.card}`} />
            <button type="submit" className={`px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${currentTheme.primaryBtn}`}>
              {buttonText} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
""")

        # src/sections/StatsSection.jsx
        zf.writestr(f"{project_slug}/src/sections/StatsSection.jsx", """import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function StatsSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {} } = section;
  const { badge, title, description, metrics = [] } = content;

  return (
    <section id="stats" className="relative w-full py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {(title || badge) && (
          <div className="text-center max-w-3xl mx-auto mb-12">
            {badge && <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${currentTheme.accentTag}`}>{badge}</span>}
            {title && <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 ${currentTheme.text}`}>{title}</h2>}
            {description && <p className={`text-sm sm:text-base max-w-2xl mx-auto ${currentTheme.muted}`}>{description}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border flex flex-col justify-between ${currentTheme.card} ${currentTheme.border}`}>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-indigo-400">{m.value}</div>
              <h3 className={`text-base font-bold mb-1 ${currentTheme.text}`}>{m.label}</h3>
              {m.description && <p className={`text-xs ${currentTheme.muted}`}>{m.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
""")

        # src/sections/ShowcaseSection.jsx
        zf.writestr(f"{project_slug}/src/sections/ShowcaseSection.jsx", """import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function ShowcaseSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {} } = section;
  const { badge, title, description, items = [] } = content;

  return (
    <section id="showcase" className="relative w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${currentTheme.accentTag}`}>{badge}</span>}
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${currentTheme.text}`}>{title}</h2>
          {description && <p className={`text-base sm:text-lg max-w-2xl mx-auto ${currentTheme.muted}`}>{description}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((it, idx) => (
            <div key={idx} className={`rounded-3xl border overflow-hidden flex flex-col ${currentTheme.card} ${currentTheme.border}`}>
              {it.imageUrl && <div className="h-48 overflow-hidden"><img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover" /></div>}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {it.category && <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">{it.category}</span>}
                    {it.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">{it.badge}</span>}
                  </div>
                  <h3 className={`text-lg font-bold mb-2 ${currentTheme.text}`}>{it.title}</h3>
                  <p className={`text-xs leading-relaxed mb-4 ${currentTheme.muted}`}>{it.description}</p>
                </div>
                <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-indigo-400">{it.price}</span>
                  <a href="#contact" className={`px-4 py-2 rounded-xl text-xs font-semibold ${currentTheme.primaryBtn}`}>{it.ctaText || 'Get Started'}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
""")

        # src/sections/HowItWorksSection.jsx
        zf.writestr(f"{project_slug}/src/sections/HowItWorksSection.jsx", """import React from 'react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function HowItWorksSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {} } = section;
  const { badge, title, description, steps = [] } = content;

  return (
    <section id="how-it-works" className="relative w-full py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${currentTheme.accentTag}`}>{badge}</span>}
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${currentTheme.text}`}>{title}</h2>
          {description && <p className={`text-base sm:text-lg max-w-2xl mx-auto ${currentTheme.muted}`}>{description}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, idx) => (
            <div key={idx} className={`p-8 rounded-3xl border relative ${currentTheme.card} ${currentTheme.border}`}>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-extrabold text-lg flex items-center justify-center mb-6">
                {st.stepNumber || idx + 1}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${currentTheme.text}`}>{st.title}</h3>
              <p className={`text-sm leading-relaxed ${currentTheme.muted}`}>{st.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
""")

        # src/sections/FaqSection.jsx
        zf.writestr(f"{project_slug}/src/sections/FaqSection.jsx", """import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

export function FaqSection({ section, theme = DEFAULT_THEME }) {
  const currentTheme = THEMES[theme] || THEMES[DEFAULT_THEME];
  const { content = {} } = section;
  const { badge, title, description, items = [] } = content;
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" className="relative w-full py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {badge && <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 ${currentTheme.accentTag}`}>{badge}</span>}
          <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${currentTheme.text}`}>{title}</h2>
          {description && <p className={`text-base sm:text-lg max-w-2xl mx-auto ${currentTheme.muted}`}>{description}</p>}
        </div>
        <div className="space-y-4">
          {items.map((it, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className={`rounded-2xl border transition overflow-hidden ${currentTheme.card} ${currentTheme.border}`}>
                <button onClick={() => setOpenIdx(isOpen ? -1 : idx)} className="w-full p-6 text-left flex items-center justify-between gap-4">
                  <span className={`font-bold text-base sm:text-lg ${currentTheme.text}`}>{it.question}</span>
                  <ChevronDown className={`w-5 h-5 text-indigo-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <div className={`px-6 pb-6 text-sm leading-relaxed ${currentTheme.muted}`}>{it.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
""")

        # src/renderer/LandingPage.jsx
        zf.writestr(f"{project_slug}/src/renderer/LandingPage.jsx", """import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroSection } from '../sections/HeroSection';
import { StatsSection } from '../sections/StatsSection';
import { FeaturesSection } from '../sections/FeaturesSection';
import { ShowcaseSection } from '../sections/ShowcaseSection';
import { HowItWorksSection } from '../sections/HowItWorksSection';
import { PricingSection } from '../sections/PricingSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { FaqSection } from '../sections/FaqSection';
import { ContactSection } from '../sections/ContactSection';
import { THEMES, DEFAULT_THEME } from '../themes/themes';

const COMPONENTS = {
  hero: HeroSection,
  stats: StatsSection,
  features: FeaturesSection,
  showcase: ShowcaseSection,
  steps: HowItWorksSection,
  pricing: PricingSection,
  testimonials: TestimonialsSection,
  faq: FaqSection,
  contact: ContactSection,
};

export function LandingPage({ siteData }) {
  const { site = {}, sections = [] } = siteData || {};
  const currentThemeId = site.theme || DEFAULT_THEME;
  const currentTheme = THEMES[currentThemeId] || THEMES[DEFAULT_THEME];

  return (
    <div className={`w-full min-h-screen ${currentTheme.bg} ${currentTheme.text}`}>
      <Navbar siteName={site.name} theme={currentThemeId} />
      <main>
        {sections.map((sec) => {
          if (sec.visible === false) return null;
          const Comp = COMPONENTS[sec.type];
          return Comp ? <Comp key={sec.id} section={sec} theme={currentThemeId} /> : null;
        })}
      </main>
      <Footer siteName={site.name} description={site.description} theme={currentThemeId} />
    </div>
  );
}
""")

        # src/App.jsx
        zf.writestr(f"{project_slug}/src/App.jsx", """import React from 'react';
import siteData from './data/site.json';
import { LandingPage } from './renderer/LandingPage';

export default function App() {
  return <LandingPage siteData={siteData} />;
}
""")

    buf.seek(0)
    return buf

def create_standalone_html(site_data: Dict[str, Any]) -> str:
    """Builds a standalone HTML document containing the site structure."""
    site = site_data.get("site", {})
    sections = site_data.get("sections", [])
    name = site.get("name", "Website")

    sec_htmls = []
    for s in sections:
        if s.get("visible") is False:
            continue
        c = s.get("content", {})
        stype = s.get("type")
        if stype == "hero":
            sec_htmls.append(f"""
            <section class="py-24 text-center max-w-4xl mx-auto">
              <h1 class="text-5xl font-extrabold tracking-tight mb-6">{c.get('headline', '')}</h1>
              <p class="text-xl opacity-80 mb-8">{c.get('subtitle', '')}</p>
              <a href="#contact" class="px-8 py-3.5 rounded-xl font-bold bg-indigo-600 text-white shadow-lg">{c.get('primaryCta', 'Get Started')}</a>
            </section>
            """)
        elif stype == "features":
            items = "".join([f'<div class="p-6 bg-slate-900 rounded-xl border border-slate-800"><h3 class="font-bold text-lg mb-2">{i.get("title")}</h3><p class="text-sm opacity-70">{i.get("description")}</p></div>' for i in c.get("items", [])])
            sec_htmls.append(f"""
            <section class="py-20 max-w-6xl mx-auto">
              <h2 class="text-3xl font-bold text-center mb-12">{c.get('title', '')}</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">{items}</div>
            </section>
            """)
        elif stype == "pricing":
            plans = "".join([f'<div class="p-8 bg-slate-900 rounded-xl border border-slate-800"><h3 class="font-bold text-lg mb-2">{p.get("name")}</h3><div class="text-3xl font-extrabold mb-4">{p.get("price")} <span class="text-sm opacity-60">{p.get("period")}</span></div><p class="text-sm opacity-70 mb-4">{p.get("description")}</p><a href="#contact" class="block text-center py-2 bg-indigo-600 text-white rounded-lg">{p.get("cta")}</a></div>' for p in c.get("plans", [])])
            sec_htmls.append(f"""
            <section class="py-20 max-w-6xl mx-auto">
              <h2 class="text-3xl font-bold text-center mb-12">{c.get('title', '')}</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">{plans}</div>
            </section>
            """)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 antialiased min-h-screen px-6">
  <header class="py-6 border-b border-slate-800 flex justify-between items-center max-w-6xl mx-auto">
    <div class="font-bold text-xl">{name}</div>
  </header>
  <main>
    {"".join(sec_htmls)}
  </main>
</body>
</html>
"""
