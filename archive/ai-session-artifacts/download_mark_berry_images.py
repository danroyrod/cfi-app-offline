#!/usr/bin/env python3
"""
Download images from Mark Berry's CFI Notebook and integrate them into our lesson plans.
This script will:
1. Download images from Mark Berry's website
2. Save them to a local directory
3. Update lesson plans to reference these images
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
from urllib.request import urlopen
from urllib.error import URLError, HTTPError

# Base URL for Mark Berry's images
BASE_URL = "https://cfi.treklog.com/CFI_PTS_ASEL_r6"
IMG_BASE_URL = f"{BASE_URL}/img"

# Mapping of lesson IDs to Mark Berry's image files
# Based on examining the website
LESSON_IMAGES = {
    # Area IX - Performance and Ground Reference Maneuvers
    "LP-IX-A": [  # Steep Turns
        "HCL.png",  # Horizontal Component of Lift
        "LOAD_FACTOR.png",  # Load Factor chart
        "Skidding_Turn.png",  # Skidding turn
        "Slipping_Turn.png",  # Slipping turn
        "Path_of_Wing.png",  # Path of wing diagram
    ],
    "LP-IX-C": [  # Chandelles
        "Chandelle.png",
    ],
    "LP-IX-E": [  # Ground Reference Maneuvers (Turns Around a Point)
        "Turns_Around_a_Point.png",
    ],
    # Add more mappings as we discover them
}

# Alternative: Map by task letter and area
LESSON_IMAGES_BY_TASK = {
    # Area VI - Emergency Operations
    ("VI", "A"): [  # Radio Communications
        "light_signals.png",
    ],
    # Area VII - Takeoffs, Landings and Go-Arounds
    ("VII", "E"): [  # Short Field Takeoff
        "short_field1.png",
    ],
    # Area VIII - Fundamentals of Flight
    ("VIII", "B"): [  # Level Turns
        "TURN.png",
        "yaw.png",
        "Overbanking.png",
    ],
    ("VIII", "C"): [  # Straight Climbs and Climbing Turns
        "Forces_Climb.png",
        "VX_VY.png",
    ],
    ("VIII", "D"): [  # Straight Descents and Descending Turns
        "Descent.png",
    ],
    # Area IX - Performance and Ground Reference Maneuvers
    ("IX", "A"): [  # Steep Turns
        "HCL.png",
        "LOAD_FACTOR.png",
        "Skidding_Turn.png",
        "Slipping_Turn.png",
        "Path_of_Wing.png",
    ],
    ("IX", "B"): [  # Steep Spiral
        "Steep_Spiral.png",
        "Bank_Turn.png",
    ],
    ("IX", "C"): [  # Chandelles
        "Chandelle.png",
    ],
    ("IX", "D"): [  # Lazy Eights
        "Lazy_Eight.png",
    ],
    ("IX", "E"): [  # Ground Reference Maneuvers
        "Turns_around_Point.png",  # Note: lowercase 'around' in filename
        "STURNS.png",  # S-Turns Across a Road
    ],
    ("IX", "F"): [  # Eights on Pylons
        "Eights_on_Pylon.png",
        "pivotal_altitudes.png",
        "Eights_on_Pylon_LOS.png",
        "Eights_on_Pylon_altitudes.png",
    ],
    # Area X - Slow Flight, Stalls, and Spins
    ("X", "A"): [  # Maneuvering During Slow Flight
        "power_curve.jpg",
    ],
    ("X", "C"): [  # Power Off Stalls
        "P_OFF_STALL.png",
    ],
    ("X", "D"): [  # Power On Stalls
        "P_ON_STALL.png",
    ],
}

def download_image(img_filename: str, output_dir: Path) -> Optional[str]:
    """Download an image from Mark Berry's website."""
    img_url = f"{IMG_BASE_URL}/{img_filename}"
    output_path = output_dir / img_filename
    
    try:
        print(f"  Downloading {img_filename}...")
        with urlopen(img_url, timeout=10) as response:
            # Check if successful
            if response.status != 200:
                print(f"    Error: HTTP {response.status}")
                return None
            
            # Save image
            with open(output_path, 'wb') as f:
                f.write(response.read())
            
            print(f"    Saved to {output_path}")
            # Return path relative to project root for use in JSON
            try:
                return str(output_path.relative_to(Path.cwd()))
            except ValueError:
                # If path is outside cwd, return absolute path or just filename
                return str(output_path)
    except (URLError, HTTPError) as e:
        print(f"    Error downloading {img_filename}: {e}")
        return None
    except Exception as e:
        print(f"    Unexpected error downloading {img_filename}: {e}")
        return None

def get_images_for_lesson(area: str, task_letter: str, title: str) -> List[str]:
    """Get list of image filenames for a lesson based on area, task, and title."""
    title_lower = title.lower()
    
    # Check by area and task
    key = (area, task_letter.upper())
    if key in LESSON_IMAGES_BY_TASK:
        return LESSON_IMAGES_BY_TASK[key]
    
    # Check by title keywords (fallback if not in dictionary)
    images = []
    
    if area == "VI":
        if task_letter.upper() == "A" or ("radio" in title_lower and "communication" in title_lower):
            images = ["light_signals.png"]
    
    elif area == "VII":
        if task_letter.upper() == "E" or ("short" in title_lower and "field" in title_lower and "takeoff" in title_lower):
            images = ["short_field1.png"]
    
    elif area == "VIII":
        if task_letter.upper() == "B" or ("level" in title_lower and "turn" in title_lower):
            images = ["TURN.png", "yaw.png", "Overbanking.png"]
        elif task_letter.upper() == "C" or ("climb" in title_lower and "climbing" in title_lower):
            images = ["Forces_Climb.png", "VX_VY.png"]
        elif task_letter.upper() == "D" or ("descent" in title_lower and "descending" in title_lower):
            images = ["Descent.png"]
    
    elif area == "IX":
        if task_letter.upper() == "A" or ("steep" in title_lower and "turn" in title_lower and "spiral" not in title_lower):
            images = [
                "HCL.png",
                "LOAD_FACTOR.png",
                "Skidding_Turn.png",
                "Slipping_Turn.png",
                "Path_of_Wing.png",
            ]
        elif task_letter.upper() == "B" or ("steep" in title_lower and "spiral" in title_lower):
            images = ["Steep_Spiral.png", "Bank_Turn.png"]
        elif task_letter.upper() == "C" or "chandelle" in title_lower:
            images = ["Chandelle.png"]
        elif task_letter.upper() == "D" or "lazy" in title_lower and ("eight" in title_lower or "8" in title_lower):
            images = ["Lazy_Eight.png"]
        elif task_letter.upper() == "E" or ("ground" in title_lower and "reference" in title_lower):
            # Note: Mark Berry uses "Turns_around_Point.png" (lowercase 'around')
            # S-Turns image is also in this lesson since it covers all ground reference maneuvers
            images = ["Turns_around_Point.png", "STURNS.png"]
        elif task_letter.upper() == "F" or ("pylon" in title_lower or ("eight" in title_lower and "pylon" in title_lower)):
            images = [
                "Eights_on_Pylon.png",
                "pivotal_altitudes.png",
                "Eights_on_Pylon_LOS.png",
                "Eights_on_Pylon_altitudes.png",
            ]
    
    elif area == "X":
        if task_letter.upper() == "A" or ("slow" in title_lower and "flight" in title_lower):
            images = ["power_curve.jpg"]
        elif task_letter.upper() == "C" or ("power" in title_lower and "off" in title_lower and "stall" in title_lower):
            images = ["P_OFF_STALL.png"]
        elif task_letter.upper() == "D" or ("power" in title_lower and "on" in title_lower and "stall" in title_lower):
            images = ["P_ON_STALL.png"]
    
    return images

def update_lesson_with_images(lesson: Dict[str, Any], image_paths: List[str], base_url: str = "/images/mark-berry") -> Dict[str, Any]:
    """Update a lesson plan to include Mark Berry's images."""
    diagrams = lesson.get('diagrams', [])
    existing_image_urls = {d.get('imageUrl', '') for d in diagrams if d.get('imageUrl')}
    
    for img_path in image_paths:
        # img_path is already the full URL path like "/images/mark-berry/HCL.png"
        if base_url:
            # Extract filename and construct URL
            img_filename = os.path.basename(img_path)
            image_url = f"{base_url}/{img_filename}"
        else:
            # img_path is already the full URL
            image_url = img_path
            img_filename = os.path.basename(img_path)
        
        # Skip if already exists
        if image_url in existing_image_urls:
            continue
        
        # Create diagram entry
        alt_text = img_filename.replace('.png', '').replace('_', ' ')
        diagram_title = alt_text.title()
        
        # Determine diagram type and description based on filename
        diagram_type = "basic"
        description = f"Diagram from Mark Berry CFI Notebook: {alt_text}"
        
        if "HCL" in img_filename or "Horizontal" in img_filename or "Lift" in img_filename:
            diagram_type = "basic"
            description = "Horizontal and vertical components of lift in a turn"
            diagram_title = "Horizontal and Vertical Components of Lift"
        elif "LOAD_FACTOR" in img_filename or "Load" in img_filename:
            diagram_type = "performance"
            description = "Load factor chart showing relationship between bank angle and G-forces"
            diagram_title = "Load Factor vs. Bank Angle"
        elif "Skidding" in img_filename or "Slipping" in img_filename:
            diagram_type = "basic"
            description = "Visual comparison of turn coordination"
            diagram_title = alt_text.title()
        elif "Path_of_Wing" in img_filename or "Path" in img_filename:
            diagram_type = "basic"
            description = "Diagram showing path of wing tips in a turn (overbanking tendency)"
            diagram_title = "Path of Wing Tips in Turn"
        elif "Chandelle" in img_filename:
            diagram_type = "flightPath"
            description = "Chandelle maneuver visualization"
            diagram_title = "Chandelle Maneuver"
        elif "Turns_around" in img_filename or "Turns_Around" in img_filename:
            diagram_type = "ground-reference"
            description = "Turns around a point maneuver with wind correction"
            diagram_title = "Turns Around a Point"
        elif "STURNS" in img_filename or "S-Turns" in img_filename or "Sturns" in img_filename:
            diagram_type = "ground-reference"
            description = "S-turns across a road maneuver showing wind correction"
            diagram_title = "S-Turns Across a Road"
        elif "Steep_Spiral" in img_filename or "Steep Spiral" in img_filename:
            diagram_type = "flightPath"
            description = "Steep spiral maneuver showing descending pattern"
            diagram_title = "Steep Spiral Maneuver"
        elif "Bank_Turn" in img_filename or "Bank Turn" in img_filename:
            diagram_type = "basic"
            description = "Bank angle and turn coordination during rollout"
            diagram_title = "Rolling Out - Bank and Turn"
        elif "Lazy_Eight" in img_filename or "Lazy Eight" in img_filename:
            diagram_type = "flightPath"
            description = "Lazy eight maneuver showing figure-8 pattern"
            diagram_title = "Lazy Eight Maneuver"
        elif "Eights_on_Pylon" in img_filename or "Eights on Pylon" in img_filename:
            diagram_type = "ground-reference"
            description = "Eights on pylons maneuver with pivotal altitude"
            diagram_title = "Eights on Pylons"
        elif "pivotal_altitudes" in img_filename or "Pivotal Altitudes" in img_filename:
            diagram_type = "performance"
            description = "Pivotal altitude concept for eights on pylons"
            diagram_title = "Pivotal Altitudes"
        elif "Eights_on_Pylon_LOS" in img_filename:
            diagram_type = "basic"
            description = "Line of sight reference for eights on pylons"
            diagram_title = "Line of Sight Reference"
        elif "Eights_on_Pylon_altitudes" in img_filename:
            diagram_type = "performance"
            description = "Altitude changes during eights on pylons"
            diagram_title = "Altitude Changes - Eights on Pylons"
        elif "short_field" in img_filename.lower() or "Short Field" in img_filename:
            diagram_type = "flightPath"
            description = "Short field takeoff profile and technique"
            diagram_title = "Short Field Takeoff"
        elif "power_curve" in img_filename.lower() or "Power Curve" in img_filename:
            diagram_type = "performance"
            description = "Power curve showing thrust available vs. thrust required"
            diagram_title = "Power Curve"
        elif "P_ON_STALL" in img_filename or "Power On Stall" in img_filename:
            diagram_type = "basic"
            description = "Power-on stall recovery procedure"
            diagram_title = "Power-On Stall"
        elif "P_OFF_STALL" in img_filename or "Power Off Stall" in img_filename:
            diagram_type = "basic"
            description = "Power-off stall recovery procedure"
            diagram_title = "Power-Off Stall"
        elif "TURN.png" == img_filename or (img_filename.endswith(".png") and "TURN" in img_filename and len(img_filename) < 10):
            diagram_type = "basic"
            description = "Level turn forces and coordination"
            diagram_title = "Level Turn Forces"
        elif "yaw" in img_filename.lower():
            diagram_type = "basic"
            description = "Adverse yaw in turns"
            diagram_title = "Adverse Yaw"
        elif "Overbanking" in img_filename or "overbanking" in img_filename.lower():
            diagram_type = "basic"
            description = "Overbanking tendency in turns"
            diagram_title = "Overbanking Tendency"
        elif "Forces_Climb" in img_filename or "Forces" in img_filename and "Climb" in img_filename:
            diagram_type = "basic"
            description = "Forces acting on an aircraft in a climb"
            diagram_title = "Forces in a Climb"
        elif "VX_VY" in img_filename or "Vx" in img_filename or "Vy" in img_filename:
            diagram_type = "performance"
            description = "Best angle of climb (Vx) vs. best rate of climb (Vy)"
            diagram_title = "Vx vs. Vy"
        elif "Descent" in img_filename or "descent" in img_filename.lower():
            diagram_type = "basic"
            description = "Forces and techniques in a descent"
            diagram_title = "Descent Profile"
        elif "light_signals" in img_filename.lower() or "Light Signals" in img_filename:
            diagram_type = "basic"
            description = "ATC light gun signals and their meanings"
            diagram_title = "ATC Light Signals"
        
        diagrams.append({
            'type': diagram_type,
            'title': diagram_title,
            'description': description,
            'imageUrl': image_url,
            'keyPoints': [
                f"From Mark Berry CFI Notebook",
                "Professional aviation instruction diagram"
            ]
        })
    
    lesson['diagrams'] = diagrams
    return lesson

def main():
    """Main function to download images and update lesson plans."""
    print("=" * 70)
    print("Mark Berry CFI Notebook Image Integration")
    print("=" * 70)
    
    # Create images directory
    # For React apps, public directory is served from root
    images_dir = Path("public/images/mark-berry")
    images_dir.mkdir(parents=True, exist_ok=True)
    print(f"\nImages will be saved to: {images_dir.absolute()}")
    
    # Load lesson plans
    print("\nLoading lesson plans...")
    with open('src/lessonPlansData.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Track downloads
    downloaded_images = set()
    updated_lessons = []
    
    print(f"\nProcessing {len(data['lessonPlans'])} lesson plans...")
    print("=" * 70)
    
    for lesson in data['lessonPlans']:
        area = lesson.get('areaNumber', '')
        task_letter = lesson.get('taskLetter', '')
        title = lesson.get('title', '')
        lesson_id = lesson.get('id', '')
        
        # Get images for this lesson
        image_filenames = get_images_for_lesson(area, task_letter, title)
        
        if not image_filenames:
            continue
        
        print(f"\n[{lesson_id}] {title[:60]}")
        print(f"  Area {area}, Task {task_letter}")
        
        downloaded_paths = []
        for img_filename in image_filenames:
            if img_filename in downloaded_images:
                # Already downloaded, use the path
                downloaded_paths.append(str(images_dir / img_filename))
                continue
            
            path = download_image(img_filename, images_dir)
            if path:
                # Store the relative path for React (public/ is served from root)
                relative_path = f"/images/mark-berry/{img_filename}"
                downloaded_paths.append(relative_path)
                downloaded_images.add(img_filename)
        
        if downloaded_paths:
            # Update lesson with images
            lesson = update_lesson_with_images(lesson, downloaded_paths, base_url="")
            updated_lessons.append(lesson_id)
            print(f"  Updated lesson with {len(downloaded_paths)} image(s)")
    
    # Save updated lesson plans
    print("\n" + "=" * 70)
    if updated_lessons:
        print(f"Saving updated lesson plans...")
        with open('src/lessonPlansData.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"[SUCCESS] Updated {len(updated_lessons)} lesson plans")
        print(f"[SUCCESS] Downloaded {len(downloaded_images)} unique images")
        print(f"\nUpdated lessons: {', '.join(updated_lessons)}")
    else:
        print("No lesson plan updates needed.")
        if downloaded_images:
            print(f"[INFO] Downloaded {len(downloaded_images)} images but didn't update lessons (images may already be referenced)")

if __name__ == '__main__':
    main()

