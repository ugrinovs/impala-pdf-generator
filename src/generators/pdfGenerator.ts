/**
 * PDF Generator - Dual Implementation (SVG + HTML)
 */
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { PDFDocument } from 'pdf-lib';

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
  const { outputPath = process.cwd(), fleet16Path = path.join(__dirname, '../../Fleet-16'), method = 'html' } = options;
  
  console.log(`\n🚀 Generating PDF using ${method.toUpperCase()} method for ${data.candidate_name}...`);
  
  if (method === 'svg') {
    return generateSVGPDF(data, outputPath, fleet16Path);
  } else {
    return generateHTMLPDF(data, outputPath, fleet16Path);
  }
}

async function generateSVGPDF(data: CandidateData, outputPath: string, fleet16Path: string): Promise<string> {
  const tempDir = path.join(outputPath, '.tmp-svg');
  fs.mkdirSync(tempDir, { recursive: true });
  
  const pdfPages: string[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const templatePath = path.join(fleet16Path, `A4 - template${i}.svg`);
    const examplePath = path.join(fleet16Path, `A4 - example${i}.svg`);
    
    if (fs.existsSync(templatePath) || fs.existsSync(examplePath)) {
      let svgContent = fs.readFileSync(fs.existsSync(templatePath) ? templatePath : examplePath, 'utf-8');
      svgContent = fillSVGData(svgContent, data, i);
      
      const svgPath = path.join(tempDir, `page${i}.svg`);
      const pdfPath = path.join(tempDir, `page${i}.pdf`);
      fs.writeFileSync(svgPath, svgContent);
      
      try {
        execSync(`rsvg-convert -f pdf -o "${pdfPath}" "${svgPath}"`, { stdio: 'pipe' });
        pdfPages.push(pdfPath);
        console.log(`  ✓ Page ${i}`);
      } catch (e) {
        console.warn(`  ⚠ Page ${i} conversion failed`);
      }
    }
  }
  
  const finalPath = path.join(outputPath, `${data.candidate_name}_Report_SVG.pdf`);
  await mergePDFs(pdfPages, finalPath);
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(`\n✅ Generated: ${finalPath}`);
  return finalPath;
}

async function generateHTMLPDF(data: CandidateData, outputPath: string, fleet16Path: string): Promise<string> {
  const tempDir = path.join(outputPath, '.tmp-html');
  fs.mkdirSync(tempDir, { recursive: true });
  
  const pdfPages: string[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const html = generateHTMLPage(data, i);
    const htmlPath = path.join(tempDir, `page${i}.html`);
    const pdfPath = path.join(tempDir, `page${i}.pdf`);
    fs.writeFileSync(htmlPath, html);
    
    try {
      execSync(`wkhtmltopdf --page-size A4 --margin-top 0 --margin-bottom 0 --margin-left 0 --margin-right 0 "${htmlPath}" "${pdfPath}"`, { stdio: 'pipe' });
      pdfPages.push(pdfPath);
      console.log(`  ✓ Page ${i}`);
    } catch (e) {
      console.warn(`  ⚠ Page ${i} conversion failed (install wkhtmltopdf)`);
    }
  }
  
  const finalPath = path.join(outputPath, `${data.candidate_name}_Report_HTML.pdf`);
  await mergePDFs(pdfPages, finalPath);
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log(`\n✅ Generated: ${finalPath} (${pdfPages.length} pages)`);
  return finalPath;
}

function fillSVGData(svg: string, data: CandidateData, pageNum: number): string {
  svg = svg.replace(/Rastimir\s+Potencijalović/gi, data.candidate_name);
  svg = svg.replace(/RASTIMIR\s+POTENCIJALOVIĆ/gi, data.candidate_name.toUpperCase());
  svg = svg.replace(/\(name\)/g, data.candidate_name);
  svg = svg.replace(/\(His\/Hers\)/g, data.gender_pronoun || 'His');
  
  if (pageNum === 3 || pageNum === 4) {
    const scores = Object.values(data.hexaco_scores);
    let idx = 0;
    svg = svg.replace(/\(value\)/g, () => idx < scores.length ? scores[idx++].toFixed(2) : '(value)');
  }
  
  if (pageNum === 9) {
    const fit = calculateFitIndex(data.hexaco_scores, data.ideal_scores.hexaco);
    svg = svg.replace(/\( \)/g, `${fit.toFixed(1)}%`);
  }
  
  return svg;
}

function generateHTMLPage(data: CandidateData, pageNum: number): string {
  const styles = `<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4; margin: 0; }
    body { width: 210mm; height: 297mm; font-family: Arial, sans-serif; }
    .page { padding: 20mm; }
    .header { background: linear-gradient(135deg, #1a1a2e, #0f3460); color: white; padding: 20px; margin: -20mm -20mm 20px -20mm; }
    h1 { font-size: 24pt; margin-bottom: 10px; }
    h2 { font-size: 18pt; margin: 20px 0 10px 0; color: #0f3460; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #0f3460; color: white; }
  </style>`;
  
  if (pageNum === 1) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${styles}</head><body>
      <div class="page"><div class="header">
        <h1>${data.candidate_name.toUpperCase()} – RECRUITMENT & DEVELOPMENT FLOW</h1>
        <p>Position: ${data.profile_type || 'Not specified'} | Assessment Type: Integrated Evaluation</p>
      </div></div></body></html>`;
  }
  
  if (pageNum === 3) {
    const rows = Object.entries(data.hexaco_scores).map(([dim, score]) => {
      const ideal = data.ideal_scores.hexaco[dim];
      const fit = ((5 - Math.abs(ideal - score)) / 5 * 100).toFixed(1);
      return `<tr><td>${dim}</td><td>${score.toFixed(2)}</td><td>${ideal.toFixed(2)}</td><td>${fit}%</td></tr>`;
    }).join('');
    
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${styles}</head><body>
      <div class="page"><h2>HEXACO Assessment Results</h2>
      <table><thead><tr><th>Dimension</th><th>Score</th><th>Ideal</th><th>Fit</th></tr></thead>
      <tbody>${rows}</tbody></table></div></body></html>`;
  }
  
  return `<!DOCTYPE html><html><head><meta charset="UTF-8">${styles}</head><body>
    <div class="page"><h2>Page ${pageNum}</h2><p>${data.candidate_name} - Assessment Report</p></div></body></html>`;
}

function calculateFitIndex(scores: Record<string, number>, idealScores: Record<string, number>): number {
  const dims = Object.keys(scores);
  let total = 0;
  dims.forEach(dim => {
    const deviation = Math.abs(idealScores[dim] - scores[dim]);
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
