import os
import re
import json

base_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.join(base_dir, '../../')
floor_plans_path = os.path.join(workspace_dir, 'src/lib/floor-plans.ts')
images_dir = os.path.join(workspace_dir, 'public/images')
pdfs_dir = os.path.join(images_dir, 'floor-plans/pdfs')

with open(floor_plans_path, 'r', encoding='utf-8') as f:
    content = f.read()

available_pdfs = []
if os.path.exists(pdfs_dir):
    available_pdfs = [f for f in os.listdir(pdfs_dir) if f.endswith('.pdf')]

# Generic images using full list of 1-7 (or 1-8 for modular)
single_wides = [f"/images/2026-03-22-singlewide-{n}.png" for n in range(1, 8)]
double_wides = [f"/images/2026-03-22-doublewide-{n}.png" for n in range(1, 8)]
modulars = [f"/images/2026-03-22-modular-{n}.png" for n in range(1, 9)]

s_idx, d_idx, m_idx = 0, 0, 0

def replacement(match):
    global s_idx, d_idx, m_idx
    slug = match.group(1)
    attributes = match.group(2)
    
    hero_image = '/images/hero-home.jpg'
    gallery_images = []
    pdf_url = None
    
    # Check folder
    folder_path = os.path.join(images_dir, 'floor-plans', slug)
    if os.path.exists(folder_path) and os.path.isdir(folder_path):
        files = [f for f in os.listdir(folder_path) if f.endswith('.jpg') or f.endswith('.png')]
        if files:
            ext_files = [f for f in files if 'exterior-1.jpg' in f or 'exterior-edit' in f]
            if ext_files:
                hero_image = f"/images/floor-plans/{slug}/{ext_files[0]}"
            else:
                hero_image = f"/images/floor-plans/{slug}/{files[0]}"
            gallery_images = [f"/images/floor-plans/{slug}/{f}" for f in files]
    else:
        # Generic fallback
        if 'type: "Single Wide"' in attributes:
            hero_image = single_wides[s_idx % len(single_wides)]
            s_idx += 1
        elif 'type: "Modular"' in attributes:
            hero_image = modulars[m_idx % len(modulars)]
            m_idx += 1
        elif 'type: "Double Wide"' in attributes:
            hero_image = double_wides[d_idx % len(double_wides)]
            d_idx += 1
            
    # PDF
    fp_pdf = f"{slug}-floor-plan.pdf"
    sales_pdf = f"{slug}-sales.pdf"
    if fp_pdf in available_pdfs:
        pdf_url = f"/images/floor-plans/pdfs/{fp_pdf}"
    elif sales_pdf in available_pdfs:
        pdf_url = f"/images/floor-plans/pdfs/{sales_pdf}"
        
    # Replace the existing heroImage line inside attributes
    new_attrs = re.sub(r'heroImage: "[^"]+"', f'heroImage: "{hero_image}"', attributes)
    
    if gallery_images or pdf_url:
        injections = []
        if gallery_images:
            injections.append(f' galleryImages: {json.dumps(gallery_images)}')
        if pdf_url:
            injections.append(f' pdfUrl: "{pdf_url}"')
            
        inj_str = ",".join(injections) + ","
        new_attrs = re.sub(r'(heroImageAlt: "[^"]+",)', r'\1' + inj_str, new_attrs)
        
    return f'{{ slug: "{slug}",{new_attrs}}}'

updated_content = re.sub(r'{ slug: "([^"]+)",([^}]+)}', replacement, content)

with open(floor_plans_path, 'w', encoding='utf-8') as f:
    f.write(updated_content)
    
print("Successfully mapped images to floor-plans.ts")
