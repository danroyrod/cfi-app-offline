"""
Generate inline SVG content for diagrams that currently lack visual representation.
Uses existing description, asciiArt, and keyPoints to create informative SVG diagrams.
"""
import json
import re
from pathlib import Path

SRC_FILE = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\src\lessonPlansData.json")
OUTPUT_FILE = Path(r"C:\Users\danrr\OneDrive - amazon.com\Desktop\CFI\cfi-app-offline\scripts\enrichment-output\lessonPlansData_with_svgs.json")


def escape_svg_text(text):
    """Escape special characters for SVG text elements."""
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&apos;")


def wrap_text(text, max_chars=40):
    """Split text into lines for SVG rendering."""
    words = text.split()
    lines = []
    current_line = ""
    for word in words:
        if len(current_line) + len(word) + 1 <= max_chars:
            current_line += (" " + word) if current_line else word
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    return lines


def generate_overview_svg(diagram):
    """Generate SVG for overview/concept diagrams (hierarchies, frameworks)."""
    title = escape_svg_text(diagram.get("title", ""))
    key_points = diagram.get("keyPoints", [])
    description = diagram.get("description", "")

    if not key_points:
        # Use description split into points
        key_points = [s.strip() for s in description.split(".") if s.strip() and len(s.strip()) > 10][:6]

    num_points = min(len(key_points), 6)
    height = 80 + num_points * 50
    width = 500

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" style="font-family: -apple-system, sans-serif;">',
        f'  <rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'  <rect x="10" y="10" width="{width-20}" height="50" fill="#1e40af" rx="6"/>',
        f'  <text x="{width//2}" y="42" text-anchor="middle" fill="white" font-size="14" font-weight="bold">{title}</text>',
    ]

    y = 80
    for i, point in enumerate(key_points[:6]):
        text = escape_svg_text(point[:65])
        color = "#3b82f6" if i % 2 == 0 else "#60a5fa"
        svg_parts.append(f'  <rect x="20" y="{y}" width="{width-40}" height="40" fill="{color}" opacity="0.1" rx="4"/>')
        svg_parts.append(f'  <circle cx="35" cy="{y+20}" r="8" fill="{color}"/>')
        svg_parts.append(f'  <text x="35" y="{y+24}" text-anchor="middle" fill="white" font-size="10" font-weight="bold">{i+1}</text>')
        svg_parts.append(f'  <text x="52" y="{y+25}" fill="#1f2937" font-size="12">{text}</text>')
        y += 50

    svg_parts.append("</svg>")
    return "\n".join(svg_parts)


def generate_safety_svg(diagram):
    """Generate SVG for safety diagrams (checklists, hazards)."""
    title = escape_svg_text(diagram.get("title", ""))
    key_points = diagram.get("keyPoints", [])

    if not key_points:
        key_points = [s.strip() for s in diagram.get("description", "").split(".") if s.strip()][:6]

    num_points = min(len(key_points), 6)
    height = 80 + num_points * 45
    width = 480

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" style="font-family: -apple-system, sans-serif;">',
        f'  <rect width="{width}" height="{height}" fill="#fffbeb" rx="8" stroke="#f59e0b" stroke-width="2"/>',
        f'  <rect x="10" y="10" width="{width-20}" height="50" fill="#dc2626" rx="6"/>',
        f'  <text x="40" y="42" fill="white" font-size="18">⚠️</text>',
        f'  <text x="{width//2 + 10}" y="42" text-anchor="middle" fill="white" font-size="14" font-weight="bold">{title}</text>',
    ]

    y = 75
    for i, point in enumerate(key_points[:6]):
        text = escape_svg_text(point[:60])
        svg_parts.append(f'  <text x="30" y="{y+15}" fill="#dc2626" font-size="14">●</text>')
        svg_parts.append(f'  <text x="48" y="{y+15}" fill="#1f2937" font-size="12">{text}</text>')
        y += 45

    svg_parts.append("</svg>")
    return "\n".join(svg_parts)


def generate_maneuver_profile_svg(diagram):
    """Generate SVG for maneuver profiles (flight paths, turns, etc.)."""
    title = escape_svg_text(diagram.get("title", ""))
    key_points = diagram.get("keyPoints", [])
    description = diagram.get("description", "")

    height = 300
    width = 550

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" style="font-family: -apple-system, sans-serif;">',
        f'  <rect width="{width}" height="{height}" fill="#f0f9ff" rx="8"/>',
        # Sky gradient
        f'  <rect x="10" y="50" width="{width-20}" height="200" fill="#e0f2fe" rx="4"/>',
        # Ground line
        f'  <line x1="10" y1="250" x2="{width-10}" y2="250" stroke="#86efac" stroke-width="3"/>',
        f'  <rect x="10" y="250" width="{width-20}" height="40" fill="#dcfce7" rx="0"/>',
        # Title
        f'  <rect x="10" y="5" width="{width-20}" height="35" fill="#1e40af" rx="4"/>',
        f'  <text x="{width//2}" y="28" text-anchor="middle" fill="white" font-size="13" font-weight="bold">{title}</text>',
        # Maneuver path (generic arc)
        f'  <path d="M 80 230 Q 180 80 280 120 Q 380 160 480 230" fill="none" stroke="#1e40af" stroke-width="3" stroke-dasharray="5,3"/>',
        # Entry arrow
        f'  <polygon points="75,230 85,230 80,220" fill="#1e40af"/>',
        f'  <text x="60" y="245" fill="#1e40af" font-size="10" font-weight="bold">Entry</text>',
        # Exit
        f'  <polygon points="475,230 485,230 480,220" fill="#16a34a"/>',
        f'  <text x="465" y="245" fill="#16a34a" font-size="10" font-weight="bold">Exit</text>',
    ]

    # Add key points as annotations
    y = 260
    for i, point in enumerate(key_points[:3]):
        text = escape_svg_text(point[:55])
        svg_parts.append(f'  <text x="20" y="{y + i*14}" fill="#64748b" font-size="9">{text}</text>')

    svg_parts.append("</svg>")
    return "\n".join(svg_parts)


def generate_takeoff_profile_svg(diagram):
    """Generate SVG for takeoff profiles."""
    title = escape_svg_text(diagram.get("title", ""))
    key_points = diagram.get("keyPoints", [])

    height = 280
    width = 550

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" style="font-family: -apple-system, sans-serif;">',
        f'  <rect width="{width}" height="{height}" fill="#f0f9ff" rx="8"/>',
        # Title
        f'  <rect x="10" y="5" width="{width-20}" height="35" fill="#16a34a" rx="4"/>',
        f'  <text x="{width//2}" y="28" text-anchor="middle" fill="white" font-size="13" font-weight="bold">{title}</text>',
        # Sky
        f'  <rect x="10" y="45" width="{width-20}" height="185" fill="#e0f2fe" rx="4"/>',
        # Runway
        f'  <rect x="10" y="230" width="200" height="8" fill="#6b7280"/>',
        f'  <line x1="20" y1="234" x2="200" y2="234" stroke="white" stroke-width="1" stroke-dasharray="10,8"/>',
        # Takeoff path
        f'  <path d="M 200 230 Q 280 200 350 160 L 500 80" fill="none" stroke="#16a34a" stroke-width="3"/>',
        # Rotation point
        f'  <circle cx="200" cy="230" r="5" fill="#f59e0b"/>',
        f'  <text x="185" y="250" fill="#f59e0b" font-size="9" font-weight="bold">Rotate</text>',
        # Climb
        f'  <text x="380" y="100" fill="#16a34a" font-size="10">Climb</text>',
        # Ground
        f'  <rect x="10" y="238" width="{width-20}" height="35" fill="#dcfce7"/>',
    ]

    # Key points
    y = 250
    for i, point in enumerate(key_points[:2]):
        text = escape_svg_text(point[:55])
        svg_parts.append(f'  <text x="20" y="{y + i*14}" fill="#64748b" font-size="9">{text}</text>')

    svg_parts.append("</svg>")
    return "\n".join(svg_parts)


def generate_landing_profile_svg(diagram):
    """Generate SVG for landing/approach profiles."""
    title = escape_svg_text(diagram.get("title", ""))
    key_points = diagram.get("keyPoints", [])

    height = 280
    width = 550

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" style="font-family: -apple-system, sans-serif;">',
        f'  <rect width="{width}" height="{height}" fill="#f0f9ff" rx="8"/>',
        # Title
        f'  <rect x="10" y="5" width="{width-20}" height="35" fill="#7c3aed" rx="4"/>',
        f'  <text x="{width//2}" y="28" text-anchor="middle" fill="white" font-size="13" font-weight="bold">{title}</text>',
        # Sky
        f'  <rect x="10" y="45" width="{width-20}" height="185" fill="#e0f2fe" rx="4"/>',
        # Glidepath
        f'  <path d="M 60 80 L 350 210 L 500 230" fill="none" stroke="#7c3aed" stroke-width="3"/>',
        # VASI/PAPI indication
        f'  <line x1="350" y1="210" x2="350" y2="240" stroke="#dc2626" stroke-width="1" stroke-dasharray="3,2"/>',
        f'  <text x="340" y="250" fill="#dc2626" font-size="9">Threshold</text>',
        # Runway
        f'  <rect x="340" y="230" width="190" height="8" fill="#6b7280"/>',
        f'  <line x1="350" y1="234" x2="520" y2="234" stroke="white" stroke-width="1" stroke-dasharray="10,8"/>',
        # Touchdown
        f'  <circle cx="400" cy="230" r="4" fill="#f59e0b"/>',
        f'  <text x="385" y="250" fill="#f59e0b" font-size="9">Touchdown</text>',
        # Ground
        f'  <rect x="10" y="238" width="{width-20}" height="35" fill="#dcfce7"/>',
        # Aiming point
        f'  <text x="60" y="75" fill="#7c3aed" font-size="10">Approach</text>',
    ]

    y = 255
    for i, point in enumerate(key_points[:2]):
        text = escape_svg_text(point[:55])
        svg_parts.append(f'  <text x="20" y="{y + i*14}" fill="#64748b" font-size="9">{text}</text>')

    svg_parts.append("</svg>")
    return "\n".join(svg_parts)


def generate_basic_svg(diagram):
    """Generate SVG for basic/comparison diagrams."""
    title = escape_svg_text(diagram.get("title", ""))
    key_points = diagram.get("keyPoints", [])
    ascii_art = diagram.get("asciiArt", "")

    if not key_points:
        key_points = [s.strip() for s in diagram.get("description", "").split(".") if s.strip() and len(s.strip()) > 10][:6]

    num_points = min(len(key_points), 6)
    height = 80 + num_points * 45
    width = 500

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" style="font-family: -apple-system, sans-serif;">',
        f'  <rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'  <rect x="10" y="10" width="{width-20}" height="45" fill="#3b82f6" rx="6"/>',
        f'  <text x="{width//2}" y="38" text-anchor="middle" fill="white" font-size="13" font-weight="bold">{title}</text>',
    ]

    y = 70
    for i, point in enumerate(key_points[:6]):
        text = escape_svg_text(point[:60])
        bg_color = "#eff6ff" if i % 2 == 0 else "#f8fafc"
        svg_parts.append(f'  <rect x="15" y="{y}" width="{width-30}" height="38" fill="{bg_color}" rx="4"/>')
        svg_parts.append(f'  <text x="30" y="{y+24}" fill="#1e40af" font-size="12" font-weight="bold">→</text>')
        svg_parts.append(f'  <text x="48" y="{y+24}" fill="#1f2937" font-size="11">{text}</text>')
        y += 45

    svg_parts.append("</svg>")
    return "\n".join(svg_parts)


def generate_procedure_flow_svg(diagram):
    """Generate SVG for procedure/flowchart diagrams."""
    title = escape_svg_text(diagram.get("title", ""))
    key_points = diagram.get("keyPoints", [])

    if not key_points:
        key_points = [s.strip() for s in diagram.get("description", "").split(".") if s.strip()][:5]

    num_steps = min(len(key_points), 5)
    height = 80 + num_steps * 60
    width = 480

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" style="font-family: -apple-system, sans-serif;">',
        f'  <rect width="{width}" height="{height}" fill="#f8fafc" rx="8"/>',
        f'  <rect x="10" y="10" width="{width-20}" height="45" fill="#059669" rx="6"/>',
        f'  <text x="{width//2}" y="38" text-anchor="middle" fill="white" font-size="13" font-weight="bold">{title}</text>',
    ]

    y = 75
    for i, point in enumerate(key_points[:5]):
        text = escape_svg_text(point[:50])
        # Step box
        svg_parts.append(f'  <rect x="60" y="{y}" width="{width-120}" height="35" fill="#ecfdf5" stroke="#059669" stroke-width="1.5" rx="4"/>')
        svg_parts.append(f'  <circle cx="35" cy="{y+17}" r="13" fill="#059669"/>')
        svg_parts.append(f'  <text x="35" y="{y+22}" text-anchor="middle" fill="white" font-size="11" font-weight="bold">{i+1}</text>')
        svg_parts.append(f'  <text x="75" y="{y+22}" fill="#1f2937" font-size="11">{text}</text>')
        # Arrow between steps
        if i < num_steps - 1:
            svg_parts.append(f'  <line x1="35" y1="{y+35}" x2="35" y2="{y+55}" stroke="#059669" stroke-width="2"/>')
            svg_parts.append(f'  <polygon points="30,{y+52} 40,{y+52} 35,{y+58}" fill="#059669"/>')
        y += 60

    svg_parts.append("</svg>")
    return "\n".join(svg_parts)


# Type to generator mapping
SVG_GENERATORS = {
    "overview": generate_overview_svg,
    "safety": generate_safety_svg,
    "maneuver-profile": generate_maneuver_profile_svg,
    "takeoff-profile": generate_takeoff_profile_svg,
    "landing-profile": generate_landing_profile_svg,
    "landing-sequence": generate_landing_profile_svg,
    "basic": generate_basic_svg,
    "comparison": generate_basic_svg,
    "performance": generate_basic_svg,
    "procedure-flow": generate_procedure_flow_svg,
    "flowchart": generate_procedure_flow_svg,
    "checklist": generate_safety_svg,
}


def main():
    print("=" * 60)
    print("SVG DIAGRAM GENERATOR")
    print("=" * 60)

    with open(SRC_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    plans = data["lessonPlans"]
    generated = 0
    skipped = 0
    already_has = 0

    for plan in plans:
        diagrams = plan.get("diagrams", [])
        for diagram in diagrams:
            svg = diagram.get("svgContent", "") or diagram.get("svg", "")
            if svg:
                already_has += 1
                continue

            dtype = diagram.get("type", "basic")
            generator = SVG_GENERATORS.get(dtype, generate_basic_svg)

            try:
                svg_content = generator(diagram)
                diagram["svgContent"] = svg_content
                generated += 1
            except Exception as e:
                print(f"  Error generating SVG for [{plan['id']}] {diagram.get('title', '')}: {e}")
                skipped += 1

    # Save output
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n  Already had SVG: {already_has}")
    print(f"  Generated new SVGs: {generated}")
    print(f"  Skipped (errors): {skipped}")
    print(f"\n  Output: {OUTPUT_FILE}")
    print(f"  Size: {OUTPUT_FILE.stat().st_size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
