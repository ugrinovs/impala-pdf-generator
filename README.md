# Impala PDF Generator

This tool generates comprehensive PDF recruitment reports by:
1. Reading candidate data from `Impala_OUTPUT.xlsx`
2. Applying formulas and calculations from `Idealan kandidat atributi (1).xlsx`
3. Filling the DOCX template (`Rastimir_Potencijalovic_Recruitment_Development_Flow_Executive_Summary.docx`) with calculated values
4. Converting the filled DOCX to PDF
5. Merging with existing assessment PDFs from `Fleet-15/` directory

## Requirements

- Node.js 18+ and npm
- LibreOffice (for DOCX to PDF conversion)

## Installation

Install dependencies:

```bash
npm install
```

Install LibreOffice (for PDF conversion):

```bash
# Ubuntu/Debian
sudo apt-get install libreoffice-writer libreoffice-core

# macOS
brew install --cask libreoffice

# Windows
# Download and install from https://www.libreoffice.org/
```

## Usage

### Option 1: As a Library (Recommended)

Import and use the `generatePDF` function with your candidate data:

```typescript
import { generatePDF } from './src/index';

const candidateData = {
  candidate_name: 'John Smith',
  gender_pronoun: 'His', // Optional, defaults to 'His'
  profile_type: 'Charismatic Driver', // Optional
  
  // HEXACO personality scores (1-5 scale)
  hexaco_scores: {
    'Honesty–Humility': 4.6,
    'Emotionality': 4.5,
    'Extraversion': 1.47,
    'Agreeableness': 3.4,
    'Conscientiousness': 2.66,
    'Openness to Experience': 2.8,
  },
  
  // Optional: HBECK (360) scores (1-5 scale)
  hbeck_scores: {
    'Results': 3.5,
    'Mindset': 4.0,
    'Skills': 3.8,
    'Communication': 4.2,
    'Interpersonal Savvy': 3.9,
    'Influence': 4.1,
  },
  
  // Ideal profile scores for comparison
  ideal_scores: {
    hexaco: {
      'Honesty–Humility': 4.5,
      'Emotionality': 2.5,
      'Extraversion': 1.0,
      'Agreeableness': 2.5,
      'Conscientiousness': 4.5,
      'Openness to Experience': 3.5,
    },
    hbeck: { // Optional
      'Results': 1.5,
      'Mindset': 2.5,
      'Skills': 4.5,
      'Communication': 3.5,
      'Interpersonal Savvy': 1.5,
      'Influence': 2.5,
    }
  }
};

// Generate PDF
const pdfPath = await generatePDF(candidateData);
console.log(`PDF generated: ${pdfPath}`);
```

Run the example:

```bash
npm run build
node dist/example.js
```

### Option 2: Command Line (Legacy)

Build and run the generator using data from Excel files:

```bash
npm run generate
```

Or for development:

```bash
npm run dev
```

The script will:
1. Read ideal profile formulas from `Idealan kandidat atributi (1).xlsx`
2. Use candidate scores (passed as parameters or from Excel)
3. Calculate fit indices based on ideal profile
4. Fill the DOCX template with personalized data
5. Convert to PDF
6. Merge all PDFs together

The final output will be generated at:
```
output/{CandidateName}_Complete_Report.pdf
```

## Input Files

The generator expects the following files in the repository root:

- `Rastimir_Potencijalovic_Recruitment_Development_Flow_Executive_Summary.docx` - Template document with placeholders
- `Impala_OUTPUT.xlsx` - Candidate assessment data
- `Idealan kandidat atributi (1).xlsx` - Ideal candidate profile and formulas
- `Fleet-15/*.pdf` - Individual assessment page PDFs to be merged

## Output

The generator creates an `output/` directory containing:

- `filled_report.docx` - DOCX with filled placeholders
- `filled_report.pdf` - PDF version of the filled report
- `Rastimir_Potencijalovic_Complete_Report.pdf` - Final merged PDF with all pages

## How It Works

1. **Score Calculation**: Uses candidate scores and ideal profile scores (passed as parameters) to calculate:
   - Deviation from ideal profile: `|ideal - candidate| / 5 * 100`
   - Fit index for each dimension: `(5 - |ideal - candidate|) / 5`
   - Overall fit percentage: average of all dimension fit indices
2. **Template Filling**: Replaces placeholders in the DOCX template:
   - `(name)` → Candidate name
   - `(His/Hers)` → Gender pronoun
   - `( )` → Fit index percentage
   - `(value)` → HEXACO dimension scores (explicit and implicit)
3. **PDF Conversion**: Uses LibreOffice to convert DOCX to PDF
4. **PDF Merging**: Combines generated PDF with Fleet-15 assessment pages

## API Reference

### `generatePDF(candidateData, docxTemplatePath?, fleetPdfsPath?, outputPath?)`

Generates a PDF report with candidate data.

**Parameters:**
- `candidateData` (required): Object containing:
  - `candidate_name` (string): Candidate's name
  - `hexaco_scores` (object): HEXACO scores (1-5 scale) with keys:
    - `Honesty–Humility`
    - `Emotionality`
    - `Extraversion`
    - `Agreeableness`
    - `Conscientiousness`
    - `Openness to Experience`
  - `ideal_scores` (object): Ideal profile scores for comparison
    - `hexaco` (object): Ideal HEXACO scores (1-5 scale) with same keys as hexaco_scores
    - `hbeck` (object, optional): Ideal HBECK/360 scores (1-5 scale)
  - `gender_pronoun` (string, optional): 'His' or 'Hers' (default: 'His')
  - `profile_type` (string, optional): Personality profile type
  - `hbeck_scores` (object, optional): HBECK/360 scores (1-5 scale) with keys:
    - `Results`, `Mindset`, `Skills`, `Communication`, `Interpersonal Savvy`, `Influence`
- `docxTemplatePath` (string, optional): Custom DOCX template path
- `fleetPdfsPath` (string, optional): Custom Fleet PDFs directory
- `outputPath` (string, optional): Custom output directory

**Returns:** Promise<string> - Path to generated PDF

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run the compiled JavaScript
- `npm run dev` - Run directly with ts-node (for development)
- `npm run generate` - Build and run (recommended)

## Customization

To generate reports for different candidates:

1. Update the Excel files with new candidate data:
   - `Impala_OUTPUT.xlsx` - Add new candidate assessment results
   - `Idealan kandidat atributi (1).xlsx` - Adjust ideal profile if needed

2. Ensure the DOCX template filename matches the candidate name pattern (e.g., `FirstName_LastName_...docx`)

3. Run the generator:
   ```bash
   npm run generate
   ```

The script will automatically extract the candidate name from the template filename and generate a personalized report.

## Example Output

Running the generator produces:
- `output/filled_report.docx` - DOCX with filled placeholders
- `output/filled_report.pdf` - PDF version of the filled report  
- `output/{CandidateName}_Complete_Report.pdf` - Final merged PDF (11.62 MB, 21 pages)

The final PDF contains:
- 1 personalized report page with candidate data
- 9 assessment pages from Fleet-15 directory
- Additional pages from the comprehensive template
