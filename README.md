# 🚀 LaunchCraft AI

> **Prompt to Structured Schema, Not Fragile Code.**  
> Transform natural language business prompts into verified, dynamic, production-ready landing pages with autonomous QA validation and one-click React codebase export.

---

## 🌟 Key Features

* **Dual-Agent Architecture:**
  * **Primary Generator:** Creates structured landing page schemas from user prompts.
  * **Autonomous Rectifier QA Agent:** Evaluates generation against prompt requirements, computes compliance scores ($0-100\%$), and auto-repairs missing sections before rendering.
* **7 Curated Design Themes:** `bright`, `sunny`, `fresh`, `minimal`, `bold`, `cyber`, `sunset`.
* **28 Section Layout Variants:** Across 9 primitives (`hero`, `features`, `pricing`, `testimonials`, `faq`, `contact`, `cta`, `stats`, `footer`).
* **Interactive Studio Canvas:** Dual-pane layout, real-time inline text editing, live color palette switching, and **Scale-to-Fit (50% Whole-Page)** preview mode.
* **Production-Grade Export:** 1-Click instant React 19 + Vite + Tailwind CSS ZIP bundle or standalone static HTML download.

---

## 🏗️ Architecture

```
User Prompt
    │
    ▼
FastAPI Backend (Port 8000)
    │
    ├─► Primary Generator (Gemini 2.5/Flash) ──► Raw JSON Schema
    │                                                   │
    └─► Rectifier QA Agent (Requirements Verification) ─┘
            │
            ▼
    Validated SiteConfig (Pydantic v2)
            │
            ▼
React 19 Frontend Studio (Port 5173 / Production Web)
    │
    ├─► Live Dynamic Renderer & Theme Engine
    ├─► Inline Visual Editor & Responsive Viewports
    └─► Client-Side JSZip Bundle Generator (React 19 + Vite + Tailwind)
```

---

## 💻 Local Development Setup

### 1. Clone & Open
```bash
git clone <your-repo-url>
cd launchcraft-ai
code .
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv

# Windows:
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and insert your GEMINI_API_KEY (mock mode runs automatically if omitted)

uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐙 Step-by-Step GitHub Setup

When you are ready to push this project to GitHub:

### Step 1: Configure Git Identity (if not already set)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 2: Initialize & Commit
```bash
# From the root 'launchcraft-ai' folder:
git add .
git commit -m "feat: LaunchCraft AI Major Project release with Rectifier QA Agent, 7 Themes, and Code Export"
```

### Step 3: Link to your GitHub Repository & Push
```bash
git branch -M main
git remote add origin https://github.com/<your-username>/launchcraft-ai.git
git push -u origin main
```

---

## ☁️ Deploying to Render

LaunchCraft AI includes `render.yaml` for 1-click Blueprint deployment.

### Method A: Render Blueprint (Recommended)
1. Push your repository to GitHub.
2. Log into [Render Dashboard](https://dashboard.render.com).
3. Click **New +** $\rightarrow$ **Blueprint**.
4. Connect your `launchcraft-ai` GitHub repository.
5. Render will automatically parse `render.yaml` and provision:
   * **Backend Web Service (`launchcraft-backend`)**: Python 3.11 with FastAPI.
   * **Frontend Static Site (`launchcraft-frontend`)**: Vite React static build with rewrite rules.
6. Under `launchcraft-backend` $\rightarrow$ **Environment**, add:
   * `GEMINI_API_KEY`: `your_actual_gemini_api_key`
7. Under `launchcraft-frontend` $\rightarrow$ **Environment**, add:
   * `VITE_API_BASE`: `https://<your-backend-service-url>.onrender.com`
8. Deploy!

### Method B: Manual Render Setup

#### 1. Backend Web Service:
* **Environment:** Python 3
* **Root Directory:** `backend`
* **Build Command:** `pip install -r requirements.txt`
* **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
* **Environment Variables:**
  * `GEMINI_API_KEY`: `<your-gemini-key>`

#### 2. Frontend Static Site:
* **Environment:** Static Site
* **Root Directory:** `frontend`
* **Build Command:** `npm install && npm run build`
* **Publish Directory:** `dist`
* **Environment Variables:**
  * `VITE_API_BASE`: `https://<your-backend-name>.onrender.com`
* **Redirects / Rewrites:**
  * Source: `/*`
  * Destination: `/index.html`
  * Action: `Rewrite`

---

## 📄 License
MIT License. Built for Major Project Submission.
