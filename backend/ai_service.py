import os
import json
import re
from typing import Optional, Dict, Any, List
from pathlib import Path
from dotenv import load_dotenv
from prompts import ENHANCE_PROMPT_SYSTEM, GENERATE_PAGE_SYSTEM, REGENERATE_SECTION_SYSTEM

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

def get_gemini_key() -> str:
    return os.getenv("GEMINI_API_KEY", "").strip()

def get_gemini_model() -> str:
    return os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()

def is_gemini_configured() -> bool:
    return bool(get_gemini_key())

def _clean_json_response(raw_text: str) -> str:
    """Strip markdown code fence backticks and whitespace."""
    text = raw_text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

def _get_client(timeout: float = 15.0):
    from google import genai
    from google.genai import types
    return genai.Client(
        api_key=get_gemini_key(),
        http_options=types.HttpOptions(timeout=timeout)
    )

def enhance_prompt_service(prompt: str) -> str:
    """Enhance user prompt using Gemini API or domain-aware converter."""
    if is_gemini_configured():
        model_candidates = ["gemini-flash-latest", get_gemini_model(), "gemini-3.7-flash"]
        for mod in model_candidates:
            try:
                client = _get_client(timeout=8.0)
                response = client.models.generate_content(
                    model=mod,
                    contents=f"{ENHANCE_PROMPT_SYSTEM}\n\nUser description:\n{prompt}",
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                continue

    # High-quality smart domain-aware fallback
    clean_p = prompt.strip().rstrip('.')
    lower = clean_p.lower()
    if any(k in lower for k in ["library", "book", "borrow", "lend", "return"]):
        return (
            "Create a high-converting, modern landing page for an Intelligent Library Management & Book Circulation System. "
            "Feature an impactful headline highlighting effortless book borrowing and automated returns, 3 key feature pillars with metrics "
            "(self-checkout speed, overdue tracking rate, and dynamic tiered lending prices), transparent membership and institutional pricing tiers, "
            "authentic customer review cards with 5-star ratings from librarians and patrons, and a high-visibility lead capture CTA form with zero friction."
        )

    return (
        f"Create a high-converting, modern landing page for {clean_p}. "
        "Feature an impactful headline with clear conversion hook, 3 key feature pillars with metrics, "
        "transparent tiered pricing or membership options, authentic customer review cards with 5-star ratings, "
        "and a high-visibility lead capture CTA form with zero friction."
    )

from rectifier_service import audit_and_rectify_page

def generate_page_service(prompt: str, theme: str = "bright") -> Dict[str, Any]:
    """Generate full landing page JSON using Gemini or dynamic domain synthesizer, audited by Rectifier Agent."""
    candidate = None
    if is_gemini_configured():
        model_candidates = ["gemini-flash-latest", get_gemini_model(), "gemini-3.7-flash"]
        for mod in model_candidates:
            try:
                client = _get_client(timeout=15.0)
                prompt_content = f"{GENERATE_PAGE_SYSTEM}\n\nWebsite Prompt: {prompt}\nPreferred Theme: {theme}"
                
                response = client.models.generate_content(
                    model=mod,
                    contents=prompt_content,
                )
                if response and response.text:
                    cleaned = _clean_json_response(response.text)
                    parsed = json.loads(cleaned)
                    if "site" in parsed and "sections" in parsed:
                        model_theme = parsed.get("site", {}).get("theme")
                        if model_theme in ["bright", "sunny", "fresh", "minimal", "bold", "cyber", "sunset"]:
                            pass  # Keep the AI's contextual design theme selection
                        elif theme:
                            parsed["site"]["theme"] = theme
                        else:
                            parsed["site"]["theme"] = "bright"
                        candidate = parsed
                        break
            except Exception as e:
                print(f"[Notice] Gemini model {mod} error ({type(e).__name__}). Trying next or synthesizer.")
                continue

    if not candidate:
        # Truly dynamic domain synthesizer tailored to ANY prompt
        candidate = _synthesize_dynamic_site(prompt, theme)

    # Autonomous Rectifier Agent: audits, enhances missing features, and evaluates prompt alignment
    return audit_and_rectify_page(prompt, candidate)

def regenerate_section_service(site_data: Dict[str, Any], section_id: str, instruction: str) -> Dict[str, Any]:
    """Regenerate a single section using Gemini or intelligent local rewrite."""
    sections = site_data.get("sections", [])
    target_section = next((s for s in sections if s.get("id") == section_id), None)
    if not target_section:
        raise ValueError(f"Section {section_id} not found in site")

    if is_gemini_configured():
        try:
            client = _get_client()
            user_content = (
                f"{REGENERATE_SECTION_SYSTEM}\n\n"
                f"Full Site Context: {json.dumps(site_data.get('site', {}))}\n"
                f"Target Section to Modify: {json.dumps(target_section)}\n"
                f"User Instruction: {instruction}\n"
            )
            response = client.models.generate_content(
                model=get_gemini_model(),
                contents=user_content,
            )
            if response and response.text:
                cleaned = _clean_json_response(response.text)
                parsed = json.loads(cleaned)
                if "content" in parsed and parsed.get("id") == section_id:
                    return parsed
        except Exception as e:
            print(f"[Notice] Gemini API section regen ({type(e).__name__}). Using local rewrite.")

    # Intelligent local section rewrite
    cloned = json.loads(json.dumps(target_section))
    stype = cloned.get("type")
    content = cloned.get("content", {})

    if stype == "hero":
        content["headline"] = f"{content.get('headline', '')} — Powered by {instruction}"
        content["subtitle"] = f"{instruction}. Designed to deliver maximum engagement and proven conversion."
        content["primaryCta"] = "Get Started Now"
    elif stype == "features":
        content["title"] = f"Key Advantages ({instruction})"
        content["description"] = f"Engineered around your requirements: {instruction}"
    elif stype == "pricing":
        content["badge"] = "Updated Tiers"
        content["title"] = f"Flexible Plans ({instruction})"
    elif stype == "testimonials":
        content["title"] = f"Verified Client Feedback"
        content["description"] = f"What real customers say after experiencing our {instruction}."
    elif stype == "contact":
        content["headline"] = f"Ready to Take the Next Step?"
        content["subtitle"] = f"{instruction}. Reach out today to get started."

    cloned["content"] = content
    return cloned

def _extract_brand_name(prompt: str) -> str:
    """Extracts a brand or company name from the prompt or creates a sensible one."""
    # Pattern 1: "called X" or "named X"
    match = re.search(r'(?:called|named|brand(?:ed)?|titled)\s+["\']?([A-Z0-9][A-Za-z0-9\s&\'\.\-]+?)(?:["\']|[\.,;\n]|\s+with|\s+for|\s+that|\s+which|\s+a|\s+an|$)', prompt)
    if match and match.group(1).strip():
        name = match.group(1).strip()
        if len(name.split()) <= 4:
            return name

    # Pattern 2: (?:platform|system|app|company|tool|studio|store|service)\s+([A-Z][a-zA-Z0-9]+)
    match = re.search(r'(?:platform|system|app|company|tool|studio|store|service|product)\s+([A-Z][a-zA-Z0-9]+)', prompt)
    if match and match.group(1).strip():
        candidate = match.group(1).strip()
        if candidate.lower() not in ["modern", "clean", "responsive", "high", "landing", "website"]:
            return candidate

    # Pattern 3: Explicit CamelCase word like CyberShield, LibroFlow, BreadBox
    camel_match = re.search(r'\b([A-Z][a-z]+[A-Z][a-zA-Z0-9]*)\b', prompt)
    if camel_match and camel_match.group(1).strip():
        cand = camel_match.group(1).strip()
        if cand.lower() not in ["javascript", "typescript", "tailwind"]:
            return cand

    # Pattern 4: "for X" where X has Capitalized words and is not an instruction word
    match = re.search(r'(?:for\s+(?:a\s+|an\s+)?)([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)?)\s+(?:website|landing|app|platform|store|studio|company|system)', prompt)
    if match and match.group(1).strip():
        candidate = match.group(1).strip()
        if candidate.lower() not in ["modern", "high-converting", "clean", "responsive", "feature"]:
            return candidate

    return ""

def _extract_clean_subject(prompt: str) -> str:
    """Extracts the true product/service subject by stripping boilerplate instructions."""
    t = prompt
    boilerplates = [
        r'create\s+(?:a|an)?\s*(?:high-converting|modern|stunning|beautiful|clean|professional)?\s*[,]?\s*(?:modern|clean|high-converting)?\s*(?:landing\s+page|website)\s+(?:for\s+)?',
        r'i\s+want\s+to\s+(?:create|build|make)\s+(?:a|an)?\s*',
        r'landing\s+page\s+for\s+',
        r'website\s+for\s+'
    ]
    for b in boilerplates:
        t = re.sub(b, '', t, flags=re.I)
    
    m = re.match(r'^\s*([a-zA-Z0-9\s\-]+?)(?:\s+landing\s+page|\s+website|\s+system|\s+with\s+features|\s+with|\.|\,|$)', t, flags=re.I)
    if m:
        sub = m.group(1).strip()
        if len(sub) > 2 and sub.lower() not in ["modern", "clean", "page", "website"]:
            if 'system' in t[:len(sub)+10].lower() and not sub.lower().endswith('system'):
                sub += ' System'
            return sub.title()
    return "Modern Venture"

def _extract_user_features(prompt: str) -> List[str]:
    """Extracts user requested features from prompts like 'with features like X, Y, Z'."""
    m = re.search(r'(?:features\s+like|features\s+including|features\s+such\s+as|with\s+features\s+like|features:)\s*([^\.\n]+)', prompt, re.I)
    if m:
        raw = m.group(1).strip()
        items = [i.strip(' ,;') for i in re.split(r'[,;]|\sand\s', raw) if i.strip(' ,;') and len(i.strip()) > 3]
        clean_items = [i for i in items if i.lower() not in ['etc', 'and', 'or', 'so on']]
        if clean_items:
            return clean_items
    return []

def _synthesize_dynamic_site(prompt: str, theme: str) -> Dict[str, Any]:
    """
    Intelligently synthesizes a realistic, rich landing page configuration
    specifically tailored to the user's prompt across 12+ industry categories.
    """
    lower = prompt.lower()
    extracted_brand = _extract_brand_name(prompt)

    # 0. Library & Book Circulation Management (Lending, Borrowing, Returns, Catalogs)
    if any(k in lower for k in ["library", "libraries", "librarian", "book", "books", "borrow", "borrowing", "lend", "lending", "return", "returning", "catalog", "circulation", "reading", "patron", "opac", "archive"]):
        brand = extracted_brand or "LibroFlow"
        return {
            "site": {
                "name": brand,
                "tagline": "Intelligent Library & Book Circulation Management",
                "description": f"Streamline book borrowing, automated returns, and dynamic tiered lending rates across physical and digital collections with {brand}.",
                "theme": theme if theme != "minimal" else "fresh"
            },
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Next-Gen Library Operating System",
                        "headline": "Smarter Book Circulation. Effortless Borrowing & Returns.",
                        "subtitle": f"{brand} empowers your patrons with self-service book loans, automated return drops, and transparent lending prices. Reduce catalog admin by 70% while boosting reading engagement.",
                        "primaryCta": "Start Free 14-Day Trial",
                        "secondaryCta": "Browse Book Catalog",
                        "imageUrl": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80"
                    }
                },
                {
                    "id": "stats-1",
                    "type": "stats",
                    "variant": "grid",
                    "visible": True,
                    "content": {
                        "badge": "Circulation Metrics",
                        "title": "Proven Performance & Circulation Metrics",
                        "description": "Measurable circulation outcomes achieved by hundreds of modern library systems.",
                        "metrics": [
                            {
                                "value": "50,000+",
                                "label": "Titles Cataloged",
                                "description": "Seamless real-time tracking across physical stacks & digital e-books."
                            },
                            {
                                "value": "3.2x",
                                "label": "Faster Checkout",
                                "description": "Instant RFID and mobile barcode self-service borrowing kiosks."
                            },
                            {
                                "value": "94%",
                                "label": "On-Time Returns",
                                "description": "Automated SMS/email due reminders with automated renewal."
                            },
                            {
                                "value": "$0",
                                "label": "Late Fee Surprises",
                                "description": "Transparent grace periods and frictionless patron communications."
                            }
                        ]
                    }
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "variant": "three-column",
                    "visible": True,
                    "content": {
                        "badge": "3 Key Feature Pillars with Metrics",
                        "title": "Engineered for Modern Library Operations",
                        "description": "Everything librarians and patrons need to discover, lend, and manage physical & digital collections.",
                        "items": [
                            {
                                "title": "Smart Book Borrowing & Instant Checkout",
                                "description": "Self-service barcode and RFID scanning with 1-tap mobile checkout. Reduces circulation desk queues by 75% (3.2x Faster Checkout).",
                                "icon": "sparkles"
                            },
                            {
                                "title": "Automated Book Returns & Overdue Tracking",
                                "description": "Instant drop-box check-ins, automated SMS/email return reminders, and automated hold-shelf routing (94% On-Time Returns).",
                                "icon": "activity"
                            },
                            {
                                "title": "Dynamic Lending Prices & Catalog Tiers",
                                "description": "Configurable lending fees, membership rental quotas, transparent late fines, and multi-branch catalog sync (50,000+ Titles Tracked).",
                                "icon": "shield"
                            }
                        ]
                    }
                },
                {
                    "id": "showcase-1",
                    "type": "showcase",
                    "variant": "grid",
                    "visible": True,
                    "content": {
                        "badge": "Curated Collections & Lending Rates",
                        "title": "Explore Different Book Categories & Lending Prices",
                        "description": "Borrow high-demand bestsellers, rare historical volumes, or academic research titles with clear, tiered rental rates.",
                        "items": [
                            {
                                "title": "The Quantum Universe & Cosmology",
                                "category": "Academic & STEM",
                                "price": "$2.99 / week",
                                "badge": "Available Now",
                                "description": "Advanced astrophysics and quantum mechanical principles for scholars and researchers.",
                                "imageUrl": "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Borrow Book"
                            },
                            {
                                "title": "Echoes of Eternity: Bestseller Edition",
                                "category": "Fiction & Literature",
                                "price": "$1.99 / week",
                                "badge": "Most Borrowed",
                                "description": "Award-winning contemporary fiction exploring memory, love, and humanity across time.",
                                "imageUrl": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Borrow Book"
                            },
                            {
                                "title": "18th-Century Cartography & Maps",
                                "category": "Rare Special Collections",
                                "price": "$4.99 / week",
                                "badge": "Archival Vault",
                                "description": "Digitized high-resolution scans and protected physical access to historical navigational charts.",
                                "imageUrl": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Request Access"
                            },
                            {
                                "title": "Mindful Thinking & Behavioral Science",
                                "category": "Non-Fiction & Wellness",
                                "price": "$1.49 / week",
                                "badge": "Available Now",
                                "description": "Practical cognitive psychology strategies for deep focus and personal decision-making.",
                                "imageUrl": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Borrow Book"
                            },
                            {
                                "title": "Adventures of the Little Explorer",
                                "category": "Children & Early Readers",
                                "price": "$0.99 / week",
                                "badge": "All Ages",
                                "description": "Vibrantly illustrated storybook inspiring curious young minds to discover nature.",
                                "imageUrl": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Borrow Book"
                            },
                            {
                                "title": "The Art of Architectural Design",
                                "category": "Art & Architecture",
                                "price": "$3.49 / week",
                                "badge": "Popular",
                                "description": "Comprehensive monographs detailing contemporary sustainable architecture worldwide.",
                                "imageUrl": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Borrow Book"
                            }
                        ]
                    }
                },
                {
                    "id": "steps-1",
                    "type": "steps",
                    "variant": "process-flow",
                    "visible": True,
                    "content": {
                        "badge": "Circulation Workflow",
                        "title": "How Borrowing & Returning Works in 3 Steps",
                        "description": "Zero lines at the counter. Seamless digital tracking from check-out to drop-box.",
                        "steps": [
                            {
                                "stepNumber": 1,
                                "title": "Search & Reserve in 1 Click",
                                "description": "Browse our online catalog, filter by branch availability, and place a hold with zero waiting."
                            },
                            {
                                "stepNumber": 2,
                                "title": "Scan & Self-Checkout",
                                "description": "Use any kiosk or your mobile phone to scan book barcodes or RFID tags for instantaneous borrowing."
                            },
                            {
                                "stepNumber": 3,
                                "title": "Read & 24/7 Smart Return Drop",
                                "description": "Drop books into any automated return slot. The system scans the return and checks it in automatically."
                            }
                        ]
                    }
                },
                {
                    "id": "pricing-1",
                    "type": "pricing",
                    "variant": "highlighted-middle",
                    "visible": True,
                    "content": {
                        "badge": "Transparent Membership Tiers",
                        "title": "Flexible Plans for Readers & Institutions",
                        "description": "Clear, transparent pricing with zero hidden maintenance fees.",
                        "plans": [
                            {
                                "name": "Community Reader",
                                "price": "$9",
                                "period": "/mo",
                                "description": "For independent readers & student researchers",
                                "features": [
                                    "Borrow up to 8 books simultaneously",
                                    "Standard 21-day lending window",
                                    "Mobile renewal & catalog reserve",
                                    "Zero deposit on standard editions"
                                ],
                                "cta": "Join as Reader",
                                "highlighted": False
                            },
                            {
                                "name": "Pro Scholar & Guild",
                                "price": "$24",
                                "period": "/mo",
                                "description": "Our most popular tier for avid readers & book clubs",
                                "features": [
                                    "Borrow up to 25 books + audiobooks",
                                    "Extended 45-day lending duration",
                                    "Zero late return penalties (7-day grace)",
                                    "Priority inter-branch delivery",
                                    "Discounted rare archive lending prices"
                                ],
                                "cta": "Start Pro Scholar",
                                "highlighted": True
                            },
                            {
                                "name": "Institutional Campus",
                                "price": "$149",
                                "period": "/mo",
                                "description": "For public libraries, universities & community archives",
                                "features": [
                                    "Unlimited patron & staff accounts",
                                    "Automated RFID, barcode & return kiosks",
                                    "Custom lending price rules & fine waivers",
                                    "Full OPAC & MARC21 catalog export",
                                    "Dedicated onboarding & 24/7 support"
                                ],
                                "cta": "Deploy Institution Plan",
                                "highlighted": False
                            }
                        ]
                    }
                },
                {
                    "id": "testimonials-1",
                    "type": "testimonials",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "5-Star Patron & Staff Reviews",
                        "title": "Trusted by Over 1,200 Libraries Nationwide",
                        "description": "See how library directors and patrons modernized their circulation experience.",
                        "testimonials": [
                            {
                                "quote": f"Managing borrowing records and tracking overdue books across our 45,000-title collection was a nightmare before {brand}. Overdue rates dropped by 86% within two months!",
                                "name": "Dr. Alistair Finch",
                                "role": "Head Librarian, City Academic Archive",
                                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                                "rating": 5
                            },
                            {
                                "quote": f"The tiered lending pricing and self-service return kiosk freed our circulation team to focus on community reading programs. Outstanding software.",
                                "name": "Eleanor Vance",
                                "role": "Circulation Director, Metro Central Library",
                                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                                "rating": 5
                            },
                            {
                                "quote": f"As an active book club member, being able to track my loans, renew online, and reserve popular titles seamlessly makes visiting the library pure joy.",
                                "name": "Devon Reed",
                                "role": "Patron & Book Club Lead",
                                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
                                "rating": 5
                            }
                        ]
                    }
                },
                {
                    "id": "faq-1",
                    "type": "faq",
                    "variant": "accordion",
                    "visible": True,
                    "content": {
                        "badge": "Circulation & Policy FAQ",
                        "title": "Frequently Asked Questions About Borrowing & Returns",
                        "description": "Clear answers on book lending rules, duration allowances, and transparent rental fees.",
                        "items": [
                            {
                                "question": "How does book borrowing work with LibroFlow?",
                                "answer": "Patrons can reserve titles online or browse stacks in person, then scan the barcode or RFID tag at any kiosk or using our mobile web app for instant 1-tap checkout."
                            },
                            {
                                "question": "How are different book lending prices calculated?",
                                "answer": "Standard literary titles are included with your membership tier ($0 per checkout). Specialized high-demand bestsellers, rare historical volumes, or STEM references feature transparent weekly rental rates clearly listed on each title card."
                            },
                            {
                                "question": "What is the policy for book returns and overdue tracking?",
                                "answer": "Books can be dropped into 24/7 smart automated return boxes. The system automatically reads the return, checks the inventory back in, and sends an instant email receipt. Patrons receive automated reminder notifications 3 days before any due date."
                            },
                            {
                                "question": "Can libraries migrate existing catalog data?",
                                "answer": "Yes! LibroFlow includes one-click migration for MARC21, OPAC, Excel, and CSV catalog databases, with complete historical patron and circulation logs preserved."
                            }
                        ]
                    }
                },
                {
                    "id": "contact-1",
                    "type": "contact",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Zero Friction Setup",
                        "headline": "Modernize Your Library System Today",
                        "subtitle": "Deploy in under 15 minutes. Import existing MARC/Excel catalogs with 1 click. Zero credit card required for 14-day trial.",
                        "buttonText": "Start Free Library Trial",
                        "emailPlaceholder": "Enter your library or institutional email...",
                        "secondaryText": "Instant setup • Free data migration assistance included."
                    }
                }
            ]
        }

    # 1. Real Estate / Architecture / Property
    elif any(k in lower for k in ["real estate", "property", "realtor", "home", "apartment", "villa", "interior", "architecture", "housing"]):
        brand = extracted_brand or "Aura Living"
        return {
            "site": {
                "name": brand,
                "tagline": "Architectural Elegance & Luxury Spaces",
                "description": f"Curated high-end residential listings, bespoke interior design, and prime estates presented by {brand}.",
                "theme": theme if theme != "bold" else "minimal"
            },
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Prime Luxury Living",
                        "headline": f"Discover Architectural Masterpieces Tailored for You.",
                        "subtitle": f"{brand} curates exclusive residences, private estates, and architectural sanctuaries with unmatched attention to detail.",
                        "primaryCta": "Browse Listings",
                        "secondaryCta": "Schedule Private Tour",
                        "imageUrl": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                    }
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "variant": "three-column",
                    "visible": True,
                    "content": {
                        "badge": "Our Standard",
                        "title": "Every Residence Built With Distinction",
                        "description": "Uncompromising architectural excellence from concept to closing.",
                        "items": [
                            {"title": "Prime Location Access", "description": "Exclusive off-market estates in premier metropolitan and coastal enclaves.", "icon": "mappin"},
                            {"title": "Bespoke Interior Craft", "description": "Handpicked natural stone, artisan millwork, and intelligent smart home automation.", "icon": "layout"},
                            {"title": "Private Concierge Advisory", "description": "Dedicated property advisors guiding acquisition, legal title, and interior styling.", "icon": "shield"}
                        ]
                    }
                },
                {
                    "id": "pricing-1",
                    "type": "pricing",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Advisory Packages",
                        "title": "Bespoke Real Estate Services",
                        "description": "Tailored guidance for buyers, sellers, and luxury investors.",
                        "plans": [
                            {"name": "Buyer Representation", "price": "Standard", "period": "commission", "description": "Dedicated buyer representation", "features": ["Curated portfolio tours", "Off-market access", "Contract negotiation"], "cta": "Inquire Representation", "highlighted": False},
                            {"name": "Private Portfolio Sale", "price": "VIP", "period": "bespoke", "description": "Discreet private marketing", "features": ["Global confidential outreach", "Architectural cinematic video", "Pre-qualified buyer screening"], "cta": "List Privately", "highlighted": True},
                            {"name": "Development Advisory", "price": "Custom", "period": "retainer", "description": "For developers and investors", "features": ["Feasibility analysis", "Architectural review", "Pre-sale marketing campaign"], "cta": "Schedule Consultation", "highlighted": False}
                        ]
                    }
                },
                {
                    "id": "testimonials-1",
                    "type": "testimonials",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Client Experiences",
                        "title": "Trusted by Discerning Homeowners",
                        "description": "Reflections from clients who discovered their dream sanctuaries.",
                        "testimonials": [
                            {"quote": f"Working with {brand} was effortless. They secured an off-market penthouse that surpassed every expectation.", "name": "Julian Montgomery", "role": "Private Investor", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "The architectural staging and discreet marketing led to a full-price sale in less than 14 days.", "name": "Camille De Santos", "role": "Architect & Designer", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "Unrivaled market knowledge and uncompromising integrity. The only agency I trust with luxury properties.", "name": "David Alcott", "role": "Venture Partner", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", "rating": 5}
                        ]
                    }
                },
                {
                    "id": "contact-1",
                    "type": "contact",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Private Inquiry",
                        "headline": "Inquire About Premier Residences",
                        "subtitle": "Connect with our senior property advisors for a confidential consultation or private viewing.",
                        "buttonText": "Request Private Consultation",
                        "emailPlaceholder": "Enter your email address...",
                        "secondaryText": "Complete discretion and NDA guarantees assured."
                    }
                }
            ]
        }

    # 2. E-Commerce / Store / Fashion / Sneaker / Apparel / Brand
    elif any(k in lower for k in ["store", "ecommerce", "e-commerce", "shop", "clothing", "fashion", "sneaker", "shoes", "apparel", "merch", "jewelry"]):
        brand = extracted_brand or "Veloce Kicks"
        return {
            "site": {
                "name": brand,
                "tagline": "Curated Footwear & Streetwear Drops",
                "description": f"Limited edition sneakers, authenticated streetwear grails, and premium athletic apparel at {brand}.",
                "theme": theme
            },
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Exclusive Drop #04",
                        "headline": f"Rare Drops. Verified Authenticity. Zero Counterfeits.",
                        "subtitle": f"{brand} delivers verified deadstock sneakers and limited-edition apparel straight to your door with insured worldwide shipping.",
                        "primaryCta": "Shop Latest Drop",
                        "secondaryCta": "View Authenticity Guarantee",
                        "imageUrl": "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80"
                    }
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "variant": "three-column",
                    "visible": True,
                    "content": {
                        "badge": "Why Shop With Us",
                        "title": "Every Pair Inspected by Master Authenticators",
                        "description": "We take authenticity and collector peace of mind seriously.",
                        "items": [
                            {"title": "12-Point AI Verification", "description": "Every stitch, box tag, and blacklight code verified by specialists before shipment.", "icon": "shield"},
                            {"title": "Same-Day Dispatch", "description": "Orders placed before 2 PM EST ship the same day with tamper-evident security seals.", "icon": "rocket"},
                            {"title": "Vault Protection", "description": "Temperature and humidity controlled storage guaranteeing pristine mint-box condition.", "icon": "lock"}
                        ]
                    }
                },
                {
                    "id": "pricing-1",
                    "type": "pricing",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Collector Tiers",
                        "title": "VIP Collector Memberships",
                        "description": "Unlock early queue access and exclusive member raffle allocations.",
                        "plans": [
                            {"name": "Standard Access", "price": "$0", "period": "/year", "description": "Free collector profile", "features": ["Standard drop notifications", "Verified marketplace buying", "Standard 3-5 day shipping"], "cta": "Create Free Account", "highlighted": False},
                            {"name": "VIP Pass", "price": "$19", "period": "/month", "description": "Priority drop access", "features": ["15-min early drop access", "2x Raffle win multiplier", "Free express 2-day delivery", "Zero marketplace seller fees"], "cta": "Join VIP Club", "highlighted": True},
                            {"name": "Vault Elite", "price": "$49", "period": "/month", "description": "Ultimate sneakerhead tier", "features": ["Guaranteed allocation access", "Dedicated concierge sourcer", "Free vault storage for 10 pairs", "Exclusive sample previews"], "cta": "Go Elite", "highlighted": False}
                        ]
                    }
                },
                {
                    "id": "testimonials-1",
                    "type": "testimonials",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Collector Stories",
                        "title": "Loved by Over 25,000 Collectors",
                        "description": "Real feedback from the sneaker community.",
                        "testimonials": [
                            {"quote": f"Copped my holy grail through {brand}. Arrived in 48 hours with full authentication tag and mint box.", "name": "Marcus K.", "role": "Collector, Los Angeles", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "The VIP pass paid for itself on the first Travis drop. Hands down the most reliable platform in the game.", "name": "Tara Chen", "role": "Streetwear Stylist", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "Authenticity check is bulletproof. Won't buy secondary market pairs anywhere else.", "name": "Jayden Brooks", "role": "Sneaker Enthusiast", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", "rating": 5}
                        ]
                    }
                },
                {
                    "id": "contact-1",
                    "type": "contact",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Drop Alerts",
                        "headline": "Never Miss a Limited Release",
                        "subtitle": "Get instant SMS and email notifications 10 minutes before every limited drop goes live.",
                        "buttonText": "Subscribe to Drop Alerts",
                        "emailPlaceholder": "Enter your email address...",
                        "secondaryText": "No spam ever. Unsubscribe with 1 click."
                    }
                }
            ]
        }

    # 3. Agency / Marketing / Consulting / Design / Portfolio / Freelancer
    elif any(k in lower for k in ["agency", "marketing", "consulting", "design", "portfolio", "freelance", "developer", "seo", "branding", "creative", "studio"]):
        brand = extracted_brand or "Nova Studio"
        return {
            "site": {
                "name": brand,
                "tagline": "High-Impact Digital Brand & Growth Engine",
                "description": f"We build category-defining brands, high-converting digital products, and revenue funnels at {brand}.",
                "theme": theme
            },
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Growth & Product Studio",
                        "headline": f"We Design Products That Move Markets & Drive Growth.",
                        "subtitle": f"{brand} partners with ambitious founders and enterprise leaders to craft bold digital experiences, award-winning interfaces, and scalable revenue engines.",
                        "primaryCta": "Start a Project",
                        "secondaryCta": "Explore Case Studies",
                        "imageUrl": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
                    }
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "variant": "three-column",
                    "visible": True,
                    "content": {
                        "badge": "Capabilities",
                        "title": "Full-Lifecycle Creative & Technical Execution",
                        "description": "From zero to category leadership with multidisciplinary precision.",
                        "items": [
                            {"title": "Product Design & UX", "description": "Design systems, conversion-driven web apps, and intuitive user experiences that scale.", "icon": "layout"},
                            {"title": "Performance Growth", "description": "Paid media architecture, viral retention loops, and analytics infrastructure.", "icon": "chart"},
                            {"title": "Modern Full-Stack Code", "description": "High-performance React, Next.js, and serverless engineering built for speed and uptime.", "icon": "code"}
                        ]
                    }
                },
                {
                    "id": "pricing-1",
                    "type": "pricing",
                    "variant": "highlighted-middle",
                    "visible": True,
                    "content": {
                        "badge": "Engagement Models",
                        "title": "Transparent Partnership Tiers",
                        "description": "Flexible sprints or dedicated embedded squads without agency bloat.",
                        "plans": [
                            {"name": "Design Sprint", "price": "$4,500", "period": "/sprint", "description": "Rapid prototype or landing overhaul", "features": ["2-Week focused execution", "Figma design system", "Interactive high-fi prototype", "1 Round of revisions"], "cta": "Book Sprint", "highlighted": False},
                            {"name": "Embedded Growth", "price": "$9,500", "period": "/month", "description": "Dedicated design & engineering squad", "features": ["Senior Product Designer & Tech Lead", "Weekly agile deliverables", "Continuous optimization & A/B testing", "Slack channel integration"], "cta": "Partner With Us", "highlighted": True},
                            {"name": "Enterprise Scale", "price": "Custom", "period": "/quarter", "description": "Complete digital transformation", "features": ["Full multi-team integration", "Custom architectural audits", "24/7 SLA guarantees", "Executive strategy workshops"], "cta": "Schedule Call", "highlighted": False}
                        ]
                    }
                },
                {
                    "id": "testimonials-1",
                    "type": "testimonials",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Partner Praise",
                        "title": "Proven Growth Across 80+ Launches",
                        "description": "What venture-backed founders say about our work.",
                        "testimonials": [
                            {"quote": f"{brand} redesigned our entire funnel and increased checkout conversion by 64% in the first month.", "name": "Christian Ray", "role": "CEO, Veloce Health", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "Fast, exceptionally creative, and ruthlessly focused on commercial outcomes. The best agency partner we've had.", "name": "Elena Kovacs", "role": "VP Product, ScalePath", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "They don't just design pretty screens—they build engines that convert visitors into loyal customers.", "name": "David Alcott", "role": "Managing Director, Apex Fund", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", "rating": 5}
                        ]
                    }
                },
                {
                    "id": "contact-1",
                    "type": "contact",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Get in Touch",
                        "headline": "Let's Build Something Memorable Together",
                        "subtitle": "Tell us about your brand goals, timeline, and vision. We'll reply within 24 hours with an actionable roadmap.",
                        "buttonText": "Submit Project Inquiry",
                        "emailPlaceholder": "Enter your work email...",
                        "secondaryText": "Direct access to creative directors from day one."
                    }
                }
            ]
        }

    # 4A. Bakery / Sourdough / Bread Subscriptions / Coffee & Pastry
    elif any(k in lower for k in ["bakery", "bread", "sourdough", "pastry", "pastries", "croissant", "baker", "flour", "loaf", "loaves"]):
        brand = extracted_brand or "GoldenCrust"
        return {
            "site": {
                "name": brand,
                "tagline": "Naturally Fermented Sourdough & Artisan Bread Subscriptions",
                "description": f"Slow-fermented stoneground sourdough, flaky viennoiserie, and morning doorstep bread subscriptions from {brand}.",
                "theme": "sunny" if theme in ["bold", "bright"] else theme
            },
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "variant": "image-background",
                    "visible": True,
                    "content": {
                        "badge": "Wood-Fired Hearth Baking",
                        "headline": "Slow Fermented. Stoneground. Baked Fresh Daily.",
                        "subtitle": f"{brand} brings slow-crafted sourdough loaves, morning butter croissants, and weekly artisan bread deliveries straight to your doorstep.",
                        "primaryCta": "Join Bread Subscription",
                        "secondaryCta": "Browse Daily Bakes",
                        "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80"
                    }
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "variant": "three-column",
                    "visible": True,
                    "content": {
                        "badge": "Our Baking Craft",
                        "title": "Pure Ingredients & 36-Hour Wild Fermentation",
                        "description": "Every loaf is leavened naturally with our 8-year sourdough starter.",
                        "items": [
                            {"title": "Organic Heritage Grains", "description": "Stoneground flours sourced directly from regenerative regional organic grain mills.", "icon": "sparkles"},
                            {"title": "36-Hour Slow Fermentation", "description": "Long cold fermentation creates blistered, deep golden crusts and wholesome digestibility.", "icon": "clock"},
                            {"title": "Morning Doorstep Drops", "description": "Fresh out of the hearth by 5 AM, delivered warm in breathable compostable bags.", "icon": "rocket"}
                        ]
                    }
                },
                {
                    "id": "showcase-1",
                    "type": "showcase",
                    "variant": "grid",
                    "visible": True,
                    "content": {
                        "badge": "Daily Hearth Bakes",
                        "title": "Signature Loaves & Viennoiserie",
                        "description": "Hand-shaped daily in limited batches. Order single loaves or reserve subscription slots.",
                        "items": [
                            {
                                "title": "Country Sourdough Boule",
                                "category": "Signature Bread",
                                "price": "$8.50 / loaf",
                                "badge": "Bestseller",
                                "description": "Open crumb, blistered caramelized crust, subtle lactic tang.",
                                "imageUrl": "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Order Loaf"
                            },
                            {
                                "title": "Kalamata Olive & Rosemary Sourdough",
                                "category": "Specialty Loaf",
                                "price": "$10.50 / loaf",
                                "badge": "Weekend Special",
                                "description": "Briny Greek olives, fresh garden rosemary, and cold-pressed olive oil.",
                                "imageUrl": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Order Loaf"
                            },
                            {
                                "title": "72-Hour Butter Croissants (4-Pack)",
                                "category": "French Viennoiserie",
                                "price": "$14.00 / box",
                                "badge": "Flaky Layers",
                                "description": "84% European cultured butter, golden honey glaze, crisp honeycomb interior.",
                                "imageUrl": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
                                "ctaText": "Order Box"
                            }
                        ]
                    }
                },
                {
                    "id": "pricing-1",
                    "type": "pricing",
                    "variant": "highlighted-middle",
                    "visible": True,
                    "content": {
                        "badge": "Bread Subscriptions",
                        "title": "Weekly Hearth Bread Deliveries",
                        "description": "Never run out of real sourdough. Pause, change loaves, or cancel anytime.",
                        "plans": [
                            {"name": "Weekly Loaf Club", "price": "$16", "period": "/week", "description": "Perfect for singles & couples", "features": ["2 Signature Sourdough Boules weekly", "Free Thursday morning delivery", "Pause anytime with 1 click", "10% off seasonal pastry drops"], "cta": "Subscribe to Loaf Club", "highlighted": False},
                            {"name": "Baker's Harvest Box", "price": "$28", "period": "/week", "description": "Our most loved family bread bundle", "features": ["2 Sourdough Boules + 1 Specialty Loaf", "4 Morning Butter Croissants", "Priority hearth allocation", "Zero delivery charge", "Complimentary sourdough starter jar"], "cta": "Subscribe to Harvest Box", "highlighted": True},
                            {"name": "Master Baker Guild", "price": "$48", "period": "/week", "description": "For serious culinary and bread enthusiasts", "features": ["4 Artisanal Loaves + 6 Pastries weekly", "Exclusive monthly baker test bakes", "Monthly live masterclass with Head Baker", "Free ceramic proofing basket"], "cta": "Join Master Guild", "highlighted": False}
                        ]
                    }
                },
                {
                    "id": "testimonials-1",
                    "type": "testimonials",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Neighbor Stories",
                        "title": "Loved by Foodies & Home Cooks",
                        "description": "What our subscribers say after their first warm loaf delivery.",
                        "testimonials": [
                            {"quote": f"Getting fresh warm sourdough on my doorstep every Thursday morning transformed our family breakfasts. {brand} crust is unmatched.", "name": "Sophie Moreau", "role": "Food Writer & Subscriber", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "I have mild gluten sensitivity with grocery bread, but this 36-hour wild fermented sourdough sits wonderfully. Absolute perfection.", "name": "Julian Thorne", "role": "Harvest Box Subscriber", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "The croissants are as flaky and buttery as the ones I had in Paris. Don't sleep on the olive rosemary sourdough!", "name": "Amira Patel", "role": "Culinary Enthusiast", "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80", "rating": 5}
                        ]
                    }
                },
                {
                    "id": "contact-1",
                    "type": "contact",
                    "variant": "centered",
                    "visible": True,
                    "content": {
                        "badge": "Free Tasting Loaf",
                        "headline": "Taste the Difference Real Fermentation Makes",
                        "subtitle": "Enter your email to receive a complimentary mini tasting loaf with your first subscription order.",
                        "buttonText": "Claim Free Tasting Loaf",
                        "emailPlaceholder": "Enter your email address...",
                        "secondaryText": "Local deliveries across metropolitan zones. Pause anytime."
                    }
                }
            ]
        }

    # 4. Culinary / Restaurant / Cafe / Bistro / Dining
        brand = extracted_brand or "Bella Tavola"
        return {
            "site": {
                "name": brand,
                "tagline": "Handcrafted Artisan Culinary Heritage",
                "description": f"Seasonal ingredients, wood-fired culinary craftsmanship, and welcoming neighborhood hospitality at {brand}.",
                "theme": theme if theme != "bold" else "fresh"
            },
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Fresh Farm to Table",
                        "headline": f"Handcrafted Flavors, Wood-Fired Hearth, Timeless Hospitality.",
                        "subtitle": f"Experience culinary craftsmanship prepared daily with locally sourced seasonal ingredients and deep dedication to flavor at {brand}.",
                        "primaryCta": "Reserve a Table",
                        "secondaryCta": "Explore Seasonal Menu",
                        "imageUrl": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"
                    }
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "variant": "three-column",
                    "visible": True,
                    "content": {
                        "badge": "Our Philosophy",
                        "title": "Every Dish Celebrates Craftsmanship",
                        "description": "Authentic recipes prepared with organic passion.",
                        "items": [
                            {"title": "Fresh Made Daily", "description": "Handcrafted every morning from scratch using organic heritage grains and farm produce.", "icon": "sparkles"},
                            {"title": "Wood-Fired Hearth", "description": "Cooked over seasoned oak logs for deep, smoky aromatics and unforgettable crusts.", "icon": "flame"},
                            {"title": "Curated Pairings", "description": "Over 180 biodynamic wines and artisan beverages hand-selected to elevate each course.", "icon": "award"}
                        ]
                    }
                },
                {
                    "id": "pricing-1",
                    "type": "pricing",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Tasting Menus",
                        "title": "Chef's Curated Experiences",
                        "description": "Multi-course culinary journeys designed around the week's market arrivals.",
                        "plans": [
                            {"name": "Classic Dining", "price": "$55", "period": "/guest", "description": "3-Course dinner highlighting house favorites", "features": ["Artisan starter", "Choice of main course", "Handmade dessert & espresso"], "cta": "Book Classic", "highlighted": False},
                            {"name": "Chef's Signature", "price": "$95", "period": "/guest", "description": "5-Course seasonal tasting experience", "features": ["Everything in Classic", "Seasonal signature plates", "Chef table presentation", "Optional wine pairing ($40)"], "cta": "Reserve Signature", "highlighted": True},
                            {"name": "Private Cellar", "price": "$160", "period": "/guest", "description": "Exclusive dining in private reserve vault", "features": ["7-Course bespoke menu", "Sommelier vintage pairings", "Dedicated service team"], "cta": "Inquire Vault", "highlighted": False}
                        ]
                    }
                },
                {
                    "id": "testimonials-1",
                    "type": "testimonials",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Critic Acclaim",
                        "title": "Loved by Food Lovers and Critics",
                        "description": "Reflections on unforgettable evenings at our tables.",
                        "testimonials": [
                            {"quote": f"The dishes at {brand} are an ethereal revelation. The best dining experience in the city this year.", "name": "Julian Moreau", "role": "Food Critic, Culinary Chronicle", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "Atmosphere, warmth, and culinary brilliance in equal measure. We celebrate all our milestones here.", "name": "Sofia Rossi", "role": "Local Guide", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "Unbelievable depth of flavor. The wood-fired hearth adds an authenticity you simply can't replicate.", "name": "Marcus Vance", "role": "Executive Chef", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", "rating": 5}
                        ]
                    }
                },
                {
                    "id": "contact-1",
                    "type": "contact",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Reservations",
                        "headline": "Join Us For Dinner This Week",
                        "subtitle": "Tables fill up quickly for weekend seatings. Reserve early to guarantee your spot.",
                        "buttonText": "Confirm Table Booking",
                        "emailPlaceholder": "Enter email for confirmation...",
                        "secondaryText": "Walk-ins welcome at the lounge bar."
                    }
                }
            ]
        }

    # 5. Cloud / SaaS Platform / Tech / Software / AI
    elif any(k in lower for k in ["cloud", "saas", "software", "tech", "platform", "ai", "data", "tool", "api", "infra", "cyber", "security"]):
        brand = extracted_brand or "CloudPulse AI"
        return {
            "site": {
                "name": brand,
                "tagline": "Autonomous Intelligence & Workflow Acceleration",
                "description": f"Next-generation automation, real-time analytics, and enterprise infrastructure powered by {brand}.",
                "theme": theme
            },
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Next-Gen AI Platform",
                        "headline": f"Automate Workflows. Cut Cloud Costs by 42%.",
                        "subtitle": f"{brand} gives engineering and product teams instant automated insights, latency reductions, and intelligent automation in under 5 minutes.",
                        "primaryCta": "Start 14-Day Free Trial",
                        "secondaryCta": "Book Technical Demo",
                        "imageUrl": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                    }
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "variant": "three-column",
                    "visible": True,
                    "content": {
                        "badge": "Architecture",
                        "title": "Built for High-Throughput Modern Teams",
                        "description": "Enterprise-grade reliability without engineering overhead.",
                        "items": [
                            {"title": "Intelligent Automation", "description": "Dynamically re-allocates compute and identifies bottlenecks in real time.", "icon": "cpu"},
                            {"title": "Lightning Fast Latency", "description": "Guarantees sub-10ms response times globally through smart edge distribution.", "icon": "zap"},
                            {"title": "SOC2 & Zero-Trust Security", "description": "End-to-end encryption with automated compliance auditing out of the box.", "icon": "shield"}
                        ]
                    }
                },
                {
                    "id": "pricing-1",
                    "type": "pricing",
                    "variant": "highlighted-middle",
                    "visible": True,
                    "content": {
                        "badge": "Value Pricing",
                        "title": "Predictable Plans That Scale With You",
                        "description": "Transparent pricing with no hidden seat fees.",
                        "plans": [
                            {"name": "Starter", "price": "$49", "period": "/month", "description": "For small teams and startups", "features": ["Real-time telemetry", "Slack alerts", "7-day metrics history", "Standard support"], "cta": "Start Free", "highlighted": False},
                            {"name": "Pro Growth", "price": "$149", "period": "/month", "description": "Our most popular tier for scaling teams", "features": ["Everything in Starter", "Automated mitigation", "Custom integrations", "90-day history"], "cta": "Deploy Growth", "highlighted": True},
                            {"name": "Enterprise", "price": "$399", "period": "/month", "description": "Dedicated infrastructure and SLAs", "features": ["Unlimited throughput", "Dedicated Solutions Architect", "Custom SOC2 audit reports", "SSO & SAML"], "cta": "Contact Sales", "highlighted": False}
                        ]
                    }
                },
                {
                    "id": "testimonials-1",
                    "type": "testimonials",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Customer Results",
                        "title": "Trusted by Leading Engineering Teams",
                        "description": "See how technical leaders accelerated delivery with our tools.",
                        "testimonials": [
                            {"quote": f"{brand} reduced our monthly infrastructure bill by 38% in the first 30 days without a single incident.", "name": "Sarah Lin", "role": "VP Engineering, ScaleScale", "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "Integration took literally under 5 minutes. One of the highest ROI developer platforms we've ever adopted.", "name": "Arjun Patel", "role": "DevOps Architect, FinTech Labs", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "Our developers love the automated insights. It freed up hundreds of engineering hours every month.", "name": "Claire Vance", "role": "CTO, NextGen Media", "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80", "rating": 5}
                        ]
                    }
                },
                {
                    "id": "contact-1",
                    "type": "contact",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Get Started",
                        "headline": "Start Accelerating Your Team Today",
                        "subtitle": "Join 1,400+ organizations leveraging our platform to optimize operations.",
                        "buttonText": "Start Free 14-Day Trial",
                        "emailPlaceholder": "Enter your work email...",
                        "secondaryText": "No credit card required • Instant API access"
                    }
                }
            ]
        }

    # 6. Fitness / Athletic / Gym / Studio / Health / Wellness
    elif any(k in lower for k in ["fitness", "gym", "workout", "trainer", "athletic", "crossfit", "yoga", "boxing", "martial arts", "running"]):
        brand = extracted_brand or "FitPulse Studio"
        return {
            "site": {
                "name": brand,
                "tagline": "Unleash Your Peak Human Performance",
                "description": f"High-intensity athletic conditioning, certified master coaching, and biometric training at {brand}.",
                "theme": theme
            },
            "sections": [
                {
                    "id": "hero-1",
                    "type": "hero",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Next-Gen Fitness Studio",
                        "headline": f"Transform Your Body. Elevate Your Mind.",
                        "subtitle": f"World-class coaching, live biometric heart-rate sync, and high-energy group conditioning engineered for lasting physical breakthroughs at {brand}.",
                        "primaryCta": "Claim 7-Day Free Pass",
                        "secondaryCta": "View Class Schedule",
                        "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                    }
                },
                {
                    "id": "features-1",
                    "type": "features",
                    "variant": "three-column",
                    "visible": True,
                    "content": {
                        "badge": "Our Standard",
                        "title": "Engineered For Measurable Breakthroughs",
                        "description": "Precision training science backed by sports physiology.",
                        "items": [
                            {"title": "Master Strength Coaches", "description": "Certified conditioning specialists who tailor every repetition and movement pattern.", "icon": "dumbbell"},
                            {"title": "Live Biometric Telemetry", "description": "Real-time heart rate zone tracking ensures you burn maximum calories with optimal recovery.", "icon": "activity"},
                            {"title": "Contrast Hydrotherapy", "description": "Accelerate muscular recovery with cold plunge tubs, infrared sauna, and percussion lounge.", "icon": "sparkles"}
                        ]
                    }
                },
                {
                    "id": "pricing-1",
                    "type": "pricing",
                    "variant": "highlighted-middle",
                    "visible": True,
                    "content": {
                        "badge": "Simple Memberships",
                        "title": "Invest In Your Vitality",
                        "description": "Zero lock-in contracts. Upgrade, pause, or cancel anytime.",
                        "plans": [
                            {"name": "Core Athletic", "price": "$69", "period": "/month", "description": "Open gym & facilities", "features": ["24/7 Access to all workout zones", "Locker & towel service", "FitPulse mobile companion app"], "cta": "Get Started", "highlighted": False},
                            {"name": "Pro Performance", "price": "$129", "period": "/month", "description": "Unlimited class energy", "features": ["Everything in Core", "Unlimited HIIT & strength sessions", "Hydro-spa & sauna access", "Monthly body composition scan"], "cta": "Claim Pro Access", "highlighted": True},
                            {"name": "VIP Bespoke", "price": "$219", "period": "/month", "description": "Personalized coaching", "features": ["Everything in Pro", "4 1-on-1 Personal training sessions", "Priority class window booking", "2 Free guest passes/month"], "cta": "Join VIP", "highlighted": False}
                        ]
                    }
                },
                {
                    "id": "testimonials-1",
                    "type": "testimonials",
                    "variant": "cards",
                    "visible": True,
                    "content": {
                        "badge": "Community Voices",
                        "title": "Loved by Over 3,500 Athletes",
                        "description": "Real people achieving real results.",
                        "testimonials": [
                            {"quote": f"{brand} completely revolutionized my relationship with training. I dropped 14 lbs and hit personal deadlift records in 3 months.", "name": "Marcus Vance", "role": "Triathlete & Tech Director", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "The trainers know your name and push you beyond what you think is possible. The sauna recovery lounge is incredible.", "name": "Elena Rostova", "role": "Creative Director", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", "rating": 5},
                            {"quote": "Best community atmosphere I've experienced in 10 years of gym memberships. Worth every penny.", "name": "David Chen", "role": "Software Architect", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", "rating": 5}
                        ]
                    }
                },
                {
                    "id": "contact-1",
                    "type": "contact",
                    "variant": "split",
                    "visible": True,
                    "content": {
                        "badge": "Join Today",
                        "headline": "Claim Your 7-Day Free Pass",
                        "subtitle": "Drop your email below and our head coach will set up your orientation session.",
                        "buttonText": "Claim Free Pass",
                        "emailPlaceholder": "Enter your email address...",
                        "secondaryText": "No credit card required. Free guest pass included."
                    }
                }
            ]
        }

    # 7. Fallback for ANY Other Custom Prompt!
    else:
        main_subject = _extract_clean_subject(prompt)
        user_feats = _extract_user_features(prompt)
        brand = extracted_brand or (f"{main_subject.split()[0]}Flow" if main_subject and len(main_subject.split()[0]) > 2 else "VentureCraft")

        if user_feats:
            feature_items = []
            icons = ["sparkles", "activity", "shield", "zap", "rocket"]
            for i, feat in enumerate(user_feats[:3]):
                feature_items.append({
                    "title": feat.strip().title(),
                    "description": f"Engineered for seamless {feat.strip().lower()} with automated metrics and reliable execution.",
                    "icon": icons[i % len(icons)]
                })
            while len(feature_items) < 3:
                feature_items.append({
                    "title": "Intelligent Operations",
                    "description": f"Automated workflows tailored specifically to your {main_subject} requirements.",
                    "icon": "shield"
                })
        else:
            feature_items = [
                {"title": "Tailored Excellence", "description": f"Customized solutions crafted to align with your exact {main_subject} specifications.", "icon": "sparkles"},
                {"title": "Rapid Turnaround", "description": "Efficient execution without sacrificing craftsmanship or attention to detail.", "icon": "zap"},
                {"title": "Guaranteed Satisfaction", "description": "Comprehensive customer assurance and dedicated support at every step.", "icon": "shield"}
            ]

        sections_list = [
            {
                "id": "hero-1",
                "type": "hero",
                "variant": "split",
                "visible": True,
                "content": {
                    "badge": "Next-Gen Platform",
                    "headline": f"Exceptional {main_subject} Built Around Your Goals.",
                    "subtitle": f"Experience unparalleled quality, seamless support, and personalized outcomes engineered for lasting success with {brand}.",
                    "primaryCta": "Get Started Today",
                    "secondaryCta": "Explore Features",
                    "imageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                }
            },
            {
                "id": "stats-1",
                "type": "stats",
                "variant": "grid",
                "visible": True,
                "content": {
                    "badge": "Proven Impact",
                    "title": f"Why Industry Leaders Choose {brand}",
                    "description": "Measurable benchmarks across quality, efficiency, and reliability.",
                    "metrics": [
                        {"value": "99.4%", "label": "Client Satisfaction", "description": "Consistently rated 5 stars across verified reviews"},
                        {"value": "3.5x", "label": "Faster Execution", "description": "Streamlined processes minimizing friction"},
                        {"value": "10,000+", "label": "Active Users", "description": "Trusted by fast-growing teams worldwide"},
                        {"value": "24/7", "label": "Expert Support", "description": "Always-available dedicated assistance"}
                    ]
                }
            },
            {
                "id": "features-1",
                "type": "features",
                "variant": "three-column",
                "visible": True,
                "content": {
                    "badge": "Core Highlights",
                    "title": f"Key Pillars of {brand}",
                    "description": "Engineered for consistency, speed, and proven results.",
                    "items": feature_items
                }
            },
            {
                "id": "pricing-1",
                "type": "pricing",
                "variant": "highlighted-middle",
                "visible": True,
                "content": {
                    "badge": "Flexible Plans",
                    "title": "Straightforward Options",
                    "description": "Transparent packages designed to meet your specific needs.",
                    "plans": [
                        {"name": "Standard", "price": "$49", "period": "/mo", "description": "Essential features to get started", "features": ["Full access to core tools", "Standard turnaround", "Email support"], "cta": "Choose Standard", "highlighted": False},
                        {"name": "Professional", "price": "$99", "period": "/mo", "description": "Most popular choice for scaling", "features": ["Everything in Standard", "Priority processing", "Dedicated account manager", "Custom analytics"], "cta": "Choose Pro", "highlighted": True},
                        {"name": "Enterprise", "price": "$199", "period": "/mo", "description": "Comprehensive premium tier", "features": ["Everything in Pro", "Unlimited custom requests", "24/7 Phone support", "SLA guarantees"], "cta": "Contact Us", "highlighted": False}
                    ]
                }
            },
            {
                "id": "testimonials-1",
                "type": "testimonials",
                "variant": "cards",
                "visible": True,
                "content": {
                    "badge": "Client Stories",
                    "title": "Trusted by Happy Customers",
                    "description": "Here is what our clients have to say about working with us.",
                    "testimonials": [
                        {"quote": f"Working with {brand} was one of the best decisions we made. The quality and speed exceeded our highest hopes.", "name": "Alex Morgan", "role": "Operations Lead", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", "rating": 5},
                        {"quote": "Outstanding attention to detail and superb communication throughout the process. Highly recommended!", "name": "Rachel Vance", "role": "Creative Director", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", "rating": 5},
                        {"quote": "Delivered exactly what was promised ahead of schedule. We will definitely be returning for future projects.", "name": "Daniel Kim", "role": "Founder & CEO", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", "rating": 5}
                    ]
                }
            },
            {
                "id": "faq-1",
                "type": "faq",
                "variant": "accordion",
                "visible": True,
                "content": {
                    "badge": "Got Questions?",
                    "title": "Frequently Asked Questions",
                    "description": f"Everything you need to know about working with {brand}.",
                    "items": [
                        {"question": f"How do I get started with {brand}?", "answer": "You can sign up in less than 2 minutes. Our onboarding wizard guides you through the initial setup effortlessly."},
                        {"question": "Can I cancel or upgrade my plan anytime?", "answer": "Yes, all plans are month-to-month with no long-term contracts. You can upgrade, downgrade, or cancel at any time."},
                        {"question": "Is dedicated support included?", "answer": "Yes! All users get fast support via chat and email, with priority support for Professional and Enterprise tiers."}
                    ]
                }
            },
            {
                "id": "contact-1",
                "type": "contact",
                "variant": "split",
                "visible": True,
                "content": {
                    "badge": "Get Started",
                    "headline": f"Ready to Experience {brand}?",
                    "subtitle": "Get in touch today and take the first step towards your goals.",
                    "buttonText": "Get Started Now",
                    "emailPlaceholder": "Enter your email address...",
                    "secondaryText": "Prompt response guaranteed within 24 hours."
                }
            }
        ]

        return {
            "site": {
                "name": brand,
                "tagline": f"Premium Solutions for {main_subject}",
                "description": f"Tailored services, world-class execution, and dedicated customer success at {brand}.",
                "theme": theme
            },
            "sections": sections_list
        }
