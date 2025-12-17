# Impala PDF Generator

A TypeScript-based PDF generator for Impala recruitment reports with support for HEXACO personality assessments and candidate evaluations.

## Features

- Generate comprehensive recruitment reports in PDF format
- Support for HEXACO personality assessment scores
- Support for HBECK 360-degree assessment scores
- Template-based document generation
- SVG and HTML to PDF conversion
- Merge multiple PDFs into a single report
- Customizable candidate data and ideal profiles

## Installation

### From GitHub Package Registry

```bash
npm install @ugrinovs/impala-pdf-generator
```

### Configuration

Create a `.npmrc` file in your project root:

```
@ugrinovs:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Usage

### Basic PDF Generation

```typescript
import { generatePDF, CandidateData } from '@ugrinovs/impala-pdf-generator';

const candidateData: CandidateData = {
  candidate_name: 'John Doe',
  gender_pronoun: 'His',
  profile_type: 'Charismatic Driver',
  hexaco_scores: {
    'Honesty–Humility': 4.5,
    'Emotionality': 3.2,
    'Extraversion': 4.1,
    'Agreeableness': 3.8,
    'Conscientiousness': 4.2,
    'Openness to Experience': 3.9
  },
  ideal_scores: {
    hexaco: {
      'Honesty–Humility': 4.0,
      'Emotionality': 3.5,
      'Extraversion': 4.0,
      'Agreeableness': 4.0,
      'Conscientiousness': 4.5,
      'Openness to Experience': 3.5
    }
  }
};

// Generate PDF
const pdfPath = await generatePDF(candidateData);
console.log(`PDF generated at: ${pdfPath}`);
```

### Advanced Options

```typescript
import { generatePDF } from '@ugrinovs/impala-pdf-generator';

const pdfPath = await generatePDF(
  candidateData,
  '/path/to/custom/template.docx',  // Custom DOCX template
  '/path/to/fleet/pdfs',            // Fleet PDFs directory
  '/path/to/output'                 // Custom output directory
);
```

### Skip Fleet PDFs

```typescript
const pdfPath = await generatePDF(
  candidateData,
  undefined,  // Use default template
  null,       // Skip Fleet PDFs
  '/output'   // Output directory
);
```

## API Reference

### `generatePDF(candidateData, docxTemplatePath?, fleetPdfsPath?, outputPath?)`

Generates a PDF report with the provided candidate data.

**Parameters:**
- `candidateData` (CandidateData): Candidate information including scores
- `docxTemplatePath` (string, optional): Path to custom DOCX template
- `fleetPdfsPath` (string | null, optional): Path to Fleet PDFs directory, or null to skip
- `outputPath` (string, optional): Custom output directory path

**Returns:** Promise<string> - Path to the generated PDF file

### CandidateData Interface

```typescript
interface CandidateData {
  candidate_name: string;
  gender_pronoun?: string;
  profile_type?: string;
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
    hexaco: Record<string, number>;
    hbeck?: Record<string, number>;
  };
}
```

## Development

### Prerequisites

- Node.js 18 or higher
- TypeScript 5.x
- LibreOffice (for DOCX to PDF conversion)

### Building

```bash
npm install
npm run build
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm run clean` - Remove build artifacts

## Publishing to GitHub Package Registry

1. Authenticate with GitHub:
```bash
npm login --scope=@ugrinovs --registry=https://npm.pkg.github.com
```

2. Publish the package:
```bash
npm publish
```

## Requirements

- LibreOffice or unoconv must be installed for DOCX to PDF conversion

## License

ISC

## Repository

https://github.com/ugrinovs/impala-pdf-generator

## Issues

https://github.com/ugrinovs/impala-pdf-generator/issues
