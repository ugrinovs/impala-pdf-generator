# Impala PDF Generator

This tool generates comprehensive PDF recruitment reports by:
1. Reading candidate data from `Impala_OUTPUT.xlsx`
2. Applying formulas and calculations from `Idealan kandidat atributi (1).xlsx`
3. Filling the DOCX template (`Rastimir_Potencijalovic_Recruitment_Development_Flow_Executive_Summary.docx`) with calculated values
4. Converting the filled DOCX to PDF
5. Merging with existing assessment PDFs from `Fleet-15/` directory

## Requirements

- Python 3.7+
- LibreOffice (for DOCX to PDF conversion)

## Installation

Install required Python packages:

```bash
pip install -r requirements.txt
```

Or install individually:

```bash
pip install openpyxl python-docx PyPDF2 reportlab pandas
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

Simply run the generator script:

```bash
python3 generate_pdf.py
```

The script will:
1. Read candidate data from the Excel files
2. Extract scores and calculate fit indices
3. Fill the DOCX template with personalized data
4. Convert to PDF
5. Merge all PDFs together

The final output will be generated at:
```
output/Rastimir_Potencijalovic_Complete_Report.pdf
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

1. **Data Extraction**: Reads candidate scores from the "Novi kraći ideal" sheet in `Idealan kandidat atributi (1).xlsx`
2. **Profile Extraction**: Extracts personality profile from "Profili Licnosti (Recruitment)" sheet in `Impala_OUTPUT.xlsx`
3. **Template Filling**: Replaces placeholders in the DOCX template:
   - `(name)` → Candidate name (e.g., "Rastimir")
   - `(His/Hers)` → Gender pronoun
   - `( )` → Fit index percentage (e.g., "63.3%")
   - `(value)` → HEXACO dimension scores
4. **PDF Conversion**: Uses LibreOffice to convert DOCX to PDF
5. **PDF Merging**: Combines generated PDF with Fleet-15 assessment pages

## Customization

To generate reports for different candidates, update the source Excel files with new candidate data and ensure the DOCX template filename matches the candidate name.
