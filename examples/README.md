# Examples

This directory contains example code demonstrating how to use the Impala PDF Generator.

## Running Examples

Make sure you've built the project first:

```bash
npm run build
```

Then run any example:

```bash
node examples/basic-usage.js
```

## Available Examples

### basic-usage.js

Demonstrates three common usage patterns:

1. **Custom Report** - Generate a PDF with custom participant data
2. **Example Report** - Generate a PDF using the built-in example data
3. **Batch Reports** - Generate multiple PDFs for different candidates

The example will create PDF files in this directory that you can open and review.

## Creating Your Own Examples

You can create additional example files in this directory. Just import the library and use the `generateDevelopmentReport` function:

```javascript
import { generateDevelopmentReport } from '../dist/index.js';
import fs from 'fs';

const participantData = {
  // ... your participant data
};

const base64Pdf = await generateDevelopmentReport(participantData);
const buffer = Buffer.from(base64Pdf, 'base64');
fs.writeFileSync('my-report.pdf', buffer);
```

## Output Files

Generated PDF files (*.pdf) are excluded from version control via .gitignore.
