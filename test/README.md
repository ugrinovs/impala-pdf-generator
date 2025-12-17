# Test Suite for Impala PDF Generator

This directory contains automated tests for the PDF generation functionality.

## Running Tests

### Run all tests
```bash
npm test
```

### Watch mode (auto-run on file changes)
```bash
npm run test:watch
```

## Test Structure

### pdf-generation.test.ts

Comprehensive tests for the `generateDevelopmentReport` function including:

- **Basic Functionality Tests**
  - Generate PDF with default example data
  - Generate PDFs for male and female participants
  - Handle different recruitment profiles
  - Handle various HEXACO score ranges (low, medium, high)
  - Generate consistent output for same input

- **Data Handling Tests**
  - Handle special characters in names
  - Handle optional fields (discrepancyHexaco)

- **Output Validation Tests**
  - Validate base64 encoding
  - Check PDF magic number (%PDF-)
  - Verify reasonable file sizes (10KB - 10MB)
  - Create decodable PDF files

- **Error Handling Tests**
  - Handle edge cases gracefully

## Test Helpers

- `createTestParticipant()` - Creates a valid test participant with default values
- `isValidBase64PDF()` - Validates that a string is a valid base64-encoded PDF

## Requirements

- Node.js 18+ (for built-in test runner)
- Puppeteer (automatically installed)
- Chrome/Chromium (automatically downloaded by Puppeteer)

## Notes

- Tests use Node.js built-in test runner (no external test framework required)
- Tests generate actual PDFs using Puppeteer
- Test output files are automatically cleaned up
- Temporary test PDFs are excluded from version control (.gitignore)

## Adding New Tests

To add new test cases:

1. Create a new test file in this directory with `.test.ts` extension
2. Import required modules and helpers
3. Use `describe()` and `it()` from `node:test`
4. Run tests with `npm test`

Example:
```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { generateDevelopmentReport } from '../dist/index.js';
import { createTestParticipant } from './pdf-generation.test.js';

describe('My New Test Suite', () => {
  it('should do something', async () => {
    const participant = createTestParticipant();
    const result = await generateDevelopmentReport(participant);
    assert.ok(result);
  });
});
```
