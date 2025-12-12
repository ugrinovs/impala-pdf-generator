# PDF Generator - Dual Implementation

This project implements TWO methods for generating PDFs from Fleet-16 templates:

1. **SVG-based**: Direct SVG manipulation and conversion
2. **HTML/CSS-based**: Modern web technologies for better rendering

## Installation

```bash
npm install
```

### Required System Dependencies

#### For SVG Method (Option 1):
```bash
sudo apt-get install librsvg2-bin
```

#### For HTML Method (Option 2 - Recommended):
```bash
# Install wkhtmltopdf (best quality)
sudo apt-get install wkhtmltopdf

# OR install LibreOffice (fallback)
sudo apt-get install libreoffice-writer libreoffice-core
```

## Usage

### Extract Configuration from Excel

First, extract the data configuration from Excel files:

```bash
npm run extract-config
```

This generates `src/config/excelData.ts` with all development plans and dimension mappings.

### Generate PDF - SVG Method

```bash
npm run generate-svg
```

**Pros:**
- Direct control over SVG elements
- Precise positioning matching templates
- Smaller file sizes

**Cons:**
- Requires librsvg2-bin system package
- More complex text manipulation

### Generate PDF - HTML Method (Recommended)

```bash
npm run generate-html
```

**Pros:**
- Better text rendering and layout
- Easier to maintain and modify
- Modern CSS for styling
- Works with wkhtmltopdf or LibreOffice

**Cons:**
- Slightly larger file sizes
- Requires system PDF converter

## API Usage

```typescript
import { generatePDF, CandidateData } from './src/generators/pdfGenerator';

const candidateData: CandidateData = {
  candidate_name: 'John Smith',
  hexaco_scores: {
    'Honesty–Humility': 4.6,
    'Emotionality': 4.5,
    'Extraversion': 1.47,
    'Agreeableness': 3.4,
    'Conscientiousness': 2.66,
    'Openness to Experience': 2.8,
  },
  ideal_scores: {
    hexaco: {
      'Honesty–Humility': 4.5,
      'Emotionality': 2.5,
      'Extraversion': 1.0,
      'Agreeableness': 2.5,
      'Conscientiousness': 4.5,
      'Openness to Experience': 3.5,
    }
  },
  gender_pronoun: 'His',
  profile_type: 'Charismatic Driver'
};

// Generate using HTML method
const pdfPath = await generatePDF(candidateData, { method: 'html' });

// OR generate using SVG method
const pdfPath = await generatePDF(candidateData, { method: 'svg' });
```

## Configuration Access

Access development plans and dimension data:

```typescript
import { getDevPlan, getDimensionInfo } from './src/config/excelData';

// Get development plan for a dimension and score level
const plan = getDevPlan('Integrity & Trust', 'Low');
console.log(plan.text); // "Shows occasional inconsistency..."
console.log(plan.recommendations); // Array of recommendations

// Get dimension information
const dimInfo = getDimensionInfo('Honesty–Humility');
```

## Page Structure

Both generators create 10 pages:

1. **Cover Page**: Candidate name, position, assessment type
2. **Executive Summary**: Key findings and fit index
3. **HEXACO Results**: Detailed scores table
4. **HEXACO Charts**: Visual representation
5. **HBECK/360 Results**: 360 assessment scores
6. **Competency Breakdown**: Detailed analysis
7. **Development Priorities**: Gap analysis
8. **Action Plans**: Development recommendations
9. **Fit Analysis**: Overall alignment percentage
10. **Recommendations**: Summary and next steps

## Data Sources

- **Fleet-16/**: SVG templates and examples for styling reference
- **Idealan kandidat atributi (1).xlsx**: Ideal profile benchmarks and attributes
- **Impala_OUTPUT.xlsx**: Development plan texts (dev plan sheet)
- **summary.docx**: Data mapping instructions (comments)

## Output

Both methods generate:
- **Filename**: `{CandidateName}_Report_{SVG|HTML}.pdf`
- **Pages**: 10 pages
- **Size**: ~500KB - 2MB
- **Quality**: Professional recruitment report

## Troubleshooting

### "rsvg-convert not found" (SVG method)
Install librsvg:
```bash
sudo apt-get update && sudo apt-get install -y librsvg2-bin
```

### "wkhtmltopdf not found" (HTML method)
Install wkhtmltopdf or LibreOffice:
```bash
# Option 1: wkhtmltopdf (recommended)
sudo apt-get install -y wkhtmltopdf

# Option 2: LibreOffice (fallback)
sudo apt-get install -y libreoffice-writer libreoffice-core
```

### Empty PDF generated
Check that the system dependencies are installed. The generator will create an empty PDF if no pages could be converted.

## Development

### File Structure

```
src/
├── generators/
│   └── pdfGenerator.ts       # Main generator (both SVG and HTML)
├── config/
│   ├── extractExcelConfig.ts # Excel data extraction
│   └── excelData.ts          # Generated config file
├── example-svg.ts            # SVG method example
└── example-html.ts           # HTML method example
```

### Adding New Pages

1. Add HTML template in `generateHTMLPage()` function
2. Add SVG processing in `fillSVGData()` function
3. Update page count in the loop

### Customizing Styles

For HTML method, edit the `styles` constant in `generateHTMLPage()`.
For SVG method, modify SVG templates in Fleet-16 directory.

## License

MIT
