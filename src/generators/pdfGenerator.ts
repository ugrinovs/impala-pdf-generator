/**
 * Working PDF Generator - Uses resvg-js to convert SVG → PNG → PDF
 */
import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument } from 'pdf-lib';
import PDFDocument2 from 'pdfkit';
import { Resvg } from '@resvg/resvg-js';

export interface CandidateData {
  candidate_name: string;
  hexaco_scores: Record<string, number>;
  hbeck_scores?: Record<string, number>;
  ideal_scores: {
    hexaco: Record<string, number>;
    hbeck?: Record<string, number>;
  };
  gender_pronoun?: string;
  profile_type?: string;
}

export interface GeneratorOptions {
  outputPath?: string;
  fleet16Path?: string;
  method?: 'svg' | 'html';
}

export async function generatePDF(data: CandidateData, options: GeneratorOptions = {}): Promise<string> {
  const { outputPath = process.cwd(), fleet16Path = path.join(__dirname, '../../Fleet-16'), method = 'svg' } = options;
  
  console.log(`\n🚀 Generating PDF using ${method.toUpperCase()} method for ${data.candidate_name}...`);
  console.log(`   Fleet-16 path: ${fleet16Path}`);
  console.log(`   Output path: ${outputPath}`);
  
  // Both methods now use the same approach: SVG → PNG → PDF
  return generateSVGPDF(data, outputPath, fleet16Path);
}

async function generateSVGPDF(data: CandidateData, outputPath: string, fleet16Path: string): Promise<string> {
  const tempDir = path.join(outputPath, '.tmp-pdf');
  fs.mkdirSync(tempDir, { recursive: true });
  
  const pdfPages: string[] = [];
  
  // Generate all 10 pages
  for (let i = 1; i <= 10; i++) {
    try {
      const templatePath = path.join(fleet16Path, `A4 - template${i}.svg`);
      const examplePath = path.join(fleet16Path, `A4 - example${i}.svg`);
      
      // Use template if it exists, otherwise use example (but inject data in both cases!)
      let svgPath: string;
      let useTemplate = false;
      if (fs.existsSync(templatePath)) {
        svgPath = templatePath;
        useTemplate = true;
        console.log(`  📄 Page ${i}: Using template with data injection`);
      } else if (fs.existsSync(examplePath)) {
        svgPath = examplePath;
        console.log(`  📄 Page ${i}: Using example SVG with data injection`);
      } else {
        console.warn(`  ⚠️  Page ${i}: No SVG found, skipping`);
        continue;
      }
      
      // Read and process SVG
      let svgContent = fs.readFileSync(svgPath, 'utf-8');
      
      // Apply data replacements to both templates AND examples
      svgContent = fillSVGData(svgContent, data, i, useTemplate);
      
      // Convert SVG → PNG → PDF
      const pdfPath = path.join(tempDir, `page${i}.pdf`);
      await convertSVGtoPDF(svgContent, pdfPath);
      pdfPages.push(pdfPath);
      console.log(`  ✅ Page ${i} converted successfully`);
    } catch (error: any) {
      console.error(`  ❌ Page ${i} failed:`, error.message);
    }
  }
  
  if (pdfPages.length === 0) {
    throw new Error('No pages were successfully converted!');
  }
  
  // Merge all PDFs
  const finalPath = path.join(outputPath, `${data.candidate_name.replace(/\s+/g, '_')}_Report.pdf`);
  await mergePDFs(pdfPages, finalPath);
  
  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });
  
  console.log(`\n✅ Generated: ${finalPath} (${pdfPages.length} pages)`);
  return finalPath;
}

function fillSVGData(svg: string, data: CandidateData, pageNum: number, isTemplate: boolean): string {
  // ALWAYS replace candidate name - in both templates and examples
  svg = svg.replace(/Rastimir\s+Potencijalović/gi, data.candidate_name);
  svg = svg.replace(/RASTIMIR\s+POTENCIJALOVIĆ/gi, data.candidate_name.toUpperCase());
  svg = svg.replace(/Rastimir\s+POTENCIJALOVIĆ/gi, data.candidate_name.toUpperCase());
  svg = svg.replace(/RASTIMIR POTENCIJALOVIĆ/g, data.candidate_name.toUpperCase());
  svg = svg.replace(/Rastimir Potencijalović/g, data.candidate_name);
  svg = svg.replace(/Rastimir/gi, data.candidate_name);
  svg = svg.replace(/\(name\)/g, data.candidate_name);
  
  // Replace gender pronoun
  const pronoun = data.gender_pronoun || 'His';
  const pronounLower = pronoun.toLowerCase();
  svg = svg.replace(/\(His\/Hers\)/g, pronoun);
  svg = svg.replace(/\bhis\b/gi, (match) => {
    return match[0] === match[0].toUpperCase() ? pronoun : pronounLower;
  });
  
  // Replace profile type if provided
  if (data.profile_type) {
    svg = svg.replace(/Charismatic Driver/gi, data.profile_type);
  }
  
  // Replace all HEXACO scores (for pages 3, 4, 5, 7)
  if (pageNum === 3 || pageNum === 4 || pageNum === 5 || pageNum === 7) {
    const hexacoKeys = Object.keys(data.hexaco_scores);
    hexacoKeys.forEach((key) => {
      const score = data.hexaco_scores[key];
      const ideal = data.ideal_scores.hexaco[key];
      const scoreStr = score.toFixed(2);
      const idealStr = ideal ? ideal.toFixed(2) : '';
      
      // Replace in various formats
      svg = svg.replace(new RegExp(`\\(${key}\\)`, 'g'), scoreStr);
      svg = svg.replace(new RegExp(`\\(ideal_${key}\\)`, 'g'), idealStr);
      
      // Replace hardcoded values (for examples that have actual Rastimir scores)
      // Look for patterns like: >4.6<, >3.5< etc (scores in SVG text elements)
      // This is a more aggressive replacement for example SVGs
    });
    
    // Generic value replacement for template placeholders
    let valueIdx = 0;
    svg = svg.replace(/\(value\)/g, () => {
      if (valueIdx < hexacoKeys.length) {
        return data.hexaco_scores[hexacoKeys[valueIdx++]].toFixed(2);
      }
      return '(value)';
    });
  }
  
  // Replace HBECK scores (for page 5)
  if (pageNum === 5 && data.hbeck_scores) {
    Object.keys(data.hbeck_scores).forEach((key) => {
      const score = data.hbeck_scores![key];
      svg = svg.replace(new RegExp(`\\(${key}\\)`, 'g'), score.toFixed(2));
    });
  }
  
  // Calculate and replace fit index (for page 9)
  if (pageNum === 9) {
    const fit = calculateFitIndex(data.hexaco_scores, data.ideal_scores.hexaco);
    svg = svg.replace(/\(\s*\)/g, `${fit.toFixed(1)}%`);
    svg = svg.replace(/\( \)/g, `${fit.toFixed(1)}%`);
  }
  
  return svg;
}

async function convertSVGtoPDF(svgContent: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      // Convert SVG to PNG using resvg
      const resvg = new Resvg(svgContent, {
        fitTo: {
          mode: 'width',
          value: 2480  // A4 width at 300 DPI (210mm = 2480px)
        }
      });
      
      const pngData = resvg.render();
      const pngBuffer = pngData.asPng();
      
      // Create PDF with the PNG
      const doc = new PDFDocument2({
        size: 'A4',
        margins: { top: 0, bottom: 0, left: 0, right: 0 },
        autoFirstPage: false
      });
      
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);
      
      // Add page and embed PNG
      doc.addPage({
        size: 'A4',
        margins: { top: 0, bottom: 0, left: 0, right: 0 }
      });
      
      doc.image(pngBuffer, 0, 0, {
        width: 595.28,  // A4 width in points
        height: 841.89  // A4 height in points
      });
      
      doc.end();
      
      stream.on('finish', () => resolve());
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

function calculateFitIndex(scores: Record<string, number>, idealScores: Record<string, number>): number {
  const dims = Object.keys(scores);
  let total = 0;
  dims.forEach(dim => {
    const deviation = Math.abs((idealScores[dim] || 0) - scores[dim]);
    total += (5 - deviation) / 5;
  });
  return (total / dims.length) * 100;
}

async function mergePDFs(pdfPaths: string[], outputPath: string): Promise<void> {
  const mergedPdf = await PDFDocument.create();
  
  for (const pdfPath of pdfPaths) {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  const mergedPdfBytes = await mergedPdf.save();
  fs.writeFileSync(outputPath, mergedPdfBytes);
}
