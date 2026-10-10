import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    print("[PASS] Health check endpoint passed")

def test_enhance_prompt():
    res = client.post("/api/enhance-prompt", json={"prompt": "A coffee shop in Seattle"})
    assert res.status_code == 200
    data = res.json()
    assert "enhancedPrompt" in data
    assert len(data["enhancedPrompt"]) > 10
    print("[PASS] Enhance prompt endpoint passed")

def test_generate_page():
    res = client.post("/api/generate-page", json={"prompt": "Fitness studio with membership plans", "theme": "bold"})
    assert res.status_code == 200
    data = res.json()
    assert "site" in data
    assert "sections" in data
    assert len(data["sections"]) >= 4
    print("[PASS] Generate page endpoint passed")
    return data

def test_regenerate_section(site_data):
    hero_sec = next(s for s in site_data["sections"] if s["type"] == "hero")
    res = client.post("/api/regenerate-section", json={
        "site": site_data,
        "sectionId": hero_sec["id"],
        "instruction": "Make headline punchier"
    })
    assert res.status_code == 200
    sec = res.json()
    assert sec["id"] == hero_sec["id"]
    print("[PASS] Regenerate section endpoint passed")

def test_export_react(site_data):
    res = client.post("/api/export/react", json=site_data)
    assert res.status_code == 200
    assert len(res.content) > 100
    print("[PASS] Export React ZIP endpoint passed")

def test_export_html(site_data):
    res = client.post("/api/export/html", json=site_data)
    assert res.status_code == 200
    assert "<!DOCTYPE html>" in res.text
    print("[PASS] Export HTML endpoint passed")

if __name__ == "__main__":
    test_health()
    test_enhance_prompt()
    site = test_generate_page()
    test_regenerate_section(site)
    test_export_react(site)
    test_export_html(site)
    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")
