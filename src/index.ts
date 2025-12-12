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
  ideal_scores: {
    hexaco: {
      'Honesty–Humility': number;
      'Emotionality': number;
      'Extraversion': number;
      'Agreeableness': number;
      'Conscientiousness': number;
      'Openness to Experience': number;
    };
    hbeck?: {
      'Results': number;
      'Mindset': number;
      'Skills': number;
      'Communication': number;
      'Interpersonal Savvy': number;
      'Influence': number;
    };
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
 * Extract relevant data from Impala_OUTPUT.xlsx (legacy mode)
 * Returns minimal data - scores should be extracted separately
 */
async function extractDataFromImpalaOutput(): Promise<{ candidate_name: string; profile_type: string; gender_pronoun: string }> {
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
  
  // Note: This function is for legacy mode only
  // In practice, the extracted hexaco_scores should come from the Impala_OUTPUT Excel file
  // For now, returning minimal data structure since new API accepts scores as parameters
  const data = {
    candidate_name: candidateName,
    profile_type: 'Charismatic Driver',
    gender_pronoun: 'His'
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
 * Calculate scores using ideal profile and candidate data
 * @param candidateData - The candidate's HEXACO and HBECK scores with ideal scores
 */
async function calculateScoresFromIdealCandidate(candidateData: CandidateData): Promise<Scores> {
  console.log('Calculating fit indices using candidate and ideal scores...');
  
  const scores: Scores = {
    hexaco_dimensions: [],
    fit_index: 0,
    investment_index: 0
  };
  
  // Map of dimension names to candidate scores and ideal scores
  const dimensionData: Record<string, { candidate: number; ideal: number }> = {
    'Honesty–Humility': {
      candidate: candidateData.hexaco_scores['Honesty–Humility'],
      ideal: candidateData.ideal_scores.hexaco['Honesty–Humility']
    },
    'Emotionality': {
      candidate: candidateData.hexaco_scores['Emotionality'],
      ideal: candidateData.ideal_scores.hexaco['Emotionality']
    },
    'Extraversion': {
      candidate: candidateData.hexaco_scores['Extraversion'],
      ideal: candidateData.ideal_scores.hexaco['Extraversion']
    },
    'Agreeableness': {
      candidate: candidateData.hexaco_scores['Agreeableness'],
      ideal: candidateData.ideal_scores.hexaco['Agreeableness']
    },
    'Conscientiousness': {
      candidate: candidateData.hexaco_scores['Conscientiousness'],
      ideal: candidateData.ideal_scores.hexaco['Conscientiousness']
    },
    'Openness to Experience': {
      candidate: candidateData.hexaco_scores['Openness to Experience'],
      ideal: candidateData.ideal_scores.hexaco['Openness to Experience']
    },
  };
  
  // Add HBECK scores if provided
  if (candidateData.hbeck_scores && candidateData.ideal_scores.hbeck) {
    Object.assign(dimensionData, {
      'Results': {
        candidate: candidateData.hbeck_scores['Results'],
        ideal: candidateData.ideal_scores.hbeck['Results']
      },
      'Mindset': {
        candidate: candidateData.hbeck_scores['Mindset'],
        ideal: candidateData.ideal_scores.hbeck['Mindset']
      },
      'Skills': {
        candidate: candidateData.hbeck_scores['Skills'],
        ideal: candidateData.ideal_scores.hbeck['Skills']
      },
      'Communication': {
        candidate: candidateData.hbeck_scores['Communication'],
        ideal: candidateData.ideal_scores.hbeck['Communication']
      },
      'Interpersonal Savvy': {
        candidate: candidateData.hbeck_scores['Interpersonal Savvy'],
        ideal: candidateData.ideal_scores.hbeck['Interpersonal Savvy']
      },
      'Influence': {
        candidate: candidateData.hbeck_scores['Influence'],
        ideal: candidateData.ideal_scores.hbeck['Influence']
      },
    });
  }
  
  // Calculate fit for each dimension
  for (const [dimension, data] of Object.entries(dimensionData)) {
    const candidateScore = data.candidate;
    const idealScore = data.ideal;
    
    // Calculate deviation: |ideal - candidate| / 5 * 100
    const deviation = Math.abs(idealScore - candidateScore) / 5 * 100;
    
    // Calculate fit index: (5 - |ideal - candidate|) / 5
    const fitIndex = (5 - Math.abs(idealScore - candidateScore)) / 5;
    
    scores.hexaco_dimensions.push({
      dimension: dimension,
      ideal: idealScore,
      candidate: candidateScore,
      deviation: deviation,
      fit_index: fitIndex
    });
  }
  
  // Calculate overall fit index as average of all dimension fit indices
  if (scores.hexaco_dimensions.length > 0) {
    const totalFitIndex = scores.hexaco_dimensions.reduce((sum, dim) => sum + dim.fit_index, 0);
    scores.fit_index = Math.round((totalFitIndex / scores.hexaco_dimensions.length) * 1000) / 10; // Convert to percentage
  }
  
  // Calculate investment index (100 - fit_index)
  scores.investment_index = Math.round((100 - scores.fit_index) * 10) / 10;
  
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
  
  // Get the document XML
  let documentXml = zip.file('word/document.xml')?.asText();
  
  if (!documentXml) {
    throw new Error('Could not read document.xml from template');
  }
  
  // Replace placeholders with actual values
  // Replace (name) with candidate name
  documentXml = documentXml.replace(/\(name\)/g, candidateName);
  
  // Replace hardcoded "Rastimir" and "RASTIMIR POTENCIJALOVIĆ" with the candidate name
  // This handles the template-specific content that's not in placeholder format
  // Use word boundaries to avoid unintended replacements
  documentXml = documentXml.replace(/RASTIMIR POTENCIJALOVIĆ/g, candidateName.toUpperCase());
  documentXml = documentXml.replace(/\bRastimir\b/g, candidateName);
  
  // Replace (His/Hers) with gender pronoun
  documentXml = documentXml.replace(/\(His\/Hers\)/g, genderPronoun);
  
  // Replace "his" references to match the gender pronoun (if it's a possessive pronoun)
  // Map possessive pronouns: His -> his, Her -> her, Hers -> her
  let lowerPronoun = genderPronoun.toLowerCase();
  if (lowerPronoun === 'hers') {
    lowerPronoun = 'her'; // "Hers" as lowercase possessive is "her"
  }
  // Only replace standalone "his" references in text (not in XML tags or attributes)
  if (genderPronoun && (genderPronoun === 'His' || genderPronoun === 'Her' || genderPronoun === 'Hers')) {
    documentXml = documentXml.replace(/\bhis\b/g, lowerPronoun);
    documentXml = documentXml.replace(/\bHis\b/g, genderPronoun === 'Hers' ? 'Her' : genderPronoun);
  }
  
  // Replace ( ) with fit index when it appears near "alignment score"
  // We need to be careful to only replace the one near alignment score
  const alignmentScorePattern = /(alignment score[^<]*?)(\( \))/gi;
  documentXml = documentXml.replace(alignmentScorePattern, `$1${fitIndex}%`);
  
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
  
  // Calculate implicit values for each dimension and replace (value) placeholders
  let valueReplacementCount = 0;
  const expectedReplacements = traitMapping.length * 2; // 2 values per trait (explicit + implicit)
  
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
      
      // Replace the next two occurrences of (value) with explicit and implicit values
      // This assumes the template has (value) pairs for each trait row
      const explicitValue = candidateVal.toFixed(1);
      const implicitValue = implicitVal.toFixed(1);
      
      // Replace first occurrence (explicit value)
      if (documentXml.includes('(value)')) {
        documentXml = documentXml.replace('(value)', explicitValue);
        valueReplacementCount++;
      }
      
      // Replace second occurrence (implicit value)
      if (documentXml.includes('(value)')) {
        documentXml = documentXml.replace('(value)', implicitValue);
        valueReplacementCount++;
      }
    }
  });
  
  // Verify we replaced the expected number of values
  if (valueReplacementCount !== expectedReplacements) {
    console.warn(`Warning: Expected ${expectedReplacements} value replacements but made ${valueReplacementCount}`);
  }
  
  // Update the document XML in the zip
  zip.file('word/document.xml', documentXml);
  
  const buf = zip.generate({
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
  console.log(`  - Value replacements: ${valueReplacementCount}`);
  
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
 * @param fleetPdfsPath - Optional path to Fleet-15 PDFs directory (set to null to skip Fleet PDFs)
 * @param outputPath - Optional output directory path
 * @returns Path to the generated PDF
 */
export async function generatePDF(
  candidateData: CandidateData,
  docxTemplatePath?: string,
  fleetPdfsPath?: string | null,
  outputPath?: string
): Promise<string> {
  const templatePath = docxTemplatePath || DOCX_TEMPLATE;
  const fleetDir = fleetPdfsPath === null ? null : (fleetPdfsPath || FLEET_DIR);
  const outputDir = outputPath || OUTPUT_DIR;
  
  console.log('='.repeat(60));
  console.log('Impala PDF Generator');
  console.log('='.repeat(60));
  
  // Verify required files (only template is required, ideal scores are passed as parameters)
  const requiredFiles = [templatePath];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing required files: ${missingFiles.map(f => path.basename(f)).join(', ')}`);
  }
  
  // Check Fleet-15 directory and warn if using default with different candidate
  if (fleetDir) {
    if (!fs.existsSync(fleetDir) || fs.readdirSync(fleetDir).filter(f => f.endsWith('.pdf')).length === 0) {
      console.warn('\nWarning: No PDF files found in Fleet-15 directory');
      console.warn('The final PDF will only contain the generated report.');
    } else if (fleetDir === FLEET_DIR && candidateData.candidate_name.toLowerCase() !== 'rastimir') {
      console.warn('\n' + '!'.repeat(60));
      console.warn('WARNING: Using default Fleet-15 PDFs with a different candidate!');
      console.warn(`The Fleet-15 PDFs contain assessment data for "Rastimir",`);
      console.warn(`but you're generating a report for "${candidateData.candidate_name}".`);
      console.warn(`To exclude Fleet PDFs, pass null as the fleetPdfsPath parameter.`);
      console.warn('!'.repeat(60) + '\n');
    }
  } else {
    console.log('\nSkipping Fleet-15 PDFs as requested (fleetPdfsPath = null)');
  }
  
  // Step 1: Calculate scores using candidate data and ideal scores
  const scores = await calculateScoresFromIdealCandidate(candidateData);
  
  // Step 2: Fill DOCX template
  const filledDocx = await fillDocxTemplate(candidateData, scores);
  
  // Step 3: Convert DOCX to PDF
  const generatedPdf = convertDocxToPdf(filledDocx);
  
  // Step 4: Merge with Fleet-15 PDFs (if fleetDir is not null)
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
  fleetDir: string | null,
  outputDir: string
): Promise<string> {
  console.log('Merging PDFs...');
  
  const mergedPdf = await PDFDocument.create();
  
  // Get all PDF files from Fleet directory, sorted by name (only if fleetDir is provided)
  const fleetPdfs = fleetDir && fs.existsSync(fleetDir)
    ? fs.readdirSync(fleetDir)
        .filter(file => file.endsWith('.pdf'))
        .sort()
        .map(file => path.join(fleetDir, file))
    : [];
  
  if (fleetDir) {
    console.log(`Found ${fleetPdfs.length} PDFs in Fleet directory`);
  } else {
    console.log('Skipping Fleet PDFs (fleetPdfsPath = null)');
  }
  
  // Add generated PDF first
  if (generatedPdf && fs.existsSync(generatedPdf)) {
    const pdfBytes = fs.readFileSync(generatedPdf);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach(page => mergedPdf.addPage(page));
    console.log(`Added generated PDF: ${path.basename(generatedPdf)}`);
  }
  
  // Add Fleet PDFs (only if not skipped)
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
    
    // Read candidate scores from Impala_OUTPUT.xlsx "Novi kraći ideal" sheet
    // Column I: Candidate scores
    // Column H: Ideal scores
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(IDEAL_CANDIDATE);
    const sheet = workbook.getWorksheet('Novi kraći ideal');
    
    const hexacoScores: any = {};
    const hbeckScores: any = {};
    const hexacoIdealScores: any = {};
    const hbeckIdealScores: any = {};
    
    if (sheet) {
      // Read candidate and ideal scores from columns I and H (rows 2-13)
      // Rows 2-7: HEXACO dimensions
      // Rows 8-13: HBECK/360 dimensions
      const dimensionNames = [
        'Honesty–Humility',
        'Emotionality', 
        'Extraversion',
        'Agreeableness',
        'Conscientiousness',
        'Openness to Experience',
        'Results',
        'Mindset',
        'Skills',
        'Communication',
        'Interpersonal Savvy',
        'Influence'
      ];
      
      for (let i = 0; i < dimensionNames.length; i++) {
        const rowIdx = i + 2;
        const candidateScore = getCellValue(sheet.getCell(rowIdx, 9)); // Column I - Candidate
        const idealScore = getCellValue(sheet.getCell(rowIdx, 8)); // Column H - Ideal
        
        if (i < 6) {
          hexacoScores[dimensionNames[i]] = Number(candidateScore) || 0;
          hexacoIdealScores[dimensionNames[i]] = Number(idealScore) || 0;
        } else {
          hbeckScores[dimensionNames[i]] = Number(candidateScore) || 0;
          hbeckIdealScores[dimensionNames[i]] = Number(idealScore) || 0;
        }
      }
    }
    
    // Convert to the new format expected by generatePDF
    const candidateData: CandidateData = {
      candidate_name: impalaData.candidate_name,
      profile_type: impalaData.profile_type,
      gender_pronoun: impalaData.gender_pronoun,
      hexaco_scores: hexacoScores,
      hbeck_scores: hbeckScores,
      ideal_scores: {
        hexaco: hexacoIdealScores,
        hbeck: hbeckIdealScores
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

// Run the main function only if this is the main module
if (require.main === module) {
  main().then(exitCode => {
    process.exit(exitCode);
  }).catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}
