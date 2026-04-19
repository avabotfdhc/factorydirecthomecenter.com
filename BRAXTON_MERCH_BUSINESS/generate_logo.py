
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import PathPatch, Circle, FancyBboxPatch, Arc, Wedge, Polygon
from matplotlib.path import Path
import numpy as np

# Colors
ROYAL_BLUE = '#4169E1'
BRIGHT_RED = '#E63946'
DARK_CHARCOAL = '#2D2D2D'

def create_b_mountains(ax, x_offset=0, y_offset=0, scale=1.0, show_text=True, show_sun=True):
    """Create the B mountain logo element"""
    s = scale
    
    # Outer boundary - B shape with mountain peaks
    outer_vertices = [
        (18*s + x_offset, 10*s + y_offset),      # Bottom left
        (18*s + x_offset, 45*s + y_offset),      # Up stem
        (18*s + x_offset, 88*s + y_offset),      # Top left
        # First mountain peak (top curve of B)
        (28*s + x_offset, 93*s + y_offset),      # Start curve
        (42*s + x_offset, 97*s + y_offset),      # First peak - highest point
        (55*s + x_offset, 92*s + y_offset),      # Down from peak
        (62*s + x_offset, 82*s + y_offset),      # Toward valley
        (58*s + x_offset, 72*s + y_offset),      # Valley point
        # Second mountain peak (bottom curve of B)
        (65*s + x_offset, 78*s + y_offset),      # Up to second peak
        (78*s + x_offset, 82*s + y_offset),      # Second peak
        (88*s + x_offset, 72*s + y_offset),      # Down from peak
        (92*s + x_offset, 55*s + y_offset),      # Right side middle
        (92*s + x_offset, 38*s + y_offset),      # Continue down
        (88*s + x_offset, 25*s + y_offset),      # Bottom right
        (75*s + x_offset, 18*s + y_offset),      # Bottom curve
        (58*s + x_offset, 22*s + y_offset),      # Continue
        (42*s + x_offset, 18*s + y_offset),      # Toward stem
        (18*s + x_offset, 10*s + y_offset),      # Back to start
    ]

    outer_codes = [Path.MOVETO] + [Path.LINETO] * (len(outer_vertices) - 2) + [Path.CLOSEPOLY]
    outer_path = Path(outer_vertices, outer_codes)
    outer_patch = PathPatch(outer_path, facecolor=ROYAL_BLUE, edgecolor=ROYAL_BLUE, linewidth=0, zorder=2)
    ax.add_patch(outer_patch)

    # Upper bowl cutout (white space)
    upper_inner = [
        (26*s + x_offset, 58*s + y_offset),      # Bottom of upper bowl (middle of B)
        (26*s + x_offset, 72*s + y_offset),      # Up left side
        (32*s + x_offset, 80*s + y_offset),      # Curve
        (42*s + x_offset, 84*s + y_offset),      # Top inner
        (52*s + x_offset, 80*s + y_offset),      # Down right side
        (56*s + x_offset, 72*s + y_offset),      # Toward middle
        (48*s + x_offset, 62*s + y_offset),      # Middle connection
        (26*s + x_offset, 58*s + y_offset),      # Close
    ]
    upper_codes = [Path.MOVETO] + [Path.LINETO] * (len(upper_inner) - 2) + [Path.CLOSEPOLY]
    upper_path = Path(upper_inner, upper_codes)
    upper_patch = PathPatch(upper_path, facecolor='white', edgecolor='white', linewidth=0, zorder=3)
    ax.add_patch(upper_patch)

    # Lower bowl cutout (white space)
    lower_inner = [
        (26*s + x_offset, 20*s + y_offset),      # Bottom of lower bowl
        (26*s + x_offset, 35*s + y_offset),      # Up left side
        (32*s + x_offset, 42*s + y_offset),      # Curve
        (50*s + x_offset, 45*s + y_offset),      # Right side inner
        (72*s + x_offset, 42*s + y_offset),      # Further right
        (78*s + x_offset, 50*s + y_offset),      # Up
        (82*s + x_offset, 58*s + y_offset),      # Top of lower bowl
        (70*s + x_offset, 55*s + y_offset),      # Back down
        (52*s + x_offset, 50*s + y_offset),      # Continue
        (38*s + x_offset, 42*s + y_offset),      # Toward stem
        (26*s + x_offset, 35*s + y_offset),      # Back
        (26*s + x_offset, 20*s + y_offset),      # Close
    ]
    lower_codes = [Path.MOVETO] + [Path.LINETO] * (len(lower_inner) - 2) + [Path.CLOSEPOLY]
    lower_path = Path(lower_inner, lower_codes)
    lower_patch = PathPatch(lower_path, facecolor='white', edgecolor='white', linewidth=0, zorder=3)
    ax.add_patch(lower_patch)

    if show_sun:
        # Add the sun (red circle) setting behind the mountain peaks
        sun = Circle((62*s + x_offset, 86*s + y_offset), 7*s, facecolor=BRIGHT_RED, edgecolor='none', zorder=1)
        ax.add_patch(sun)

    if show_text:
        # Add the handwritten "'s" in red
        ax.text(94*s + x_offset, 50*s + y_offset, "'s", fontsize=38*s, color=BRIGHT_RED, fontweight='normal', 
                ha='left', va='center', zorder=4, style='italic',
                family='cursive')

        # Add "WILD AND WONDER" text below
        ax.text(50*s + x_offset, 3*s + y_offset, "WILD AND WONDER", fontsize=22*s, color=DARK_CHARCOAL, 
                fontweight='bold', ha='center', va='center', zorder=4,
                family='sans-serif')

# Create the main logo
fig1, ax1 = plt.subplots(1, 1, figsize=(12, 12), dpi=300)
ax1.set_xlim(0, 110)
ax1.set_ylim(0, 105)
ax1.set_aspect('equal')
ax1.axis('off')
fig1.patch.set_facecolor('white')

create_b_mountains(ax1, x_offset=5, y_offset=5, scale=1.0, show_text=True, show_sun=True)

plt.tight_layout(pad=0)
plt.savefig('/Users/ava/.openclaw/workspace/BRAXTON_MERCH_BUSINESS/logo_final.png', 
            dpi=300, bbox_inches='tight', pad_inches=0.3, facecolor='white')
plt.close()

print("Main logo saved to logo_final.png")

# Create the square icon version (just B with 's, no text)
fig2, ax2 = plt.subplots(1, 1, figsize=(10, 10), dpi=300)
ax2.set_xlim(0, 100)
ax2.set_ylim(0, 100)
ax2.set_aspect('equal')
ax2.axis('off')
fig2.patch.set_facecolor('white')

# Draw just the B mountains with 's, centered, no sun for cleaner icon look
create_b_mountains(ax2, x_offset=2, y_offset=5, scale=0.95, show_text=False, show_sun=True)

# Add just the 's
ax2.text(91, 50, "'s", fontsize=36, color=BRIGHT_RED, fontweight='normal', 
        ha='left', va='center', zorder=4, style='italic',
        family='cursive')

plt.tight_layout(pad=0)
plt.savefig('/Users/ava/.openclaw/workspace/BRAXTON_MERCH_BUSINESS/logo_icon.png', 
            dpi=300, bbox_inches='tight', pad_inches=0.1, facecolor='white')
plt.close()

print("Icon logo saved to logo_icon.png")
