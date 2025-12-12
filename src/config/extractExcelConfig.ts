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
export async function extractExcelConfig(excelPath: string): Promise<ExcelConfig> {
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

  // Generate placeholder development plans based on score levels
  // TODO: Replace with actual development plan data when source is identified
  config.dev_plan = generatePlaceholderDevPlans(config.dimensions);

  return config;
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
  const outputPath = path.join(__dirname, 'excelData.ts');

  extractExcelConfig(excelPath)
    .then(config => {
      console.log('Excel configuration extracted successfully:');
      console.log(`  - ${config.attributes.length} attributes`);
      console.log(`  - ${config.idealProfile.length} ideal profile items`);
      console.log(`  - ${Object.keys(config.dimensions).length} dimensions`);
      console.log(`  - ${Object.keys(config.dev_plan).length} development plans`);

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
