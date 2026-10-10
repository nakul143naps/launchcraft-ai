from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, Response
import json
import os
from fastapi.staticfiles import StaticFiles

from schemas import (
    EnhancePromptRequest,
    EnhancePromptResponse,
    GeneratePageRequest,
    RegenerateSectionRequest,
    SiteConfig,
    Section,
    HealthResponse
)
from ai_service import (
    is_gemini_configured,
    enhance_prompt_service,
    generate_page_service,
    regenerate_section_service,
    get_gemini_model
)
from export_service import create_react_zip_buffer, create_standalone_html

app = FastAPI(
    title="LaunchCraft AI Backend",
    description="Backend API for prompt enhancement, structured landing page generation, and export services.",
    version="1.0.0"
)

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Returns backend status and AI provider readiness."""
    return HealthResponse(
        status="ok",
        gemini_available=is_gemini_configured(),
        model=get_gemini_model()
    )

@app.post("/api/enhance-prompt", response_model=EnhancePromptResponse)
def enhance_prompt(req: EnhancePromptRequest):
    """Enhances the user's natural language website description."""
    try:
        enhanced = enhance_prompt_service(req.prompt)
        return EnhancePromptResponse(enhancedPrompt=enhanced)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prompt enhancement failed: {str(e)}"
        )

@app.post("/api/generate-page", response_model=SiteConfig)
def generate_page(req: GeneratePageRequest):
    """Generates the full validated structured landing page JSON."""
    try:
        raw_config = generate_page_service(req.prompt, req.theme or "bright")
        # Validate against strict Pydantic model
        site_config = SiteConfig(**raw_config)
        return site_config
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Page generation failed: {str(e)}"
        )

@app.post("/api/regenerate-section", response_model=Section)
def regenerate_section(req: RegenerateSectionRequest):
    """Regenerates a single section without altering the rest of the site."""
    try:
        raw_section = regenerate_section_service(
            req.site.model_dump(),
            req.sectionId,
            req.instruction
        )
        validated_sec = Section(**raw_section)
        return validated_sec
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Section regeneration failed: {str(e)}"
        )

@app.post("/api/export/react")
def export_react_zip(site_config: SiteConfig):
    """Builds and returns a runnable React + Vite project in a ZIP archive."""
    try:
        buf = create_react_zip_buffer(site_config.model_dump())
        filename = f"{(site_config.site.name or 'launchcraft').lower().replace(' ', '-')}.zip"
        return StreamingResponse(
            buf,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"React export failed: {str(e)}"
        )

@app.post("/api/export/html")
def export_standalone_html(site_config: SiteConfig):
    """Builds and returns a standalone HTML page."""
    try:
        html_str = create_standalone_html(site_config.model_dump())
        return Response(content=html_str, media_type="text/html")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"HTML export failed: {str(e)}"
        )

# Optional: mount built static frontend if present (enables single-service deployment on Render)
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "127.0.0.1")
    uvicorn.run("main:app", host=host, port=port, reload=True)
