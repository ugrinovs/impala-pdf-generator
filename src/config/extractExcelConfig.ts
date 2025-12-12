import ExcelJS from 'exceljs';
import * as fs from 'fs';
import * as path from 'path';

interface AttributeItem {
  category: string;
  dimension: string;
  facet: string;
  attribute_en: string;
  attribute_sr: string;
  direction: string;
  description_en: string;
  description_sr: string;
}

interface IdealProfileItem {
  category: string;
  dimension: string;
  item: string;
  description: string;
  hr_rating: number;
}

interface DimensionConfig {
  [dimension: string]: IdealProfileItem[];
}

interface ExcelConfig {
  attributes: AttributeItem[];
  idealProfile: IdealProfileItem[];
  dimensions: DimensionConfig;
  dev_plan: {
    [dimension: string]: {
      [scoreLevel: string]: {
        text: string;
        recommendations: string[];
      };
    };
  };
}

/**
 * Extracts configuration data from Excel files
 */
export async function extractExcelConfig(excelPath: string, outputExcelPath?: string): Promise<ExcelConfig> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);

  const config: ExcelConfig = {
    attributes: [],
    idealProfile: [],
    dimensions: {},
    dev_plan: {}
  };

  // Process Sheet1 - main attributes data
  const sheet1 = workbook.getWorksheet('Sheet1');
  if (sheet1) {
    sheet1.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const values = row.values as any[];
      if (values[2] && values[3] && values[5]) {
        const item: AttributeItem = {
          category: String(values[2] || ''),
          dimension: String(values[3] || ''),
          facet: String(values[4] || ''),
          attribute_en: String(values[5] || ''),
          attribute_sr: String(values[6] || ''),
          direction: String(values[7] || ''),
          description_en: String(values[8] || ''),
          description_sr: String(values[9] || '')
        };
        config.attributes.push(item);
      }
    });
  }

  // Process Novi kraći ideal - ideal scores
  const idealSheet = workbook.getWorksheet('Novi kraći ideal');
  if (idealSheet) {
    idealSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header

      const values = row.values as any[];
      if (values[2] && values[3] && values[4]) {
        const item: IdealProfileItem = {
          category: String(values[2] || ''),
          dimension: String(values[3] || ''),
          item: String(values[4] || ''),
          description: String(values[5] || ''),
          hr_rating: Number(values[6]) || 0
        };
        config.idealProfile.push(item);

        // Create dimension mapping
        if (!config.dimensions[item.dimension]) {
          config.dimensions[item.dimension] = [];
        }
        config.dimensions[item.dimension].push(item);
      }
    });
  }

  // Extract development plans from Impala_OUTPUT.xlsx if provided
  if (outputExcelPath) {
    const outputWorkbook = new ExcelJS.Workbook();
    await outputWorkbook.xlsx.readFile(outputExcelPath);
    config.dev_plan = await extractDevPlanData(outputWorkbook, config.dimensions);
  } else {
    // Generate placeholder development plans based on score levels
    config.dev_plan = generatePlaceholderDevPlans(config.dimensions);
  }

  return config;
}

/**
 * Extracts development plan data from Impala_OUTPUT.xlsx dev plan sheet
 */
async function extractDevPlanData(workbook: ExcelJS.Workbook, dimensions: DimensionConfig): Promise<ExcelConfig['dev_plan']> {
  const devPlans: ExcelConfig['dev_plan'] = {};
  
  // Try to find the dev plan sheet (with or without spaces)
  let devPlanSheet = workbook.getWorksheet('dev plan');
  if (!devPlanSheet) {
    devPlanSheet = workbook.getWorksheet('dev plan '); // Try with trailing space
  }
  if (!devPlanSheet) {
    console.warn('Dev plan sheet not found in Impala_OUTPUT.xlsx, using placeholder data');
    return generatePlaceholderDevPlans(dimensions);
  }

  console.log(`Found dev plan sheet: "${devPlanSheet.name}"`);

  // The dev plan sheet structure: Dimension | Score Level | Text
  let headerRow: any[] = [];
  devPlanSheet.eachRow((row, rowNumber) => {
    const values = row.values as any[];
    
    if (rowNumber === 1) {
      // Store header row
      headerRow = values;
      console.log('Header structure:', headerRow.map((h, i) => `[${i}] ${h}`).join(', '));
      return;
    }

    const dimension = String(values[1] || '').trim();
    const scoreLevel = String(values[2] || '').trim();
    const text = String(values[3] || '').trim();

    if (!dimension || !scoreLevel || dimension.length < 2) return;

    // Initialize dimension if not exists
    if (!devPlans[dimension]) {
      devPlans[dimension] = {
        'Low': { text: '', recommendations: [] },
        'Medium': { text: '', recommendations: [] },
        'High': { text: '', recommendations: [] }
      };
    }

    // Map score level to Low/Medium/High
    let level: 'Low' | 'Medium' | 'High' | null = null;
    const scoreLower = scoreLevel.toLowerCase();
    if (scoreLower.includes('low') || scoreLower.includes('0-2')) {
      level = 'Low';
    } else if (scoreLower.includes('medium') || scoreLower.includes('mid') || scoreLower.includes('2-3')) {
      level = 'Medium';
    } else if (scoreLower.includes('high') || scoreLower.includes('3-5')) {
      level = 'High';
    }

    if (level && text) {
      devPlans[dimension][level] = {
        text: text,
        recommendations: parseRecommendations(text)
      };
      console.log(`  ${dimension} [${level}]: ${text.substring(0, 60)}...`);
    }
  });

  console.log(`Extracted development plans for ${Object.keys(devPlans).length} dimensions from Excel`);

  // Fill in missing dimensions with placeholder data
  Object.keys(dimensions).forEach(dimension => {
    if (!devPlans[dimension]) {
      devPlans[dimension] = generatePlaceholderDevPlans({[dimension]: dimensions[dimension]})[dimension];
    }
  });

  return devPlans;
}

/**
 * Parses recommendations from text (extracts bullet points or sentences)
 */
function parseRecommendations(text: any): string[] {
  if (!text) return [];
  
  const textStr = String(text);
  // Split by bullet points, newlines, or numbered lists
  const recommendations = textStr
    .split(/[•\n\r]|^\d+[\.)]\s*/gm)
    .map(r => r.trim())
    .filter(r => r.length > 10); // Filter out empty or very short strings
  
  return recommendations.length > 0 ? recommendations : [textStr.substring(0, 200)];
}

/**
 * Generates placeholder development plans for each dimension and score level
 */
function generatePlaceholderDevPlans(dimensions: DimensionConfig): ExcelConfig['dev_plan'] {
  const devPlans: ExcelConfig['dev_plan'] = {};

  Object.keys(dimensions).forEach(dimension => {
    devPlans[dimension] = {
      'Low': {
        text: `Shows developmental needs in ${dimension}. Significant gap from ideal profile requires focused attention.`,
        recommendations: [
          'Structured development program recommended',
          'Regular coaching and feedback sessions',
          'Targeted skill-building exercises'
        ]
      },
      'Medium': {
        text: `Demonstrates moderate capability in ${dimension}. Close to ideal profile with room for targeted improvement.`,
        recommendations: [
          'Specific development activities for key attributes',
          'Peer learning and best practice sharing',
          'Self-directed improvement initiatives'
        ]
      },
      'High': {
        text: `Strong performance in ${dimension}. Well-aligned with ideal profile with minimal development needs.`,
        recommendations: [
          'Focus on maintaining current performance level',
          'Consider mentoring others in this area',
          'Explore advanced applications of these skills'
        ]
      }
    };
  });

  return devPlans;
}

/**
 * Saves the extracted configuration to a TypeScript file
 */
export async function saveConfigToTypeScript(config: ExcelConfig, outputPath: string): Promise<void> {
  const tsContent = `/**
 * Auto-generated configuration from Excel data
 * Generated at: ${new Date().toISOString()}
 */

export interface AttributeItem {
  category: string;
  dimension: string;
  facet: string;
  attribute_en: string;
  attribute_sr: string;
  direction: string;
  description_en: string;
  description_sr: string;
}

export interface IdealProfileItem {
  category: string;
  dimension: string;
  item: string;
  description: string;
  hr_rating: number;
}

export interface DevelopmentPlan {
  text: string;
  recommendations: string[];
}

export const excelConfig = ${JSON.stringify(config, null, 2)} as const;

// Helper functions for accessing data
export function getDevPlan(dimension: string, scoreLevel: 'Low' | 'Medium' | 'High'): DevelopmentPlan {
  return excelConfig.dev_plan[dimension]?.[scoreLevel] || {
    text: 'Development plan not available',
    recommendations: []
  };
}

export function getDimensionInfo(dimension: string): IdealProfileItem[] {
  return excelConfig.dimensions[dimension] || [];
}

export function getAttributesByDimension(dimension: string): AttributeItem[] {
  return excelConfig.attributes.filter(attr => attr.dimension === dimension);
}
`;

  fs.writeFileSync(outputPath, tsContent, 'utf-8');
}

// CLI execution
if (require.main === module) {
  const excelPath = path.join(__dirname, '../..', 'Idealan kandidat atributi (1).xlsx');
  const outputExcelPath = path.join(__dirname, '../..', 'Impala_OUTPUT.xlsx');
  const outputPath = path.join(__dirname, 'excelData.ts');

  extractExcelConfig(excelPath, outputExcelPath)
    .then(config => {
      console.log('Excel configuration extracted successfully:');
      console.log(`  - ${config.attributes.length} attributes`);
      console.log(`  - ${config.idealProfile.length} ideal profile items`);
      console.log(`  - ${Object.keys(config.dimensions).length} dimensions`);
      console.log(`  - ${Object.keys(config.dev_plan).length} development plans`);

      // Save raw JSON for inspection
      fs.writeFileSync(
        path.join(__dirname, '../..', 'config-raw.json'),
        JSON.stringify(config, null, 2)
      );

      return saveConfigToTypeScript(config, outputPath);
    })
    .then(() => {
      console.log(`\nConfiguration saved to ${outputPath}`);
    })
    .catch(error => {
      console.error('Error extracting Excel configuration:', error);
      process.exit(1);
    });
}
