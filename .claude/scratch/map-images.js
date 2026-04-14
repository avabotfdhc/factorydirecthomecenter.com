const fs = require('fs');
const path = require('path');

const floorPlansPath = path.join(__dirname, '../../src/lib/floor-plans.ts');
const publicImagesPath = path.join(__dirname, '../../public/images');
const pdfsPath = path.join(publicImagesPath, 'floor-plans/pdfs');

let content = fs.readFileSync(floorPlansPath, 'utf8');

// Get all PDFs
const availablePdfs = fs.existsSync(pdfsPath) ? fs.readdirSync(pdfsPath).filter(f => f.endsWith('.pdf')) : [];

// Generic generics
const singleWides = [1, 2, 3, 4, 5, 6, 7].map(n => `/images/2026-03-22-singlewide-${n}.png`);
const doubleWides = [1, 2, 3, 4, 5, 6, 7].map(n => `/images/2026-03-22-doublewide-${n}.png`);
const modulars = [1, 2, 3, 4, 5, 6, 7, 8].map(n => `/images/2026-03-22-modular-${n}.png`);

let sIdx = 0, dIdx = 0, mIdx = 0;

const regex = /{ slug: "([^"]+)",([^}]+)}/g;

const updatedContent = content.replace(regex, (match, slug, attributes) => {
  let heroImage = '/images/hero-home.jpg';
  let galleryImages = [];
  let pdfUrl = undefined;

  // 1. Check for dedicated folder
  const folderPath = path.join(publicImagesPath, 'floor-plans', slug);
  if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    if (files.length > 0) {
      // Find exterior-1 for hero if exists, otherwise first file
      const exterior = files.find(f => f.includes('exterior-1.jpg') || f.includes('exterior-edit.jpg'));
      if (exterior) {
        heroImage = `/images/floor-plans/${slug}/${exterior}`;
      } else {
        heroImage = `/images/floor-plans/${slug}/${files[0]}`;
      }
      
      galleryImages = files.map(f => `/images/floor-plans/${slug}/${f}`);
    }
  } else {
    // 2. Generic fallback based on Type
    if (attributes.includes('type: "Single Wide"')) {
      heroImage = singleWides[sIdx % singleWides.length];
      sIdx++;
    } else if (attributes.includes('type: "Modular"')) {
      heroImage = modulars[mIdx % modulars.length];
      mIdx++;
    } else if (attributes.includes('type: "Double Wide"')) {
      heroImage = doubleWides[dIdx % doubleWides.length];
      dIdx++;
    }
  }

  // 3. Find PDF
  // Priority: floor-plan > sales
  const fpPdf = availablePdfs.find(p => p === `${slug}-floor-plan.pdf`);
  const salesPdf = availablePdfs.find(p => p === `${slug}-sales.pdf`);
  if (fpPdf) {
    pdfUrl = `/images/floor-plans/pdfs/${fpPdf}`;
  } else if (salesPdf) {
    pdfUrl = `/images/floor-plans/pdfs/${salesPdf}`;
  }

  // 4. Inject attributes back via regex replace on the original 'attributes' string
  // It currently has `heroImage: "/images/hero-home.jpg"` or similar. Let's replace heroImage
  let newAttrs = attributes.replace(/heroImage: "[^"]+"/, `heroImage: "${heroImage}"`);

  // Insert galleryImages and pdfUrl right after heroImageAlt if we have them
  if (galleryImages.length > 0 || pdfUrl) {
    let injections = [];
    if (galleryImages.length > 0) {
      injections.push(` galleryImages: ${JSON.stringify(galleryImages)}`);
    }
    if (pdfUrl) {
      injections.push(` pdfUrl: "${pdfUrl}"`);
    }
    
    newAttrs = newAttrs.replace(/(heroImageAlt: "[^"]+",)/, `$1${injections.join(',')},`);
  }

  return `{ slug: "${slug}",${newAttrs}}`;
});

fs.writeFileSync(floorPlansPath, updatedContent, 'utf8');
console.log('Mapping completed successfully.');
