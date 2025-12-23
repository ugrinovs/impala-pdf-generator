/**
 * Example usage of the Impala PDF Generator
 * 
 * This file demonstrates how to use the generateDevelopmentReport function
 * to create PDFs from participant data.
 * 
 * Run with: node examples/basic-usage.js
 */

import { generateDevelopmentReport } from '../dist/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Example 1: Generate PDF with custom participant data
async function generateCustomReport() {
  console.log('Example 1: Generating PDF with custom participant data...');
  
  const participantData = {
    fullName: 'Alice Johnson',
    flow_name: 'Executive Assessment',
    position_name: 'Senior Product Manager',
    assessment_type: 'HEXACO + HBECK 360 Assessment',
    recruitmentProfile: 'Charismatic Driver',
    gender: 'female',
    neuroCorrectionCorrected: {
      H: '4.2',
      E: '3.8',
      X: '4.5',
      A: '4.0',
      C: '4.3',
      O: '4.1'
    },
    neuroCorrectionRaw: {
      H: 4.2,
      E: 3.8,
      X: 4.5,
      A: 4.0,
      C: 4.3,
      O: 4.1
    },
    hbeckResult: {
      H: 4.0,
      E: 3.5,
      X: 4.2,
      A: 3.8,
      C: 4.5,
      O: 3.9
    },
    idealCandidateResults: [
      { result: 4.0 },
      { result: 3.5 },
      { result: 4.0 },
      { result: 4.0 },
      { result: 4.5 },
      { result: 3.5 }
    ]
  };

  try {
    const base64Pdf = await generateDevelopmentReport(participantData);
    
    // Decode base64 and save to file
    const buffer = Buffer.from(base64Pdf, 'base64');
    const outputPath = path.join(__dirname, 'output-custom.pdf');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✓ PDF generated successfully!`);
    console.log(`  - Output: ${outputPath}`);
    console.log(`  - Size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log('');
  } catch (error) {
    console.error('✗ Error generating PDF:', error.message);
  }
}

// Example 2: Generate PDF with default example data
async function generateExampleReport() {
  console.log('Example 2: Generating PDF with default example data...');
  
  try {
    // generateDevelopmentReport uses default example data when called without arguments
    const base64Pdf = await generateDevelopmentReport();
    
    const buffer = Buffer.from(base64Pdf, 'base64');
    const outputPath = path.join(__dirname, 'output-example.pdf');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✓ PDF generated successfully!`);
    console.log(`  - Output: ${outputPath}`);
    console.log(`  - Size: ${(buffer.length / 1024).toFixed(2)} KB`);
    console.log('');
  } catch (error) {
    console.error('✗ Error generating PDF:', error.message);
  }
}

// Example 3: Generate multiple PDFs for different candidates
async function generateBatchReports() {
  console.log('Example 3: Generating multiple PDFs...');
  
  const candidates = [
    {
      fullName: 'Bob Smith',
      gender: 'male',
      position_name: 'Software Engineer'
    },
    {
      fullName: 'Carol White',
      gender: 'female',
      position_name: 'Team Lead'
    }
  ];

  for (const candidate of candidates) {
    try {
      const participantData = {
        fullName: candidate.fullName,
        flow_name: 'Recruitment Flow',
        position_name: candidate.position_name,
        assessment_type: 'HEXACO Assessment',
        recruitmentProfile: 'Stable team player',
        gender: candidate.gender,
        neuroCorrectionCorrected: {
          H: '3.5',
          E: '3.5',
          X: '3.5',
          A: '3.5',
          C: '3.5',
          O: '3.5'
        },
        neuroCorrectionRaw: {
          H: 3.5,
          E: 3.5,
          X: 3.5,
          A: 3.5,
          C: 3.5,
          O: 3.5
        },
        hbeckResult: {
          H: 3.5,
          E: 3.5,
          X: 3.5,
          A: 3.5,
          C: 3.5,
          O: 3.5
        },
        idealCandidateResults: [
          { result: 3.5 },
          { result: 3.5 },
          { result: 3.5 },
          { result: 3.5 },
          { result: 3.5 },
          { result: 3.5 }
        ]
      };

      const base64Pdf = await generateDevelopmentReport(participantData);
      const buffer = Buffer.from(base64Pdf, 'base64');
      const filename = candidate.fullName.replace(/\s+/g, '-').toLowerCase();
      const outputPath = path.join(__dirname, `output-${filename}.pdf`);
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`✓ Generated PDF for ${candidate.fullName}`);
    } catch (error) {
      console.error(`✗ Error generating PDF for ${candidate.fullName}:`, error.message);
    }
  }
  console.log('');
}

// Run all examples
async function main() {
  console.log('='.repeat(60));
  console.log('Impala PDF Generator - Usage Examples');
  console.log('='.repeat(60));
  console.log('');

  await generateCustomReport();
  await generateExampleReport();
  await generateBatchReports();

  console.log('='.repeat(60));
  console.log('All examples completed!');
  console.log('Check the examples/ directory for generated PDFs.');
  console.log('='.repeat(60));
}

// Run if executed directly
main().catch(console.error);
