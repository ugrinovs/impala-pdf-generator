import { generatePDF, CandidateData } from './generators/pdfGenerator';

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
  hbeck_scores: {
    'Results': 3.5,
    'Mindset': 4.0,
    'Skills': 3.8,
    'Communication': 4.2,
    'Interpersonal Savvy': 3.9,
    'Influence': 4.1,
  },
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
  },
  gender_pronoun: 'His',
  profile_type: 'Charismatic Driver'
};

async function main() {
  try {
    const pdfPath = await generatePDF(candidateData, { method: 'svg' });
    console.log(`\n✨ PDF generated successfully!`);
    console.log(`   Output: ${pdfPath}`);
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
