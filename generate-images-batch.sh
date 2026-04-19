#!/bin/bash
# Generate remaining 44 images for FDHC website
# Runs overnight - check results in the morning

cd ~/.openclaw/workspace/factorydirecthomescenter.com/public/images

# Hero/Lifestyle (2 more)
uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Beautiful manufactured home in autumn, fall colors, leaves changing, cozy atmosphere. Cream siding, teal shutters, warm lighting. Midwest setting." --filename "2026-03-22-hero-autumn.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Modern manufactured home in winter, light snow on roof, smoke from chimney, warm lights inside. Cozy inviting scene." --filename "2026-03-22-hero-winter.png" --resolution 2K --aspect-ratio 16:9

# Single Wide Variations (7)
for i in 1 2 3 4 5 6 7; do
  uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Single wide manufactured home exterior, variation $i, cream siding teal accents, professional real estate photo" --filename "2026-03-22-singlewide-$i.png" --resolution 2K --aspect-ratio 16:9
done

# Double Wide Variations (7)
for i in 1 2 3 4 5 6 7; do
  uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Double wide manufactured home exterior, variation $i, spacious porch, cream and teal colors, professional photo" --filename "2026-03-22-doublewide-$i.png" --resolution 2K --aspect-ratio 16:9
done

# Modular Homes (8)
for i in 1 2 3 4 5 6 7 8; do
  uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Modular home on permanent foundation, site-built appearance, variation $i, cream siding teal trim, garage" --filename "2026-03-22-modular-$i.png" --resolution 2K --aspect-ratio 16:9
done

# Interior - Kitchens (3)
uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Modern manufactured home kitchen, island with seating, white cabinets, stainless appliances, open concept, bright natural light" --filename "2026-03-22-kitchen-1.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Spacious kitchen in double wide home, granite countertops, farmhouse sink, pendant lights, warm inviting colors" --filename "2026-03-22-kitchen-2.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Compact efficient kitchen in single wide, modern appliances, clever storage, bright and clean design" --filename "2026-03-22-kitchen-3.png" --resolution 2K --aspect-ratio 16:9

# Interior - Living Rooms (3)
uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Open concept living room in manufactured home, vaulted ceilings, large windows, comfortable furniture, neutral colors with teal accents" --filename "2026-03-22-living-1.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Cozy living room with fireplace, built-in shelves, comfortable sectional sofa, warm lighting, family friendly" --filename "2026-03-22-living-2.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Modern living room, large windows, natural light, minimalist decor, connection to dining area" --filename "2026-03-22-living-3.png" --resolution 2K --aspect-ratio 16:9

# Interior - Bedrooms (2)
uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Master bedroom in manufactured home, king bed, walk-in closet visible, en-suite bathroom, calming neutral colors" --filename "2026-03-22-bedroom-master.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Guest bedroom, twin beds, bright and cheerful, functional furniture, cozy atmosphere" --filename "2026-03-22-bedroom-guest.png" --resolution 2K --aspect-ratio 16:9

# Interior - Bathrooms (2)
uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Modern bathroom in manufactured home, walk-in shower, double vanity, white and teal color scheme, clean bright" --filename "2026-03-22-bathroom-master.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Compact bathroom, tub shower combo, efficient layout, modern fixtures, clean design" --filename "2026-03-22-bathroom-guest.png" --resolution 2K --aspect-ratio 16:9

# Process/Trust (5)
uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Manufactured home factory interior, home being built on assembly line, quality construction, workers, industrial setting" --filename "2026-03-22-process-factory.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Delivery truck transporting manufactured home section on highway, professional delivery service" --filename "2026-03-22-process-delivery.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Crane setting manufactured home section onto foundation, professional installation, construction site" --filename "2026-03-22-process-install.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Happy couple receiving keys to new home from salesperson, smiling, new manufactured home in background, celebration" --filename "2026-03-22-process-keys.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Finished manufactured home with landscaping, sod, flowers, completed driveway, move-in ready" --filename "2026-03-22-process-complete.png" --resolution 2K --aspect-ratio 16:9

# Regional/Midwest (5)
uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Manufactured home in Indiana countryside, cornfield backdrop, blue sky, rural setting, peaceful" --filename "2026-03-22-region-indiana.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Manufactured home near Michigan lake, waterfront setting, dock visible, summer scene, relaxing" --filename "2026-03-22-region-michigan.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Manufactured home on Ohio farmland, rolling hills, barn in distance, pastoral setting" --filename "2026-03-22-region-ohio.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Manufactured home in Wisconsin woods, pine trees, natural setting, peaceful retreat" --filename "2026-03-22-region-wisconsin.png" --resolution 2K --aspect-ratio 16:9

uv run /opt/homebrew/lib/node_modules/openclaw/skills/nano-banana-pro/scripts/generate_image.py --prompt "Manufactured home in Kentucky rolling hills, horse fence, bluegrass, southern charm" --filename "2026-03-22-region-kentucky.png" --resolution 2K --aspect-ratio 16:9

echo "All 44 images generated successfully!"
ls -la *.png | wc -l