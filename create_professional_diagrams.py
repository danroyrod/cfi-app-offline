#!/usr/bin/env python3
"""
Create professional SVG diagrams for CFI lesson plans based on industry standards.
Includes ground reference maneuvers, attitude indicators, and flight path diagrams.
"""

import json
import re
from typing import Dict, Any, List

def create_attitude_indicator_svg(bank_angle: float = 0, pitch_angle: float = 0, title: str = "Attitude Indicator") -> str:
    """Create an attitude indicator diagram showing bank and pitch."""
    # Clamp values
    bank_angle = max(-60, min(60, bank_angle))
    pitch_angle = max(-30, min(30, pitch_angle))
    
    # Calculate positions
    center_x, center_y = 200, 200
    radius = 150
    
    # Rotate horizon line based on pitch
    pitch_offset = pitch_angle * 2  # Scale for visibility
    
    # Calculate horizon line endpoints with rotation
    import math
    bank_rad = math.radians(bank_angle)
    cos_bank = math.cos(bank_rad)
    sin_bank = math.sin(bank_rad)
    
    svg = f'''<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#8B7355;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Outer ring -->
  <circle cx="{center_x}" cy="{center_y}" r="{radius}" fill="#2C3E50" stroke="#34495E" stroke-width="3"/>
  
  <!-- Inner background -->
  <circle cx="{center_x}" cy="{center_y}" r="{radius - 10}" fill="#ECF0F1" stroke="#BDC3C7" stroke-width="2"/>
  
  <g transform="rotate({bank_angle} {center_x} {center_y})">
    <!-- Sky (upper portion) -->
    <path d="M {center_x - radius} {center_y - pitch_offset} L {center_x + radius} {center_y - pitch_offset} L {center_x + radius} {center_y - radius} L {center_x - radius} {center_y - radius} Z" 
          fill="url(#skyGrad)"/>
    
    <!-- Ground (lower portion) -->
    <path d="M {center_x - radius} {center_y - pitch_offset} L {center_x + radius} {center_y - pitch_offset} L {center_x + radius} {center_y + radius} L {center_x - radius} {center_y + radius} Z" 
          fill="url(#groundGrad)"/>
    
    <!-- Horizon line -->
    <line x1="{center_x - radius}" y1="{center_y - pitch_offset}" 
          x2="{center_x + radius}" y2="{center_y - pitch_offset}" 
          stroke="#E74C3C" stroke-width="4"/>
    
    <!-- Pitch lines (every 5 degrees) -->
    {generate_pitch_lines(center_x, center_y, pitch_offset, radius)}
  </g>
  
  <!-- Aircraft symbol (always level with instrument) -->
  <path d="M {center_x - 40} {center_y - 5} L {center_x} {center_y - 15} L {center_x + 40} {center_y - 5} L {center_x + 20} {center_y} L {center_x - 20} {center_y} Z" 
        fill="#2C3E50" stroke="#34495E" stroke-width="2"/>
  
  <!-- Bank angle indicator marks (every 10 degrees) -->
  {generate_bank_marks(center_x, center_y, radius, bank_angle)}
  
  <!-- Title -->
  <text x="{center_x}" y="30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    {title}
  </text>
  
  <!-- Bank angle text -->
  <text x="{center_x}" y="370" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50">
    Bank: {bank_angle:+.0f}°
  </text>
  
  <!-- Pitch angle text -->
  <text x="{center_x}" y="385" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50">
    Pitch: {pitch_angle:+.0f}°
  </text>
</svg>'''
    return svg

def generate_pitch_lines(center_x: float, center_y: float, pitch_offset: float, radius: float) -> str:
    """Generate pitch reference lines."""
    lines = []
    import math
    for degrees in range(-30, 35, 5):
        if degrees == 0:
            continue  # Skip center line, already drawn
        y_pos = center_y - pitch_offset + (degrees * 8)  # Scale: 8px per degree
        if center_y - radius < y_pos < center_y + radius:
            length = 60 if abs(degrees) % 10 == 0 else 30
            lines.append(
                f'<line x1="{center_x - length}" y1="{y_pos}" x2="{center_x + length}" y2="{y_pos}" '
                f'stroke="{(255, 0, 0) if abs(degrees) % 10 == 0 else (200, 0, 0)}" stroke-width="{(2 if abs(degrees) % 10 == 0 else 1)}" opacity="0.7"/>'
            )
            if abs(degrees) % 10 == 0:
                # Add degree labels
                lines.append(
                    f'<text x="{center_x - length - 15}" y="{y_pos + 4}" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">{-degrees}</text>'
                )
    return '\n    '.join(lines)

def generate_bank_marks(center_x: float, center_y: float, radius: float, bank_angle: float) -> str:
    """Generate bank angle marks around the instrument."""
    marks = []
    import math
    for degrees in [10, 20, 30, 45, 60]:
        for side in [-1, 1]:
            angle_rad = math.radians(side * degrees)
            x1 = center_x + (radius - 15) * math.sin(angle_rad)
            y1 = center_y - (radius - 15) * math.cos(angle_rad)
            x2 = center_x + (radius - 5) * math.sin(angle_rad)
            y2 = center_y - (radius - 5) * math.cos(angle_rad)
            color = "#E74C3C" if degrees >= 30 else "#7F8C8D"
            marks.append(
                f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="2"/>'
            )
    return '\n  '.join(marks)

def create_ground_reference_maneuver_svg(maneuver_type: str = "turns_around_point", wind_from: str = "W") -> str:
    """Create a top-down view of ground reference maneuvers."""
    svg_width, svg_height = 500, 500
    
    if maneuver_type == "turns_around_point":
        return create_turns_around_point_svg(svg_width, svg_height, wind_from)
    elif maneuver_type == "s_turns":
        return create_s_turns_svg(svg_width, svg_height, wind_from)
    elif maneuver_type == "rectangular_course":
        return create_rectangular_course_svg(svg_width, svg_height, wind_from)
    else:
        return create_turns_around_point_svg(svg_width, svg_height, wind_from)

def create_turns_around_point_svg(width: int, height: int, wind_from: str) -> str:
    """Create turns around a point diagram."""
    center_x, center_y = width // 2, height // 2
    point_radius = 30
    orbit_radius = 150
    
    # Wind direction (default: from West)
    wind_angles = {"N": 0, "NE": 45, "E": 90, "SE": 135, "S": 180, "SW": 225, "W": 270, "NW": 315}
    wind_angle = wind_angles.get(wind_from, 270)
    import math
    wind_rad = math.radians(wind_angle - 180)  # Wind direction (from)
    wind_dx = math.cos(wind_rad) * 40
    wind_dy = math.sin(wind_rad) * 40
    
    svg = f'''<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{width}" height="{height}" fill="#F5F5DC"/>
  
  <!-- Ground features -->
  <circle cx="{center_x}" cy="{center_y - 100}" r="15" fill="#228B22" opacity="0.6"/>
  <circle cx="{center_x - 150}" cy="{center_y + 50}" r="20" fill="#228B22" opacity="0.6"/>
  <circle cx="{center_x + 150}" cy="{center_y + 80}" r="18" fill="#228B22" opacity="0.6"/>
  
  <!-- Reference point -->
  <circle cx="{center_x}" cy="{center_y}" r="{point_radius}" fill="#8B4513" stroke="#654321" stroke-width="3"/>
  <text x="{center_x}" y="{center_y + 5}" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="white">REFERENCE POINT</text>
  
  <!-- Flight path (elliptical to compensate for wind) -->
  <path d="M {center_x + orbit_radius} {center_y} A {orbit_radius} {orbit_radius * 1.15} 0 1 1 {center_x - orbit_radius} {center_y} A {orbit_radius} {orbit_radius * 1.15} 0 1 1 {center_x + orbit_radius} {center_y}" 
        fill="none" stroke="#1E90FF" stroke-width="4" stroke-dasharray="8,4" opacity="0.7"/>
  
  <!-- Aircraft positions around the circle -->
  {generate_aircraft_positions(center_x, center_y, orbit_radius, 8)}
  
  <!-- Wind arrow -->
  <g transform="translate({center_x + wind_dx}, {center_y + wind_dy})">
    <defs>
      <marker id="windArrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#FF6347"/>
      </marker>
    </defs>
    <line x1="0" y1="0" x2="{wind_dx * -2}" y2="{wind_dy * -2}" 
          stroke="#FF6347" stroke-width="4" marker-end="url(#windArrow)"/>
    <text x="{wind_dx * -2 - 30}" y="{wind_dy * -2}" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FF6347">WIND</text>
  </g>
  
  <!-- Title -->
  <text x="{width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">Turns Around a Point</text>
  
  <!-- Key points -->
  <text x="20" y="{height - 100}" font-family="Arial, sans-serif" font-size="12" fill="#2C3E50">
    <tspan x="20" dy="0">Key Points:</tspan>
    <tspan x="20" dy="18">• Maintain constant radius</tspan>
    <tspan x="20" dy="18">• Adjust bank angle for wind</tspan>
    <tspan x="20" dy="18">• Steeper bank upwind</tspan>
    <tspan x="20" dy="18">• Shallower bank downwind</tspan>
  </text>
</svg>'''
    return svg

def generate_aircraft_positions(center_x: float, center_y: float, radius: float, count: int) -> str:
    """Generate aircraft symbols at various positions around a circle."""
    positions = []
    import math
    for i in range(count):
        angle = (i * 360 / count) - 90  # Start at top
        angle_rad = math.radians(angle)
        x = center_x + radius * math.cos(angle_rad)
        y = center_y + radius * math.sin(angle_rad)
        
        # Draw aircraft (simplified triangle)
        positions.append(
            f'<g transform="translate({x}, {y}) rotate({angle})">'
            f'<path d="M 0 -15 L -10 10 L 0 5 L 10 10 Z" fill="#4169E1" stroke="#000080" stroke-width="1" opacity="0.8"/>'
            f'</g>'
        )
    return '\n  '.join(positions)

def create_s_turns_svg(width: int, height: int, wind_from: str) -> str:
    """Create S-turns across a road diagram."""
    center_x, center_y = width // 2, height // 2
    road_width = 200
    
    wind_angles = {"N": 0, "NE": 45, "E": 90, "SE": 135, "S": 180, "SW": 225, "W": 270, "NW": 315}
    wind_angle = wind_angles.get(wind_from, 270)
    import math
    wind_rad = math.radians(wind_angle - 180)
    wind_dx = math.cos(wind_rad) * 40
    wind_dy = math.sin(wind_rad) * 40
    
    svg = f'''<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{width}" height="{height}" fill="#F5F5DC"/>
  
  <!-- Road (reference line) -->
  <rect x="{center_x - road_width // 2}" y="50" width="{road_width}" height="{height - 100}" fill="#696969" opacity="0.3"/>
  <line x1="{center_x - road_width // 2}" y1="50" x2="{center_x - road_width // 2}" y2="{height - 50}" 
        stroke="#2C3E50" stroke-width="3" stroke-dasharray="10,5"/>
  <line x1="{center_x + road_width // 2}" y1="50" x2="{center_x + road_width // 2}" y2="{height - 50}" 
        stroke="#2C3E50" stroke-width="3" stroke-dasharray="10,5"/>
  <text x="{center_x}" y="30" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#2C3E50">REFERENCE LINE</text>
  
  <!-- S-turn flight path -->
  <path d="M {center_x} 50 Q {center_x - 80} {center_y - 100} {center_x - 50} {center_y} T {center_x} {center_y + 100} Q {center_x + 80} {center_y + 200} {center_x + 50} {height - 50}" 
        fill="none" stroke="#1E90FF" stroke-width="4" stroke-dasharray="8,4" opacity="0.7"/>
  
  <!-- Aircraft positions -->
  {generate_s_turn_aircraft(center_x, center_y, road_width)}
  
  <!-- Wind arrow -->
  <g transform="translate({center_x + wind_dx}, {center_y + wind_dy})">
    <defs>
      <marker id="windArrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#FF6347"/>
      </marker>
    </defs>
    <line x1="0" y1="0" x2="{wind_dx * -2}" y2="{wind_dy * -2}" 
          stroke="#FF6347" stroke-width="4" marker-end="url(#windArrow2)"/>
    <text x="{wind_dx * -2 - 30}" y="{wind_dy * -2}" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FF6347">WIND</text>
  </g>
  
  <!-- Title -->
  <text x="{width // 2}" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">S-Turns Across a Road</text>
  
  <!-- Key points -->
  <text x="20" y="{height - 120}" font-family="Arial, sans-serif" font-size="12" fill="#2C3E50">
    <tspan x="20" dy="0">Key Points:</tspan>
    <tspan x="20" dy="18">• Enter perpendicular to reference</tspan>
    <tspan x="20" dy="18">• First turn away from wind</tspan>
    <tspan x="20" dy="18">• Complete 180° turn</tspan>
    <tspan x="20" dy="18">• Cross reference at 90°</tspan>
    <tspan x="20" dy="18">• Opposite turn to complete S</tspan>
  </text>
</svg>'''
    return svg

def generate_s_turn_aircraft(center_x: float, center_y: float, road_width: float) -> str:
    """Generate aircraft symbols along S-turn path."""
    positions = []
    import math
    positions_list = [
        (center_x, 80, 0),
        (center_x - 40, center_y - 50, -45),
        (center_x - 30, center_y, 0),
        (center_x, center_y + 50, 45),
        (center_x + 30, center_y + 100, 0),
    ]
    for x, y, angle in positions_list:
        positions.append(
            f'<g transform="translate({x}, {y}) rotate({angle})">'
            f'<path d="M 0 -15 L -10 10 L 0 5 L 10 10 Z" fill="#4169E1" stroke="#000080" stroke-width="1" opacity="0.8"/>'
            f'</g>'
        )
    return '\n  '.join(positions)

def create_rectangular_course_svg(width: int, height: int, wind_from: str) -> str:
    """Create rectangular course diagram."""
    center_x, center_y = width // 2, height // 2
    rect_width, rect_height = 200, 150
    
    wind_angles = {"N": 0, "NE": 45, "E": 90, "SE": 135, "S": 180, "SW": 225, "W": 270, "NW": 315}
    wind_angle = wind_angles.get(wind_from, 270)
    import math
    wind_rad = math.radians(wind_angle - 180)
    wind_dx = math.cos(wind_rad) * 40
    wind_dy = math.sin(wind_rad) * 40
    
    svg = f'''<svg viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{width}" height="{height}" fill="#F5F5DC"/>
  
  <!-- Reference rectangle (offset due to wind) -->
  <rect x="{center_x - rect_width // 2 - 20}" y="{center_y - rect_height // 2 - 15}" 
        width="{rect_width}" height="{rect_height}" 
        fill="none" stroke="#696969" stroke-width="2" stroke-dasharray="5,5" opacity="0.5"/>
  
  <!-- Actual flight path (wind-corrected) -->
  <path d="M {center_x + rect_width // 2 - 20} {center_y - rect_height // 2 - 15} 
           L {center_x - rect_width // 2 - 20} {center_y - rect_height // 2 - 15} 
           L {center_x - rect_width // 2 - 30} {center_y + rect_height // 2 - 15} 
           L {center_x + rect_width // 2 - 10} {center_y + rect_height // 2 - 15} Z" 
        fill="none" stroke="#1E90FF" stroke-width="4" stroke-dasharray="8,4" opacity="0.7"/>
  
  <!-- Aircraft at corners -->
  {generate_rectangular_aircraft(center_x, center_y, rect_width, rect_height)}
  
  <!-- Wind arrow -->
  <g transform="translate({center_x + wind_dx}, {center_y + wind_dy})">
    <defs>
      <marker id="windArrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
        <polygon points="0 0, 10 3, 0 6" fill="#FF6347"/>
      </marker>
    </defs>
    <line x1="0" y1="0" x2="{wind_dx * -2}" y2="{wind_dy * -2}" 
          stroke="#FF6347" stroke-width="4" marker-end="url(#windArrow3)"/>
    <text x="{wind_dx * -2 - 30}" y="{wind_dy * -2}" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#FF6347">WIND</text>
  </g>
  
  <!-- Title -->
  <text x="{width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">Rectangular Course</text>
  
  <!-- Leg labels -->
  <text x="{center_x + rect_width // 2 - 10}" y="{center_y - rect_height // 2 - 20}" font-family="Arial, sans-serif" font-size="11" fill="#2C3E50">Downwind</text>
  <text x="{center_x - rect_width // 2 - 35}" y="{center_y}" font-family="Arial, sans-serif" font-size="11" fill="#2C3E50">Base</text>
  <text x="{center_x + rect_width // 2 + 10}" y="{center_y + rect_height // 2 + 25}" font-family="Arial, sans-serif" font-size="11" fill="#2C3E50">Upwind</text>
  <text x="{center_x + rect_width // 2 + 35}" y="{center_y}" font-family="Arial, sans-serif" font-size="11" fill="#2C3E50">Crosswind</text>
  
  <!-- Key points -->
  <text x="20" y="{height - 100}" font-family="Arial, sans-serif" font-size="12" fill="#2C3E50">
    <tspan x="20" dy="0">Key Points:</tspan>
    <tspan x="20" dy="18">• Maintain 1/2 to 1 mile from course</tspan>
    <tspan x="20" dy="18">• Enter at 45° to downwind leg</tspan>
    <tspan x="20" dy="18">• Turn at reference points</tspan>
    <tspan x="20" dy="18">• Adjust bank for wind correction</tspan>
  </text>
</svg>'''
    return svg

def generate_rectangular_aircraft(center_x: float, center_y: float, width: float, height: float) -> str:
    """Generate aircraft at rectangular course corners."""
    positions = []
    corners = [
        (center_x + width // 2 - 20, center_y - height // 2 - 15, 90),  # Downwind
        (center_x - width // 2 - 20, center_y - height // 2 - 15, 180),  # Base
        (center_x - width // 2 - 30, center_y + height // 2 - 15, 270),  # Upwind
        (center_x + width // 2 - 10, center_y + height // 2 - 15, 0),  # Crosswind
    ]
    for x, y, angle in corners:
        positions.append(
            f'<g transform="translate({x}, {y}) rotate({angle})">'
            f'<path d="M 0 -15 L -10 10 L 0 5 L 10 10 Z" fill="#4169E1" stroke="#000080" stroke-width="1" opacity="0.8"/>'
            f'</g>'
        )
    return '\n  '.join(positions)

def create_steep_turn_diagram() -> str:
    """Create steep turn diagram with attitude indicator."""
    return create_attitude_indicator_svg(bank_angle=45, pitch_angle=5, title="Steep Turn - 45° Bank")

def create_stall_progression_diagram() -> str:
    """Create stall progression diagram showing angle of attack."""
    svg = f'''<svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#E8E8E8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C0C0C0;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Title -->
  <text x="300" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">Stall Progression - Angle of Attack</text>
  
  <!-- Three stages: Normal, Approaching Stall, Stalled -->
  <g transform="translate(50, 80)">
    <!-- Stage 1: Normal Flight -->
    <text x="75" y="0" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#2C3E50">Normal Flight</text>
    <g transform="translate(75, 50)">
      <path d="M -40 0 L -20 10 L 20 10 L 40 0 L 20 -10 L -20 -10 Z" fill="url(#wingGrad)" stroke="#2C3E50" stroke-width="2"/>
      <line x1="-60" y1="0" x2="60" y2="0" stroke="#87CEEB" stroke-width="3" stroke-dasharray="5,3"/>
      <text x="0" y="-25" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50">AoA: ~4°</text>
      <text x="0" y="35" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50">Lift = Weight</text>
    </g>
  </g>
  
  <g transform="translate(250, 80)">
    <!-- Stage 2: Approaching Stall -->
    <text x="75" y="0" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#E67E22">Approaching Stall</text>
    <g transform="translate(75, 50)">
      <path d="M -40 8 L -20 18 L 20 18 L 40 8 L 20 -2 L -20 -2 Z" fill="url(#wingGrad)" stroke="#E67E22" stroke-width="2" opacity="0.9"/>
      <line x1="-60" y1="0" x2="60" y2="0" stroke="#87CEEB" stroke-width="3" stroke-dasharray="5,3"/>
      <text x="0" y="-25" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#E67E22">AoA: ~12-15°</text>
      <text x="0" y="35" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#E67E22">Buffet Begins</text>
      <path d="M -30 10 Q -20 5 -10 10" fill="none" stroke="#FF6347" stroke-width="2" opacity="0.6"/>
    </g>
  </g>
  
  <g transform="translate(450, 80)">
    <!-- Stage 3: Stalled -->
    <text x="75" y="0" font-family="Arial, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" fill="#E74C3C">Stalled</text>
    <g transform="translate(75, 50)">
      <path d="M -40 15 L -20 25 L 20 25 L 40 15 L 20 5 L -20 5 Z" fill="url(#wingGrad)" stroke="#E74C3C" stroke-width="2" opacity="0.9"/>
      <line x1="-60" y1="0" x2="60" y2="0" stroke="#87CEEB" stroke-width="3" stroke-dasharray="5,3"/>
      <text x="0" y="-25" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#E74C3C">AoA: &gt;16°</text>
      <text x="0" y="35" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#E74C3C">Loss of Lift</text>
      <path d="M -35 12 Q -25 7 -15 12 Q -5 17 5 12 Q 15 7 25 12" fill="none" stroke="#FF6347" stroke-width="3" opacity="0.8"/>
    </g>
  </g>
  
  <!-- Key concepts -->
  <text x="50" y="280" font-family="Arial, sans-serif" font-size="12" fill="#2C3E50">
    <tspan x="50" dy="0">Critical Angle of Attack:</tspan>
    <tspan x="50" dy="18">• Typically 16-18° for most aircraft</tspan>
    <tspan x="50" dy="18">• Angle at which lift decreases rapidly</tspan>
    <tspan x="50" dy="18">• Independent of airspeed or weight</tspan>
    <tspan x="50" dy="18">• Recovery: Reduce AoA (nose down)</tspan>
  </text>
  
  <!-- Relative wind arrows -->
  <g transform="translate(75, 130)">
    <path d="M 0 0 L 0 30" stroke="#4169E1" stroke-width="2" marker-end="url(#windArrow4)"/>
  </g>
  <g transform="translate(275, 138)">
    <path d="M 0 0 L 10 30" stroke="#4169E1" stroke-width="2" marker-end="url(#windArrow4)"/>
  </g>
  <g transform="translate(475, 155)">
    <path d="M 0 0 L 15 30" stroke="#4169E1" stroke-width="2" marker-end="url(#windArrow4)"/>
  </g>
  <defs>
    <marker id="windArrow4" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
      <polygon points="0 0, 10 5, 0 10" fill="#4169E1"/>
    </marker>
  </defs>
</svg>'''
    return svg

def create_takeoff_profile_diagram(short_field: bool = False) -> str:
    """Create takeoff profile diagram."""
    svg_width, svg_height = 600, 400
    ground_level = svg_height - 60
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#87CEEB"/>
  
  <!-- Ground -->
  <rect x="0" y="{ground_level}" width="{svg_width}" height="60" fill="#8B7355"/>
  <line x1="0" y1="{ground_level}" x2="{svg_width}" y2="{ground_level}" stroke="#654321" stroke-width="2"/>
  
  <!-- Runway markings -->
  <line x1="50" y1="{ground_level - 20}" x2="200" y2="{ground_level - 20}" stroke="white" stroke-width="3"/>
  <line x1="200" y1="{ground_level - 20}" x2="350" y2="{ground_level - 20}" stroke="white" stroke-width="1" stroke-dasharray="5,10"/>
  <line x1="350" y1="{ground_level - 20}" x2="500" y2="{ground_level - 20}" stroke="white" stroke-width="3"/>
  
  <!-- Takeoff phases -->
  <!-- Phase 1: Ground roll -->
  <g>
    <rect x="60" y="{ground_level - 40}" width="80" height="30" fill="#4169E1" opacity="0.6" rx="4"/>
    <text x="100" y="{ground_level - 25}" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="white">Ground Roll</text>
    <text x="100" y="{ground_level - 12}" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="white">0-55 KIAS</text>
  </g>
  
  <!-- Aircraft positions -->
  <g transform="translate(70, {ground_level - 35})">
    <path d="M 0 -8 L -15 8 L 0 3 L 15 8 Z" fill="#2C3E50" stroke="white" stroke-width="1"/>
  </g>
  
  <!-- Phase 2: Rotation -->
  <g>
    <rect x="150" y="{ground_level - 45}" width="60" height="35" fill="#FF6347" opacity="0.6" rx="4"/>
    <text x="180" y="{ground_level - 30}" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="white">Rotation</text>
    <text x="180" y="{ground_level - 18}" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="white">~55 KIAS</text>
  </g>
  
  <g transform="translate(175, {ground_level - 32}) rotate(5)">
    <path d="M 0 -8 L -15 8 L 0 3 L 15 8 Z" fill="#2C3E50" stroke="white" stroke-width="1"/>
  </g>
  
  <!-- Phase 3: Initial climb -->
  <g>
    <path d="M 210 {ground_level - 45} Q 280 {ground_level - 120} 320 {ground_level - 150}" 
          fill="none" stroke="#1E90FF" stroke-width="3" stroke-dasharray="5,3"/>
    <g transform="translate(280, {ground_level - 100}) rotate(12)">
      <path d="M 0 -8 L -15 8 L 0 3 L 15 8 Z" fill="#2C3E50" stroke="white" stroke-width="1"/>
    </g>
    <text x="265" y="{ground_level - 85}" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">VY Climb</text>
    <text x="265" y="{ground_level - 72}" font-family="Arial, sans-serif" font-size="9" fill="#2C3E50">~78 KIAS</text>
  </g>
  
  {'<!-- Short field: obstacle clearance -->\n  <line x1="220" y1="{ground_level - 80}" x2="280" y2="{ground_level - 80}" \n        stroke="#E74C3C" stroke-width="2" stroke-dasharray="3,3"/>\n  <text x="300" y="{ground_level - 75}" font-family="Arial, sans-serif" font-size="10" fill="#E74C3C">50 ft Obstacle</text>\n  ' if short_field else ''}
  
  <!-- Performance data -->
  <text x="400" y="50" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Takeoff Phases:</text>
  <text x="400" y="75" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="400" dy="0">1. Ground Roll: 0-VR</tspan>
    <tspan x="400" dy="16">2. Rotation: ~10° pitch</tspan>
    <tspan x="400" dy="16">3. Initial Climb: VY</tspan>
    <tspan x="400" dy="16">4. Climb Out: Maintain VY</tspan>
  </text>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    {'Short-Field ' if short_field else ''}Takeoff Profile
  </text>
</svg>'''
    return svg

def create_landing_profile_diagram(short_field: bool = False) -> str:
    """Create landing approach and touchdown profile."""
    svg_width, svg_height = 600, 400
    ground_level = svg_height - 60
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#87CEEB"/>
  
  <!-- Ground -->
  <rect x="0" y="{ground_level}" width="{svg_width}" height="60" fill="#8B7355"/>
  <line x1="0" y1="{ground_level}" x2="{svg_width}" y2="{ground_level}" stroke="#654321" stroke-width="2"/>
  
  <!-- Runway -->
  <rect x="300" y="{ground_level - 20}" width="250" height="20" fill="#696969" opacity="0.8"/>
  <line x1="300" y1="{ground_level - 20}" x2="550" y2="{ground_level - 20}" stroke="white" stroke-width="2"/>
  <line x1="400" y1="{ground_level - 20}" x2="450" y2="{ground_level - 20}" stroke="white" stroke-width="1" stroke-dasharray="3,5"/>
  <text x="425" y="{ground_level - 25}" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="white">Touchdown Zone</text>
  
  <!-- Approach path -->
  <path d="M 50 {ground_level - 250} Q 200 {ground_level - 180} 350 {ground_level - 80} T 400 {ground_level - 20}" 
        fill="none" stroke="#1E90FF" stroke-width="4" stroke-dasharray="8,4"/>
  
  <!-- Aircraft on approach -->
  <g transform="translate(150, {ground_level - 200}) rotate(-3)">
    <path d="M 0 -8 L -15 8 L 0 3 L 15 8 Z" fill="#2C3E50" stroke="white" stroke-width="1"/>
  </g>
  <text x="150" y="{ground_level - 215}" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50">Final Approach</text>
  <text x="150" y="{ground_level - 203}" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="#2C3E50">~65 KIAS</text>
  
  <!-- Flare -->
  <g transform="translate(350, {ground_level - 70}) rotate(-1)">
    <path d="M 0 -8 L -15 8 L 0 3 L 15 8 Z" fill="#FF6347" stroke="white" stroke-width="1"/>
  </g>
  <text x="350" y="{ground_level - 85}" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#FF6347">Flare</text>
  
  <!-- Touchdown -->
  <g transform="translate(400, {ground_level - 20})">
    <path d="M 0 -5 L -12 5 L 0 0 L 12 5 Z" fill="#4169E1" stroke="white" stroke-width="1"/>
  </g>
  <circle cx="400" cy="{ground_level - 15}" r="3" fill="#E74C3C"/>
  
  <!-- Glide path angle indicator -->
  <line x1="100" y1="{ground_level - 230}" x2="150" y2="{ground_level - 200}" 
        stroke="#E74C3C" stroke-width="2" opacity="0.5"/>
  <text x="120" y="{ground_level - 210}" font-family="Arial, sans-serif" font-size="9" fill="#E74C3C">~3° Glide</text>
  
  <!-- Performance data -->
  <text x="50" y="50" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Approach Phases:</text>
  <text x="50" y="75" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="50" dy="0">1. Final Approach: 3° glide path</tspan>
    <tspan x="50" dy="16">2. Flare: ~10-20 ft AGL</tspan>
    <tspan x="50" dy="16">3. Touchdown: Main wheels first</tspan>
    <tspan x="50" dy="16">4. Rollout: Maintain centerline</tspan>
  </text>
  
  {'<!-- Short field: aim point -->\n  <line x1="380" y1="{ground_level - 25}" x2="420" y2="{ground_level - 15}" \n        stroke="#E74C3C" stroke-width="2" stroke-dasharray="3,3"/>\n  <text x="450" y="{ground_level - 15}" font-family="Arial, sans-serif" font-size="10" fill="#E74C3C">Aim Point</text>\n  ' if short_field else ''}
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    {'Short-Field ' if short_field else ''}Landing Profile
  </text>
</svg>'''
    return svg

def create_slow_flight_diagram() -> str:
    """Create slow flight diagram showing attitude and power."""
    return create_attitude_indicator_svg(bank_angle=0, pitch_angle=8, title="Slow Flight - High Angle of Attack")

def create_steep_turn_steps_diagram() -> str:
    """Create step-by-step steep turn showing aircraft positions."""
    svg_width, svg_height = 600, 600
    center_x, center_y = svg_width // 2, svg_height // 2
    radius = 200
    
    import math
    
    # Generate 8 positions around the turn
    steps = []
    for i in range(8):
        angle = (i * 360 / 8) - 90
        angle_rad = math.radians(angle)
        x = center_x + radius * math.cos(angle_rad)
        y = center_y + radius * math.sin(angle_rad)
        
        steps.append(f'''<!-- Step {i+1}: {i*45}° -->
      <g transform="translate({x}, {y}) rotate({angle + 45})">
        <path d="M 0 -12 L -18 12 L 0 5 L 18 12 Z" fill="#4169E1" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="0" y="-20" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50" font-weight="bold">{i+1}</text>
      </g>
      <text x="{x}" y="{y + 35}" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="#2C3E50">{i*45}°</text>''')
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#87CEEB"/>
  
  <!-- Horizon reference -->
  <line x1="0" y1="{center_y}" x2="{svg_width}" y2="{center_y}" stroke="#E8E8E8" stroke-width="2" stroke-dasharray="5,5" opacity="0.5"/>
  
  <!-- Flight path circle -->
  <circle cx="{center_x}" cy="{center_y}" r="{radius}" fill="none" stroke="#1E90FF" stroke-width="3" stroke-dasharray="10,5" opacity="0.5"/>
  
  <!-- Altitude markers -->
  <text x="{center_x}" y="{center_y - radius - 30}" font-family="Arial, sans-serif" font-size="12" text-anchor="middle" fill="#2C3E50" font-weight="bold">Maintain Altitude</text>
  
  <!-- Aircraft positions at each step -->
  {''.join(steps)}
  
  <!-- Center point -->
  <circle cx="{center_x}" cy="{center_y}" r="5" fill="#E74C3C"/>
  
  <!-- Entry/Exit points -->
  <text x="{center_x + radius + 20}" y="{center_y}" font-family="Arial, sans-serif" font-size="11" fill="#2C3E50" font-weight="bold">Entry</text>
  
  <!-- Key points -->
  <text x="30" y="50" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Steep Turn Steps:</text>
  <text x="30" y="75" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="30" dy="0">1. Entry: 45° bank, add power</tspan>
    <tspan x="30" dy="16">2-7. Maintain 45° bank, slight back pressure</tspan>
    <tspan x="30" dy="16">8. Rollout: Lead by 10°, reduce power</tspan>
    <tspan x="30" dy="16">• Constant altitude throughout</tspan>
    <tspan x="30" dy="16">• Coordinate with rudder</tspan>
  </text>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Steep Turn - Step-by-Step
  </text>
</svg>'''
    return svg

def create_steep_spiral_diagram() -> str:
    """Create step-by-step steep spiral showing descending pattern."""
    svg_width, svg_height = 600, 600
    center_x, center_y = svg_width // 2, svg_height // 2 + 50
    
    import math
    
    # Generate descending spiral positions
    steps = []
    for i in range(6):
        angle = i * 60 - 90
        angle_rad = math.radians(angle)
        radius = 180 - (i * 20)  # Decreasing radius
        altitude_offset = i * 60  # Increasing descent
        x = center_x + radius * math.cos(angle_rad)
        y = center_y - altitude_offset + radius * math.sin(angle_rad) * 0.5
        
        steps.append(f'''<!-- Step {i+1}: {i*60}°, Alt {3000 - i*500} ft -->
      <g transform="translate({x}, {y}) rotate({angle + 45})">
        <path d="M 0 -12 L -18 12 L 0 5 L 18 12 Z" fill="#4169E1" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="0" y="-20" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50" font-weight="bold">{i+1}</text>
      </g>
      <circle cx="{x}" cy="{y}" r="3" fill="#E74C3C" opacity="0.6"/>
      <text x="{x + 15}" y="{y - 10}" font-family="Arial, sans-serif" font-size="8" fill="#2C3E50">{3000 - i*500} ft</text>''')
    
    # Spiral path
    spiral_path = []
    for i in range(360):
        angle_rad = math.radians(i - 90)
        radius = 180 - (i / 360) * 100
        altitude_offset = (i / 360) * 300
        x = center_x + radius * math.cos(angle_rad)
        y = center_y - altitude_offset + radius * math.sin(angle_rad) * 0.5
        if i == 0:
            spiral_path.append(f"M {x} {y}")
        else:
            spiral_path.append(f"L {x} {y}")
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background with altitude gradient -->
  <defs>
    <linearGradient id="altGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4682B4;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="{svg_width}" height="{svg_height}" fill="url(#altGrad)"/>
  
  <!-- Spiral flight path -->
  <path d="{' '.join(spiral_path)}" fill="none" stroke="#1E90FF" stroke-width="3" stroke-dasharray="8,4" opacity="0.7"/>
  
  <!-- Aircraft positions -->
  {''.join(steps)}
  
  <!-- Reference point (ground feature) -->
  <circle cx="{center_x}" cy="{center_y + 100}" r="8" fill="#8B4513" stroke="#654321" stroke-width="2"/>
  <text x="{center_x}" y="{center_y + 125}" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#2C3E50" font-weight="bold">Reference Point</text>
  
  <!-- Altitude scale -->
  <text x="500" y="80" font-family="Arial, sans-serif" font-size="11" fill="#2C3E50" font-weight="bold">Altitude:</text>
  <text x="500" y="100" font-family="Arial, sans-serif" font-size="9" fill="#2C3E50">Start: 3000 ft</text>
  <text x="500" y="120" font-family="Arial, sans-serif" font-size="9" fill="#2C3E50">End: ~500 ft</text>
  
  <!-- Key points -->
  <text x="30" y="50" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Steep Spiral Steps:</text>
  <text x="30" y="75" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="30" dy="0">1. Enter at 3000 ft, 45° bank</tspan>
    <tspan x="30" dy="16">2-5. Maintain bank, descending ~500 ft/turn</tspan>
    <tspan x="30" dy="16">6. Level off at 500 ft minimum</tspan>
    <tspan x="30" dy="16">• Keep reference point in view</tspan>
    <tspan x="30" dy="16">• Constant rate of descent</tspan>
  </text>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Steep Spiral - Step-by-Step
  </text>
</svg>'''
    return svg

def create_chandelle_diagram() -> str:
    """Create step-by-step chandelle showing climbing and descending phases."""
    svg_width, svg_height = 700, 500
    center_x, center_y = svg_width // 2, svg_height // 2
    
    import math
    
    # Generate positions for 180° climbing turn then 180° descending turn
    steps = []
    
    # First 180° - climbing
    for i in range(5):
        angle = i * 36 - 90
        angle_rad = math.radians(angle)
        radius = 150
        altitude = i * 30  # Climbing
        x = center_x - 100 + radius * math.cos(angle_rad)
        y = center_y - altitude + radius * math.sin(angle_rad) * 0.3
        
        steps.append(f'''<!-- Step {i+1}: Climbing turn -->
      <g transform="translate({x}, {y}) rotate({angle + 30})">
        <path d="M 0 -12 L -18 12 L 0 5 L 18 12 Z" fill="#10B981" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="0" y="-20" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50" font-weight="bold">{i+1}</text>
      </g>
      <text x="{x + 15}" y="{y - 10}" font-family="Arial, sans-serif" font-size="8" fill="#10B981">+{i*100} ft</text>''')
    
    # Second 180° - descending
    for i in range(5):
        angle = 180 + i * 36 - 90
        angle_rad = math.radians(angle)
        radius = 150
        altitude = 120 - (i * 30)  # Descending from peak
        x = center_x + 100 + radius * math.cos(angle_rad)
        y = center_y - altitude + radius * math.sin(angle_rad) * 0.3
        
        steps.append(f'''<!-- Step {i+6}: Descending turn -->
      <g transform="translate({x}, {y}) rotate({angle + 30})">
        <path d="M 0 -12 L -18 12 L 0 5 L 18 12 Z" fill="#EF4444" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="0" y="-20" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50" font-weight="bold">{i+6}</text>
      </g>
      <text x="{x + 15}" y="{y - 10}" font-family="Arial, sans-serif" font-size="8" fill="#EF4444">-{i*100} ft</text>''')
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#87CEEB"/>
  
  <!-- Horizon -->
  <line x1="0" y1="{center_y}" x2="{svg_width}" y2="{center_y}" stroke="#E8E8E8" stroke-width="2" stroke-dasharray="5,5" opacity="0.5"/>
  
  <!-- Flight path -->
  <path d="M {center_x - 200} {center_y} Q {center_x - 100} {center_y - 120} {center_x} {center_y - 120} T {center_x + 200} {center_y}" 
        fill="none" stroke="#1E90FF" stroke-width="3" stroke-dasharray="10,5" opacity="0.7"/>
  
  <!-- Aircraft positions -->
  {''.join(steps)}
  
  <!-- Peak altitude marker -->
  <line x1="{center_x - 20}" y1="{center_y - 120}" x2="{center_x + 20}" y2="{center_y - 120}" 
        stroke="#F59E0B" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="{center_x}" y="{center_y - 135}" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#F59E0B" font-weight="bold">Peak: 180°</text>
  
  <!-- Key points -->
  <text x="30" y="50" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Chandelle Steps:</text>
  <text x="30" y="75" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="30" dy="0">1-5. Climbing turn: 30° bank, increase pitch</tspan>
    <tspan x="30" dy="16">6. Peak at 180°: Maximum pitch, stalling speed</tspan>
    <tspan x="30" dy="16">7-10. Descending turn: Maintain bank, decrease pitch</tspan>
    <tspan x="30" dy="16">• 180° climbing + 180° descending = 360° total</tspan>
    <tspan x="30" dy="16">• Complete at entry altitude and heading</tspan>
  </text>
  
  <!-- Legend -->
  <g transform="translate(500, 80)">
    <rect x="0" y="0" width="15" height="15" fill="#10B981" opacity="0.8"/>
    <text x="20" y="12" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">Climbing</text>
    <rect x="0" y="25" width="15" height="15" fill="#EF4444" opacity="0.8"/>
    <text x="20" y="37" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">Descending</text>
  </g>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Chandelle - Step-by-Step
  </text>
</svg>'''
    return svg

def create_lazy_eight_diagram() -> str:
    """Create step-by-step lazy eight showing figure-8 pattern."""
    svg_width, svg_height = 600, 600
    center_x, center_y = svg_width // 2, svg_height // 2
    
    import math
    
    # Generate positions for lazy eight (figure-8 pattern)
    steps = []
    positions = [
        (0, 0, "Entry"),
        (45, 5, ""),
        (90, 10, "Peak 1"),
        (135, 5, ""),
        (180, 0, "Crossover"),
        (225, -5, ""),
        (270, -10, "Peak 2"),
        (315, -5, ""),
        (360, 0, "Exit"),
    ]
    
    for i, (angle, pitch, label) in enumerate(positions):
        angle_rad = math.radians(angle - 90)
        radius_x = 150 * (1 + 0.3 * math.sin(math.radians(angle * 2)))  # Varies for figure-8
        radius_y = 120
        x = center_x + radius_x * math.cos(angle_rad)
        y = center_y + pitch * 8 + radius_y * math.sin(angle_rad) * (1 if angle < 180 else -1)
        
        bank_angle = 30 if angle < 180 else -30
        bank_angle = bank_angle * (1 - abs(math.sin(math.radians(angle * 2))))
        
        steps.append(f'''<!-- Step {i+1}: {angle}° -->
      <g transform="translate({x}, {y}) rotate({angle - 90 + bank_angle})">
        <path d="M 0 -12 L -18 12 L 0 5 L 18 12 Z" fill="#4169E1" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="0" y="-20" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50" font-weight="bold">{i+1}</text>
      </g>
      {f'<text x="{x}" y="{y - 30}" font-family="Arial, sans-serif" font-size="9" text-anchor="middle" fill="#E74C3C" font-weight="bold">{label}</text>' if label else ''}''')
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#87CEEB"/>
  
  <!-- Horizon -->
  <line x1="0" y1="{center_y}" x2="{svg_width}" y2="{center_y}" stroke="#E8E8E8" stroke-width="2" stroke-dasharray="5,5" opacity="0.5"/>
  
  <!-- Figure-8 flight path -->
  <path d="M {center_x + 150} {center_y} 
           Q {center_x + 100} {center_y - 120} {center_x} {center_y - 120}
           Q {center_x - 100} {center_y - 120} {center_x - 150} {center_y}
           Q {center_x - 100} {center_y + 120} {center_x} {center_y + 120}
           Q {center_x + 100} {center_y + 120} {center_x + 150} {center_y}" 
        fill="none" stroke="#1E90FF" stroke-width="3" stroke-dasharray="10,5" opacity="0.7"/>
  
  <!-- Aircraft positions -->
  {''.join(steps)}
  
  <!-- Key points -->
  <text x="30" y="50" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Lazy Eight Steps:</text>
  <text x="30" y="75" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="30" dy="0">1. Entry: Level flight</tspan>
    <tspan x="30" dy="16">2-4. Climbing turn: Increase pitch & bank</tspan>
    <tspan x="30" dy="16">5. Crossover: Level, reverse bank</tspan>
    <tspan x="30" dy="16">6-8. Descending turn: Decrease pitch & bank</tspan>
    <tspan x="30" dy="16">9. Exit: Level flight, entry heading</tspan>
    <tspan x="30" dy="16">• 45° bank at peaks, 0° at crossover</tspan>
  </text>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Lazy Eight - Step-by-Step
  </text>
</svg>'''
    return svg

def create_eights_on_pylons_diagram() -> str:
    """Create step-by-step eights on pylons showing altitude changes."""
    svg_width, svg_height = 600, 600
    center_x, center_y = svg_width // 2, svg_height // 2
    pylon_distance = 200
    
    import math
    
    # Two pylons
    pylon1_x = center_x - pylon_distance // 2
    pylon2_x = center_x + pylon_distance // 2
    pylon_y = center_y
    
    # Generate positions showing altitude changes
    steps = []
    positions = [
        (0, pylon1_x, pylon_y - 150, "Entry - Pylon 1"),
        (90, pylon1_x - 100, pylon_y, "Abeam - Lower Alt"),
        (180, pylon1_x, pylon_y + 150, "Past - Higher Alt"),
        (270, center_x, pylon_y, "Between"),
        (360, pylon2_x, pylon_y - 150, "Pylon 2"),
        (450, pylon2_x + 100, pylon_y, "Abeam - Lower Alt"),
        (540, pylon2_x, pylon_y + 150, "Past - Higher Alt"),
        (630, center_x, pylon_y, "Between"),
        (720, pylon1_x, pylon_y - 150, "Exit"),
    ]
    
    for i, (angle, x, y, label) in enumerate(positions):
        bank = 30 if (angle // 90) % 2 == 0 else -30
        
        steps.append(f'''<!-- Step {i+1}: {angle}° -->
      <g transform="translate({x}, {y}) rotate({angle - 90 + bank})">
        <path d="M 0 -12 L -18 12 L 0 5 L 18 12 Z" fill="#4169E1" stroke="white" stroke-width="2" opacity="0.8"/>
        <text x="0" y="-20" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#2C3E50" font-weight="bold">{i+1}</text>
      </g>
      <text x="{x}" y="{y + 25}" font-family="Arial, sans-serif" font-size="8" text-anchor="middle" fill="#2C3E50">{label.split(' - ')[-1] if ' - ' in label else ''}</text>''')
    
    svg = f'''<svg viewBox="0 0 {svg_width} {svg_height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="{svg_width}" height="{svg_height}" fill="#F5F5DC"/>
  
  <!-- Pylons -->
  <circle cx="{pylon1_x}" cy="{pylon_y}" r="12" fill="#E74C3C" stroke="#C0392B" stroke-width="2"/>
  <text x="{pylon1_x}" y="{pylon_y - 20}" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#E74C3C" font-weight="bold">Pylon 1</text>
  
  <circle cx="{pylon2_x}" cy="{pylon_y}" r="12" fill="#E74C3C" stroke="#C0392B" stroke-width="2"/>
  <text x="{pylon2_x}" y="{pylon_y - 20}" font-family="Arial, sans-serif" font-size="11" text-anchor="middle" fill="#E74C3C" font-weight="bold">Pylon 2</text>
  
  <!-- Flight path (figure-8 around pylons) -->
  <path d="M {pylon1_x} {pylon_y - 150} 
           A 100 150 0 0 1 {pylon1_x} {pylon_y + 150}
           Q {center_x} {pylon_y + 180} {pylon2_x} {pylon_y + 150}
           A 100 150 0 0 1 {pylon2_x} {pylon_y - 150}
           Q {center_x} {pylon_y - 180} {pylon1_x} {pylon_y - 150}" 
        fill="none" stroke="#1E90FF" stroke-width="3" stroke-dasharray="10,5" opacity="0.7"/>
  
  <!-- Aircraft positions -->
  {''.join(steps)}
  
  <!-- Altitude reference -->
  <text x="450" y="80" font-family="Arial, sans-serif" font-size="11" fill="#2C3E50" font-weight="bold">Altitude Changes:</text>
  <text x="450" y="100" font-family="Arial, sans-serif" font-size="9" fill="#2C3E50">Approach: Lower</text>
  <text x="450" y="115" font-family="Arial, sans-serif" font-size="9" fill="#2C3E50">Abeam: Lowest</text>
  <text x="450" y="130" font-family="Arial, sans-serif" font-size="9" fill="#2C3E50">Past: Highest</text>
  
  <!-- Key points -->
  <text x="30" y="50" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#2C3E50">Eights on Pylons Steps:</text>
  <text x="30" y="75" font-family="Arial, sans-serif" font-size="10" fill="#2C3E50">
    <tspan x="30" dy="0">1,5. Approach pylons: Higher altitude</tspan>
    <tspan x="30" dy="16">2,6. Abeam pylons: Lowest altitude</tspan>
    <tspan x="30" dy="16">3,7. Past pylons: Highest altitude</tspan>
    <tspan x="30" dy="16">4,8. Between pylons: Adjust altitude</tspan>
    <tspan x="30" dy="16">• Maintain pylon in reference position</tspan>
    <tspan x="30" dy="16">• Vary altitude to keep visual reference</tspan>
  </text>
  
  <!-- Title -->
  <text x="{svg_width // 2}" y="30" font-family="Arial, sans-serif" font-size="18" font-weight="bold" text-anchor="middle" fill="#2C3E50">
    Eights on Pylons - Step-by-Step
  </text>
</svg>'''
    return svg

def map_lesson_to_diagram_type(lesson: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Map lesson content to appropriate diagram types."""
    title_lower = lesson.get('title', '').lower()
    task_letter = lesson.get('taskLetter', '').upper()
    area = lesson.get('areaNumber', '')
    
    diagrams = []
    
    # Area VII - Takeoffs and Landings
    if area == 'VII':
        if 'takeoff' in title_lower and ('normal' in title_lower or task_letter == 'A'):
            diagrams.append({
                'type': 'takeoff-profile',
                'title': 'Normal Takeoff Profile',
                'description': 'Side view showing takeoff phases, pitch attitudes, and airspeeds',
                'svg': create_takeoff_profile_diagram(short_field=False),
                'keyPoints': [
                    'Ground roll to VR',
                    'Rotation at ~55 KIAS',
                    'Initial climb at VY',
                    'Maintain pitch and airspeed'
                ]
            })
        elif 'takeoff' in title_lower and ('short' in title_lower or 'field' in title_lower):
            diagrams.append({
                'type': 'takeoff-profile',
                'title': 'Short-Field Takeoff Profile',
                'description': 'Takeoff profile with obstacle clearance consideration',
                'svg': create_takeoff_profile_diagram(short_field=True),
                'keyPoints': [
                    'Maximum performance climb',
                    'Clear 50 ft obstacle',
                    'VX for obstacle clearance',
                    'Then VY for best rate'
                ]
            })
        elif 'landing' in title_lower and ('normal' in title_lower or task_letter == 'B'):
            diagrams.append({
                'type': 'landing-profile',
                'title': 'Normal Landing Profile',
                'description': 'Approach path, flare, and touchdown',
                'svg': create_landing_profile_diagram(short_field=False),
                'keyPoints': [
                    '3° glide path',
                    'Flare at 10-20 ft',
                    'Touchdown in first 1/3',
                    'Smooth rollout'
                ]
            })
        elif 'landing' in title_lower and ('short' in title_lower or 'field' in title_lower):
            diagrams.append({
                'type': 'landing-profile',
                'title': 'Short-Field Landing Profile',
                'description': 'Precise approach and touchdown',
                'svg': create_landing_profile_diagram(short_field=True),
                'keyPoints': [
                    'Steeper approach if needed',
                    'Aim for specific touchdown point',
                    'Minimum float during flare',
                    'Maximum braking after touchdown'
                ]
            })
        elif 'go-around' in title_lower or 'rejected' in title_lower:
            diagrams.append({
                'type': 'landing-profile',
                'title': 'Go-Around Procedure',
                'description': 'Rejected landing and climbout procedure',
                'svg': create_landing_profile_diagram(short_field=False),
                'keyPoints': [
                    'Apply full power immediately',
                    'Retract flaps incrementally',
                    'Establish positive climb',
                    'Maintain VY or VX'
                ]
            })
    
    # Area VI - Ground Reference Maneuvers
    if area == 'VI':
        if 'turn' in title_lower and 'point' in title_lower:
            diagrams.append({
                'type': 'ground-reference',
                'title': 'Turns Around a Point',
                'description': 'Top-down view showing flight path and wind correction',
                'svg': create_ground_reference_maneuver_svg('turns_around_point', 'W'),
                'keyPoints': [
                    'Maintain constant radius around point',
                    'Steeper bank upwind',
                    'Shallower bank downwind',
                    'Compensate for wind drift'
                ]
            })
        elif 's-turn' in title_lower or 's turn' in title_lower:
            diagrams.append({
                'type': 'ground-reference',
                'title': 'S-Turns Across a Road',
                'description': 'Top-down view showing S-turn pattern with wind correction',
                'svg': create_ground_reference_maneuver_svg('s_turns', 'W'),
                'keyPoints': [
                    'Enter perpendicular to reference',
                    'First turn away from wind',
                    'Complete 180° turn',
                    'Cross reference at 90°'
                ]
            })
        elif 'rectangular' in title_lower or 'course' in title_lower:
            diagrams.append({
                'type': 'ground-reference',
                'title': 'Rectangular Course',
                'description': 'Top-down view showing rectangular pattern with wind correction',
                'svg': create_ground_reference_maneuver_svg('rectangular_course', 'W'),
                'keyPoints': [
                    'Maintain 1/2 to 1 mile from course',
                    'Enter at 45° to downwind leg',
                    'Turn at reference points',
                    'Adjust bank for wind correction'
                ]
            })
    
    # Area IX - Performance and Ground Reference Maneuvers
    if area == 'IX':
        if task_letter == 'A' or ('steep' in title_lower and 'turn' in title_lower and 'spiral' not in title_lower):
            diagrams.append({
                'type': 'attitude',
                'title': 'Steep Turn - Attitude Indicator',
                'description': 'Instrument indication during 45° bank steep turn',
                'svg': create_steep_turn_diagram(),
                'keyPoints': [
                    '45° bank angle',
                    'Slight pitch up required',
                    'Maintain altitude',
                    'Coordinate with rudder'
                ]
            })
            diagrams.append({
                'type': 'flightPath',
                'title': 'Steep Turn - Flight Path',
                'description': 'Step-by-step view of aircraft position during steep turn',
                'svg': create_steep_turn_steps_diagram(),
                'keyPoints': [
                    'Entry at 45° bank',
                    'Maintain constant altitude',
                    'Lead rollout by 10°',
                    'Complete 360° turn'
                ]
            })
        elif task_letter == 'B' or 'spiral' in title_lower:
            diagrams.append({
                'type': 'flightPath',
                'title': 'Steep Spiral - Step-by-Step',
                'description': 'Descending spiral with altitude markers at each position',
                'svg': create_steep_spiral_diagram(),
                'keyPoints': [
                    'Enter at altitude (3000 ft)',
                    'Maintain 45° bank throughout',
                    'Descend ~500 ft per turn',
                    'Level off at minimum altitude'
                ]
            })
        elif task_letter == 'C' or 'chandelle' in title_lower:
            diagrams.append({
                'type': 'flightPath',
                'title': 'Chandelle - Step-by-Step',
                'description': 'Climbing and descending turn showing aircraft at each stage',
                'svg': create_chandelle_diagram(),
                'keyPoints': [
                    'First 180°: Climbing turn',
                    'Peak at 180°: Maximum pitch',
                    'Second 180°: Descending turn',
                    'Complete at entry altitude'
                ]
            })
        elif task_letter == 'D' or 'lazy eight' in title_lower or 'lazy 8' in title_lower:
            diagrams.append({
                'type': 'flightPath',
                'title': 'Lazy Eight - Step-by-Step',
                'description': 'Figure-8 pattern showing aircraft position and attitude changes',
                'svg': create_lazy_eight_diagram(),
                'keyPoints': [
                    'First loop: Climbing turn',
                    'Crossover: Level, reverse bank',
                    'Second loop: Descending turn',
                    '45° bank at peaks, 0° at crossover'
                ]
            })
        elif task_letter == 'E' or ('ground' in title_lower and 'reference' in title_lower):
            # Ground reference maneuvers - could include multiple types
            diagrams.append({
                'type': 'ground-reference',
                'title': 'Turns Around a Point',
                'description': 'Top-down view showing flight path and wind correction',
                'svg': create_ground_reference_maneuver_svg('turns_around_point', 'W'),
                'keyPoints': [
                    'Maintain constant radius around point',
                    'Steeper bank upwind',
                    'Shallower bank downwind',
                    'Compensate for wind drift'
                ]
            })
            diagrams.append({
                'type': 'ground-reference',
                'title': 'S-Turns Across a Road',
                'description': 'Top-down view showing S-turn pattern with wind correction',
                'svg': create_ground_reference_maneuver_svg('s_turns', 'W'),
                'keyPoints': [
                    'Enter perpendicular to reference',
                    'First turn away from wind',
                    'Complete 180° turn',
                    'Cross reference at 90°'
                ]
            })
        elif task_letter == 'F' or 'pylon' in title_lower or 'eight' in title_lower:
            diagrams.append({
                'type': 'ground-reference',
                'title': 'Eights on Pylons - Step-by-Step',
                'description': 'Aircraft position at each stage showing altitude changes relative to pylons',
                'svg': create_eights_on_pylons_diagram(),
                'keyPoints': [
                    'Approach pylons at higher altitude',
                    'Abeam pylons at lowest altitude',
                    'Past pylons at highest altitude',
                    'Maintain visual reference on pylon'
                ]
            })
    
    # Area X - Slow Flight and Stalls
    if area == 'X':
        if 'slow' in title_lower and 'flight' in title_lower:
            diagrams.append({
                'type': 'performance',
                'title': 'Slow Flight Configuration',
                'description': 'Aircraft attitude and power during slow flight',
                'svg': create_slow_flight_diagram(),
                'keyPoints': [
                    'High angle of attack',
                    'Increased power required',
                    'Elevated nose attitude',
                    'Just above stall speed'
                ]
            })
        elif 'stall' in title_lower:
            diagrams.append({
                'type': 'stall-characteristics',
                'title': 'Stall Progression',
                'description': 'Angle of attack progression from normal flight to stall',
                'svg': create_stall_progression_diagram(),
                'keyPoints': [
                    'Normal flight: ~4° AoA',
                    'Approaching stall: 12-15° AoA',
                    'Critical AoA: 16-18°',
                    'Recovery: Reduce AoA'
                ]
            })
    
    return diagrams

def main():
    """Update lesson plans with professional diagrams."""
    # Load lesson plans
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    updated_count = 0
    
    print("Creating professional diagrams for lesson plans...")
    print(f"Total lesson plans: {len(data['lessonPlans'])}")
    
    for lesson in data['lessonPlans']:
        # Get appropriate diagrams for this lesson
        new_diagrams = map_lesson_to_diagram_type(lesson)
        
        if new_diagrams:
            # Replace existing diagrams with professional ones
            lesson['diagrams'] = new_diagrams
            updated_count += 1
            print(f"Updated: {lesson['id']} - {lesson['title'][:50]}... ({len(new_diagrams)} diagrams)")
    
    # Save updated data
    with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n[SUCCESS] Updated {updated_count} lesson plans with professional diagrams")
    print(f"[SAVED] Updated lessonPlansData.json")

if __name__ == '__main__':
    main()

