#!/usr/bin/env node
/**
 * Example usage of the PDF generator with custom candidate data
 */

import { generatePDF } from './index';

// Example: Generate PDF with custom candidate data
async function exampleUsage() {
  // Define candidate data
  const candidateData = {
    candidate_name: 'John Smith',
    gender_pronoun: 'His',
    profile_type: 'Charismatic Driver',
    
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
      hbeck: {
        'Results': 1.5,
        'Mindset': 2.5,
        'Skills': 4.5,
        'Communication': 3.5,
        'Interpersonal Savvy': 1.5,
        'Influence': 2.5,
      }
    }
  };

  try {
    // Generate PDF with candidate data
    // Pass null for fleetPdfsPath to skip Fleet-15 PDFs (which contain data for a different candidate)
    const pdfPath = await generatePDF(candidateData, undefined, null);
    console.log(`\n✓ PDF generated successfully: ${pdfPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  exampleUsage();
}

export { exampleUsage };
