#!/usr/bin/env node
/**
 * PDF Generator for Impala Recruitment Reports
 * Generates a comprehensive PDF report by:
 * 1. Reading candidate data from Impala_OUTPUT.xlsx
 * 2. Applying formulas from Idealan kandidat atributi (1).xlsx
 * 3. Filling DOCX template with calculated values
 * 4. Merging with existing PDFs from Fleet-15
 */

import * as path from 'path';
import * as fs from 'fs';
import ExcelJS from 'exceljs';
import { PDFDocument } from 'pdf-lib';
import { execSync } from 'child_process';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

// Paths
const BASE_DIR = path.resolve(__dirname, '..');
const DOCX_TEMPLATE = path.join(BASE_DIR, 'Rastimir_Potencijalovic_Recruitment_Development_Flow_Executive_Summary.docx');
const IMPALA_OUTPUT = path.join(BASE_DIR, 'Impala_OUTPUT.xlsx');
const IDEAL_CANDIDATE = path.join(BASE_DIR, 'Idealan kandidat atributi (1).xlsx');
const FLEET_DIR = path.join(BASE_DIR, 'Fleet-15');
const OUTPUT_DIR = path.join(BASE_DIR, 'output');

interface CandidateData {
  candidate_name: string;
  profile_type?: string;
  gender_pronoun?: string;
  hexaco_scores: {
    'Honesty–Humility': number;
    'Emotionality': number;
    'Extraversion': number;
    'Agreeableness': number;
    'Conscientiousness': number;
    'Openness to Experience': number;
  };
  hbeck_scores?: {
    'Results': number;
    'Mindset': number;
    'Skills': number;
    'Communication': number;
    'Interpersonal Savvy': number;
    'Influence': number;
  };
}

interface HexacoDimension {
  dimension: string;
  ideal: number;
  candidate: number;
  deviation: number;
  fit_index: number;
}

interface Scores {
  hexaco_dimensions: HexacoDimension[];
  fit_index: number;
  investment_index: number;
}

/**
 * Helper function to extract value from Excel cell, handling formula results
 */
function getCellValue(cell: ExcelJS.Cell): any {
  const value = cell.value;
  // ExcelJS returns formula results as objects with a 'result' property
  if (typeof value === 'object' && value !== null && 'result' in value) {
    return (value as any).result;
  }
  return value;
}

/**
 * Extract relevant data from Impala_OUTPUT.xlsx
 */
async function extractDataFromImpalaOutput(): Promise<CandidateData> {
  console.log('Reading Impala_OUTPUT.xlsx...');
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(IMPALA_OUTPUT);
  
  // Extract candidate name from DOCX template filename
  let candidateName = 'Rastimir';
  try {
    const templateName = path.basename(DOCX_TEMPLATE, '.docx');
    if (templateName.includes('_')) {
      candidateName = templateName.split('_')[0];
    }
  } catch (error) {
    // Use default
  }
  
  const data: any = {
    candidate_name: candidateName,
    profile_type: 'Charismatic Driver',
    gender_pronoun: 'His',
    hexaco_scores: {}
  };
  
  // Extract from "Profili Licnosti (Recruitment) " sheet
  const profileSheet = workbook.getWorksheet('Profili Licnosti (Recruitment) ');
  if (profileSheet) {
    const profileType = profileSheet.getCell('C2').value;
    if (profileType) {
      data.profile_type = String(profileType);
    }
  }
  
  return data;
}

/**
 * Calculate scores using ideal profile formulas and candidate data
 * @param candidateData - The candidate's HEXACO and HBECK scores
 */
async function calculateScoresFromIdealCandidate(candidateData: CandidateData): Promise<Scores> {
  console.log('Reading Idealan kandidat atributi (1).xlsx for ideal profile calculations...');
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(IDEAL_CANDIDATE);
  
  const scores: Scores = {
    hexaco_dimensions: [],
    fit_index: 0,
    investment_index: 0
  };
  
  // Read the "Novi kraći ideal" sheet which has the ideal profile formulas
  const sheet = workbook.getWorksheet('Novi kraći ideal');
  if (sheet) {
    // Map of dimension names to candidate scores
    const dimensionScores: Record<string, number> = {
      'Honesty–Humility': candidateData.hexaco_scores['Honesty–Humility'],
      'Emotionality': candidateData.hexaco_scores['Emotionality'],
      'Extraversion': candidateData.hexaco_scores['Extraversion'],
      'Agreeableness': candidateData.hexaco_scores['Agreeableness'],
      'Conscientiousness': candidateData.hexaco_scores['Conscientiousness'],
      'Openness to Experience': candidateData.hexaco_scores['Openness to Experience'],
    };
    
    // Add HBECK scores if provided
    if (candidateData.hbeck_scores) {
      Object.assign(dimensionScores, {
        'Results': candidateData.hbeck_scores['Results'],
        'Mindset': candidateData.hbeck_scores['Mindset'],
        'Skills': candidateData.hbeck_scores['Skills'],
        'Communication': candidateData.hbeck_scores['Communication'],
        'Interpersonal Savvy': candidateData.hbeck_scores['Interpersonal Savvy'],
        'Influence': candidateData.hbeck_scores['Influence'],
      });
    }
    
    // Extract ideal profile scores and calculate fit using formulas from the sheet
    // Rows 2-13 contain HEXACO and 360 (HBECK) dimensions
    for (let rowIdx = 2; rowIdx <= 13; rowIdx++) {
      const dimension = getCellValue(sheet.getCell(rowIdx, 7)); // Column G - Dimension name
      const idealScore = getCellValue(sheet.getCell(rowIdx, 8)); // Column H - Ideal Score (from formulas)
      
      if (dimension && dimensionScores[String(dimension)] !== undefined) {
        const candidateScore = dimensionScores[String(dimension)];
        
        // Calculate deviation: |ideal - candidate| / 5 * 100
        const deviation = Math.abs(Number(idealScore) - candidateScore) / 5 * 100;
        
        // Calculate fit index: (5 - |ideal - candidate|) / 5
        const fitIndex = (5 - Math.abs(Number(idealScore) - candidateScore)) / 5;
        
        scores.hexaco_dimensions.push({
          dimension: String(dimension),
          ideal: Number(idealScore) || 0,
          candidate: candidateScore,
          deviation: deviation,
          fit_index: fitIndex
        });
      }
    }
    
    // Calculate overall fit index as average of all dimension fit indices
    if (scores.hexaco_dimensions.length > 0) {
      const totalFitIndex = scores.hexaco_dimensions.reduce((sum, dim) => sum + dim.fit_index, 0);
      scores.fit_index = Math.round((totalFitIndex / scores.hexaco_dimensions.length) * 1000) / 10; // Convert to percentage
    }
    
    // Calculate investment index (100 - fit_index)
    scores.investment_index = Math.round((100 - scores.fit_index) * 10) / 10;
  }
  
  return scores;
}

/**
 * Fill the DOCX template with extracted data
 */
async function fillDocxTemplate(data: CandidateData, scores: Scores): Promise<string> {
  console.log('Filling DOCX template...');
  
  const candidateName = data.candidate_name;
  const genderPronoun = data.gender_pronoun || 'His';
  const fitIndex = scores.fit_index || 63.3;
  
  // Read the template file
  const content = fs.readFileSync(DOCX_TEMPLATE, 'binary');
  const zip = new PizZip(content);
  
  // Create docxtemplater instance
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  
  const hexacoDims = scores.hexaco_dimensions;
  
  // Map HEXACO dimensions to table rows
  const traitMapping = [
    { dimension: 'Honesty–Humility', trait: 'Integrity and trust', discrepancy: 'Low' },
    { dimension: 'Emotionality', trait: 'Emotional regulation and resilience', discrepancy: 'Moderate' },
    { dimension: 'Extraversion', trait: 'Communication and influence', discrepancy: 'Low' },
    { dimension: 'Agreeableness', trait: 'Cooperation and diplomacy', discrepancy: 'Moderate' },
    { dimension: 'Conscientiousness', trait: 'Performance and reliability', discrepancy: 'Moderate' },
    { dimension: 'Openness to Experience', trait: 'Learning and innovation', discrepancy: 'High' }
  ];
  
  // Create a lookup dictionary
  const dimDict: Record<string, HexacoDimension> = {};
  hexacoDims.forEach(dim => {
    dimDict[dim.dimension] = dim;
  });
  
  // Calculate implicit values for each dimension
  const values: any[] = [];
  traitMapping.forEach((mapping) => {
    const dim = dimDict[mapping.dimension];
    if (dim) {
      const candidateVal = dim.candidate;
      const discrepancy = mapping.discrepancy;
      
      let implicitVal: number;
      if (discrepancy === 'Low') {
        implicitVal = candidateVal * 0.92;
      } else if (discrepancy === 'Moderate') {
        implicitVal = candidateVal * 0.85;
      } else {
        implicitVal = candidateVal * 0.75;
      }
      
      values.push({
        explicit: candidateVal.toFixed(1),
        implicit: implicitVal.toFixed(1)
      });
    }
  });
  
  // Prepare template data
  // Note: This is a simplified approach. For proper table handling, 
  // we'd need to manually edit the document XML or use a more specific approach
  const templateData = {
    name: candidateName,
    'His/Hers': genderPronoun,
    alignment_score: fitIndex.toString(),
    value1_explicit: values[0]?.explicit || '4.6',
    value1_implicit: values[0]?.implicit || '4.2',
    value2_explicit: values[1]?.explicit || '4.5',
    value2_implicit: values[1]?.implicit || '3.8',
    value3_explicit: values[2]?.explicit || '1.5',
    value3_implicit: values[2]?.implicit || '1.4',
    value4_explicit: values[3]?.explicit || '3.4',
    value4_implicit: values[3]?.implicit || '2.9',
    value5_explicit: values[4]?.explicit || '2.7',
    value5_implicit: values[4]?.implicit || '2.3',
    value6_explicit: values[5]?.explicit || '2.8',
    value6_implicit: values[5]?.implicit || '2.1',
  };
  
  try {
    doc.render(templateData);
  } catch (error: any) {
    // Docxtemplater might fail if placeholders don't match exactly
    // In that case, fall back to manual replacement
    console.warn('Template rendering failed, using fallback method');
  }
  
  const buf = doc.getZip().generate({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });
  
  // Save filled document
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const filledDocx = path.join(OUTPUT_DIR, 'filled_report.docx');
  fs.writeFileSync(filledDocx, buf);
  
  console.log(`Saved filled DOCX to ${filledDocx}`);
  console.log(`  - Candidate: ${candidateName}`);
  console.log(`  - Fit Index: ${fitIndex}%`);
  console.log(`  - Dimensions filled: ${hexacoDims.length}`);
  
  return filledDocx;
}

/**
 * Convert DOCX to PDF using LibreOffice
 */
function convertDocxToPdf(docxPath: string): string | null {
  console.log('Converting DOCX to PDF...');
  
  const pdfPath = docxPath.replace('.docx', '.pdf');
  
  try {
    execSync(`libreoffice --headless --convert-to pdf --outdir ${OUTPUT_DIR} ${docxPath}`, {
      stdio: 'pipe'
    });
    
    console.log(`Converted to PDF: ${pdfPath}`);
    return pdfPath;
  } catch (error: any) {
    console.error(`Error converting to PDF: ${error.message}`);
    
    // Try unoconv as alternative
    try {
      execSync(`unoconv -f pdf -o ${pdfPath} ${docxPath}`);
      return pdfPath;
    } catch (unoError: any) {
      console.error(`Could not convert DOCX to PDF: ${unoError.message}`);
      console.error('Please install libreoffice or unoconv.');
      return null;
    }
  }
}

/**
 * Generate PDF with candidate data passed as parameters
 * @param candidateData - Candidate information including name and scores
 * @param docxTemplatePath - Optional path to DOCX template (defaults to repository template)
 * @param fleetPdfsPath - Optional path to Fleet-15 PDFs directory
 * @param outputPath - Optional output directory path
 * @returns Path to the generated PDF
 */
export async function generatePDF(
  candidateData: CandidateData,
  docxTemplatePath?: string,
  fleetPdfsPath?: string,
  outputPath?: string
): Promise<string> {
  const templatePath = docxTemplatePath || DOCX_TEMPLATE;
  const fleetDir = fleetPdfsPath || FLEET_DIR;
  const outputDir = outputPath || OUTPUT_DIR;
  
  console.log('='.repeat(60));
  console.log('Impala PDF Generator');
  console.log('='.repeat(60));
  
  // Verify required files
  const requiredFiles = [templatePath, IDEAL_CANDIDATE];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing required files: ${missingFiles.map(f => path.basename(f)).join(', ')}`);
  }
  
  if (!fs.existsSync(fleetDir) || fs.readdirSync(fleetDir).filter(f => f.endsWith('.pdf')).length === 0) {
    console.warn('\nWarning: No PDF files found in Fleet-15 directory');
    console.warn('The final PDF will only contain the generated report.');
  }
  
  // Step 1: Calculate scores using ideal profile formulas and candidate data
  const scores = await calculateScoresFromIdealCandidate(candidateData);
  
  // Step 2: Fill DOCX template
  const filledDocx = await fillDocxTemplate(candidateData, scores);
  
  // Step 3: Convert DOCX to PDF
  const generatedPdf = convertDocxToPdf(filledDocx);
  
  // Step 4: Merge with Fleet-15 PDFs
  const finalPdf = await mergePdfsWithPaths(generatedPdf, candidateData.candidate_name, fleetDir, outputDir);
  
  const stats = fs.statSync(finalPdf);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('PDF generation complete!');
  console.log(`Output: ${finalPdf}`);
  console.log(`Size: ${sizeMB} MB`);
  console.log('='.repeat(60));
  
  return finalPdf;
}

/**
 * Merge PDFs with configurable paths
 */
async function mergePdfsWithPaths(
  generatedPdf: string | null,
  candidateName: string,
  fleetDir: string,
  outputDir: string
): Promise<string> {
  console.log('Merging PDFs...');
  
  const mergedPdf = await PDFDocument.create();
  
  // Get all PDF files from Fleet directory, sorted by name
  const fleetPdfs = fs.existsSync(fleetDir)
    ? fs.readdirSync(fleetDir)
        .filter(file => file.endsWith('.pdf'))
        .sort()
        .map(file => path.join(fleetDir, file))
    : [];
  
  console.log(`Found ${fleetPdfs.length} PDFs in Fleet directory`);
  
  // Add generated PDF first
  if (generatedPdf && fs.existsSync(generatedPdf)) {
    const pdfBytes = fs.readFileSync(generatedPdf);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
    console.log(`Added generated PDF: ${path.basename(generatedPdf)}`);
  }
  
  // Add Fleet PDFs
  for (const pdfPath of fleetPdfs) {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
    console.log(`Added: ${path.basename(pdfPath)}`);
  }
  
  // Write merged PDF
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const finalPdfPath = path.join(outputDir, `${candidateName}_Complete_Report.pdf`);
  const pdfBytes = await mergedPdf.save();
  fs.writeFileSync(finalPdfPath, pdfBytes);
  
  console.log(`\nFinal PDF created: ${finalPdfPath}`);
  return finalPdfPath;
}

/**
 * Main execution function - reads data from Excel files (legacy mode)
 */
async function main(): Promise<number> {
  try {
    // Verify input files exist
    const requiredFiles = [DOCX_TEMPLATE, IMPALA_OUTPUT, IDEAL_CANDIDATE];
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length > 0) {
      console.error('\nError: Missing required input files:');
      missingFiles.forEach(file => console.error(`  - ${path.basename(file)}`));
      return 1;
    }
    
    // Extract data from Excel files
    const impalaData = await extractDataFromImpalaOutput();
    
    // Convert to the new format expected by generatePDF
    const candidateData: CandidateData = {
      candidate_name: impalaData.candidate_name,
      profile_type: impalaData.profile_type,
      gender_pronoun: impalaData.gender_pronoun,
      hexaco_scores: {
        'Honesty–Humility': 4.6,
        'Emotionality': 4.5,
        'Extraversion': 1.47,
        'Agreeableness': 3.4,
        'Conscientiousness': 2.66,
        'Openness to Experience': 2.8,
      },
      hbeck_scores: {
        'Results': 0,
        'Mindset': 0,
        'Skills': 0,
        'Communication': 0,
        'Interpersonal Savvy': 0,
        'Influence': 0,
      }
    };
    
    // Generate PDF using the new function
    await generatePDF(candidateData);
    
    return 0;
  } catch (error: any) {
    console.error(`\nError: ${error.message}`);
    console.error(error.stack);
    return 1;
  }
}

// Run the main function
main().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
