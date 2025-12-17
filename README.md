# Impala PDF Generator

A TypeScript-based PDF generator for Impala recruitment reports with support for HEXACO personality assessments and candidate evaluations. Uses Puppeteer to generate PDFs from HTML templates.

## Features

- Generate comprehensive recruitment reports in PDF format
- Support for HEXACO personality assessment scores
- Support for HBECK 360-degree assessment scores
- HTML template-based PDF generation using Puppeteer
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

### Generate Development Report

```typescript
import { generateDevelopmentReport, ParticipantInfo } from '@ugrinovs/impala-pdf-generator';

const participantData: ParticipantInfo = {
  fullName: 'John Doe',
  flow_name: 'Executive Assessment',
  position_name: 'Senior Manager',
  assessment_type: 'HEXACO + HBECK',
  recruitmentProfile: 'Charismatic_Driver',
  gender: 'male',
  neuroCorrectionCorrected: {
    H: '4.5',
    E: '3.2',
    X: '4.1',
    A: '3.8',
    C: '4.2',
    O: '3.9'
  },
  neuroCorrectionRaw: {
    H: 4.5,
    E: 3.2,
    X: 4.1,
    A: 3.8,
    C: 4.2,
    O: 3.9
  },
  hbeckResult: {
    H: 4.0,
    E: 3.5,
    X: 4.0,
    A: 4.0,
    C: 4.5,
    O: 3.5
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

// Generate PDF (returns base64 encoded PDF)
const base64Pdf = await generateDevelopmentReport(participantData);
console.log(`PDF generated successfully`);
```

## API Reference

### `generateDevelopmentReport(result: ParticipantInfo)`

Generates a development report PDF from participant data.

**Parameters:**
- `result` (ParticipantInfo): Participant information including HEXACO and HBECK scores

**Returns:** Promise<string> - Base64 encoded PDF data

### ParticipantInfo Interface

```typescript
interface ParticipantInfo {
  fullName: string;
  flow_name: string;
  position_name: string;
  assessment_type: string;
  recruitmentProfile: string;
  gender: 'male' | 'female';
  neuroCorrectionCorrected: {
    H: string;
    E: string;
    X: string;
    A: string;
    C: string;
    O: string;
  };
  neuroCorrectionRaw: {
    H: number;
    E: number;
    X: number;
    A: number;
    C: number;
    O: number;
  };
  hbeckResult: {
    H: number;
    E: number;
    X: number;
    A: number;
    C: number;
    O: number;
  };
  idealCandidateResults: Array<{ result: number }>;
  discrepancyHexaco?: {
    H: string;
    E: string;
    X: string;
    A: string;
    C: string;
    O: string;
  };
}
```

## Development

### Prerequisites

- Node.js 18 or higher
- TypeScript 5.x
- Puppeteer (automatically installs Chrome/Chromium)

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

- Puppeteer will automatically download and use Chrome/Chromium for PDF generation

## License

ISC

## Repository

https://github.com/ugrinovs/impala-pdf-generator

## Issues

https://github.com/ugrinovs/impala-pdf-generator/issues
