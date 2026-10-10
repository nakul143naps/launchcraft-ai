from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field

class EnhancePromptRequest(BaseModel):
    prompt: str = Field(..., min_length=2, description="The raw user description for the website")

class EnhancePromptResponse(BaseModel):
    enhancedPrompt: str = Field(..., description="Refined, structured prompt including target audience and sections")

class RectifierAudit(BaseModel):
    alignmentScore: int = Field(default=98, description="Percentage prompt alignment score")
    status: str = Field(default="VERIFIED", description="Audit evaluation status")
    requirementsDetected: List[str] = Field(default_factory=list, description="Extracted prompt requirements")
    rectifiedFeatures: List[str] = Field(default_factory=list, description="Verified or injected requirements")
    summary: str = Field(default="All requested features successfully audited and aligned.", description="Audit summary")

class Section(BaseModel):
    id: str = Field(..., description="Unique section identifier, e.g., 'hero-1'")
    type: Literal["hero", "stats", "features", "showcase", "steps", "pricing", "testimonials", "faq", "contact"] = Field(..., description="Type of section")
    variant: str = Field(..., description="Layout variant, e.g., 'split', 'three-column', etc.")
    visible: bool = Field(default=True, description="Whether the section is rendered")
    title: Optional[str] = Field(default=None, description="Custom section display name")
    customLabel: Optional[str] = Field(default=None, description="User-assigned section tab label")
    content: Dict[str, Any] = Field(default_factory=dict, description="Section specific content properties")

class SiteMeta(BaseModel):
    name: str = Field(default="My Website", description="Brand or company name")
    description: Optional[str] = Field(default="", description="Brief summary of the business")
    tagline: Optional[str] = Field(default="", description="Catchy tagline")
    theme: str = Field(default="bright", description="Global color/typography theme")
    rectifierAudit: Optional[RectifierAudit] = None

class SiteConfig(BaseModel):
    site: SiteMeta
    sections: List[Section]

class GeneratePageRequest(BaseModel):
    prompt: str = Field(..., min_length=2)
    theme: Optional[str] = "bright"

class RegenerateSectionRequest(BaseModel):
    site: SiteConfig
    sectionId: str
    instruction: str

class HealthResponse(BaseModel):
    status: str
    gemini_available: bool
    model: str
