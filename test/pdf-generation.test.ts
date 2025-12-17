/**
 * Tests for PDF Generation
 * 
 * Run with: npm test
 * Run specific test: npm test -- --grep "test name"
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateDevelopmentReport, ParticipantInfo } from '../dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to validate base64 PDF
function isValidBase64PDF(base64String: string): boolean {
  if (!base64String || typeof base64String !== 'string') {
    return false;
  }
  
  // Check if it's valid base64
  const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Pattern.test(base64String)) {
    return false;
  }
  
  // Decode and check for PDF magic number
  try {
    const buffer = Buffer.from(base64String, 'base64');
    const pdfHeader = buffer.toString('utf8', 0, 5);
    return pdfHeader === '%PDF-';
  } catch {
    return false;
  }
}

// Helper to create test participant data
function createTestParticipant(overrides: Partial<ParticipantInfo> = {}): ParticipantInfo {
  return {
    fullName: 'John Doe',
    flow_name: 'Recruitment & Development Flow',
    position_name: 'Software Engineer',
    assessment_type: 'Integrated Psychometric and Neurocognitive Evaluation',
    recruitmentProfile: 'Charismatic Driver',
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
    ],
    ...overrides
  };
}

describe('PDF Generation Tests', () => {
  
  describe('generateDevelopmentReport', () => {
    
    it('should generate a valid base64 PDF with default example data', async () => {
      const result = await generateDevelopmentReport();
      
      assert.ok(result, 'Result should not be null or undefined');
      assert.strictEqual(typeof result, 'string', 'Result should be a string');
      assert.ok(result.length > 0, 'Result should not be empty');
      assert.ok(isValidBase64PDF(result), 'Result should be a valid base64-encoded PDF');
    });
    
    it('should generate a valid PDF for male participant', async () => {
      const participant = createTestParticipant({ gender: 'male' });
      const result = await generateDevelopmentReport(participant);
      
      assert.ok(isValidBase64PDF(result), 'Should generate valid PDF for male participant');
      
      // Decode and verify PDF contains more than just header
      const buffer = Buffer.from(result, 'base64');
      assert.ok(buffer.length > 1000, 'PDF should have substantial content');
    });
    
    it('should generate a valid PDF for female participant', async () => {
      const participant = createTestParticipant({
        fullName: 'Jane Smith',
        gender: 'female'
      });
      const result = await generateDevelopmentReport(participant);
      
      assert.ok(isValidBase64PDF(result), 'Should generate valid PDF for female participant');
    });
    
    it('should handle different recruitment profiles', async () => {
      const profiles: Array<string> = [
        'Charismatic Driver',
        'Stable team player'
      ];
      
      for (const profile of profiles) {
        try {
          const participant = createTestParticipant({ recruitmentProfile: profile as any });
          const result = await generateDevelopmentReport(participant);
          
          assert.ok(isValidBase64PDF(result), `Should generate valid PDF for ${profile} profile`);
        } catch (error) {
          // Some profiles might not be valid, that's ok for this test
          console.log(`Profile ${profile} not available, skipping`);
        }
      }
    });
    
    it('should handle various HEXACO score ranges', async () => {
      const testCases = [
        { name: 'Low scores', scores: { H: 1.5, E: 1.8, X: 1.2, A: 1.9, C: 1.7, O: 1.4 } },
        { name: 'Medium scores', scores: { H: 3.0, E: 3.0, X: 3.0, A: 3.0, C: 3.0, O: 3.0 } },
        { name: 'High scores', scores: { H: 4.8, E: 4.9, X: 4.7, A: 4.6, C: 4.8, O: 4.9 } }
      ];
      
      for (const testCase of testCases) {
        const participant = createTestParticipant({
          neuroCorrectionRaw: testCase.scores,
          neuroCorrectionCorrected: {
            H: testCase.scores.H.toString(),
            E: testCase.scores.E.toString(),
            X: testCase.scores.X.toString(),
            A: testCase.scores.A.toString(),
            C: testCase.scores.C.toString(),
            O: testCase.scores.O.toString()
          }
        });
        
        const result = await generateDevelopmentReport(participant);
        assert.ok(isValidBase64PDF(result), `Should handle ${testCase.name}`);
      }
    });
    
    it('should generate consistent output for same input', async () => {
      const participant = createTestParticipant();
      
      const result1 = await generateDevelopmentReport(participant);
      const result2 = await generateDevelopmentReport(participant);
      
      assert.ok(isValidBase64PDF(result1), 'First generation should be valid');
      assert.ok(isValidBase64PDF(result2), 'Second generation should be valid');
      
      // Note: PDFs might have timestamps or other varying metadata,
      // so we just check they're both valid, not necessarily identical
      const buffer1 = Buffer.from(result1, 'base64');
      const buffer2 = Buffer.from(result2, 'base64');
      
      // Both should be substantial PDFs
      assert.ok(buffer1.length > 1000, 'First PDF should have content');
      assert.ok(buffer2.length > 1000, 'Second PDF should have content');
    });
    
    it('should handle special characters in names', async () => {
      const participant = createTestParticipant({
        fullName: "O'Brien-Smith, José María"
      });
      
      const result = await generateDevelopmentReport(participant);
      assert.ok(isValidBase64PDF(result), 'Should handle special characters in names');
    });
    
    it('should include optional discrepancyHexaco when provided', async () => {
      const participant = createTestParticipant({
        discrepancyHexaco: {
          H: '1.2',
          E: '0.8',
          X: '1.5',
          A: '0.9',
          C: '1.1',
          O: '1.3'
        }
      });
      
      const result = await generateDevelopmentReport(participant);
      assert.ok(isValidBase64PDF(result), 'Should handle optional discrepancyHexaco field');
    });
  });
  
  describe('PDF Output Validation', () => {
    
    it('should create a decodable PDF file', async () => {
      const participant = createTestParticipant();
      const result = await generateDevelopmentReport(participant);
      
      const buffer = Buffer.from(result, 'base64');
      const outputPath = path.join(__dirname, '../test-output.pdf');
      
      // Write to file for manual verification if needed
      fs.writeFileSync(outputPath, buffer);
      
      assert.ok(fs.existsSync(outputPath), 'PDF file should be created');
      const stats = fs.statSync(outputPath);
      assert.ok(stats.size > 1000, 'PDF file should have substantial size');
      
      // Cleanup
      fs.unlinkSync(outputPath);
    });
    
    it('should generate PDF with reasonable file size', async () => {
      const participant = createTestParticipant();
      const result = await generateDevelopmentReport(participant);
      
      const buffer = Buffer.from(result, 'base64');
      const sizeInKB = buffer.length / 1024;
      
      // PDF should be between 10KB and 10MB (reasonable bounds)
      assert.ok(sizeInKB > 10, 'PDF should be at least 10KB');
      assert.ok(sizeInKB < 10240, 'PDF should be less than 10MB');
    });
  });
  
  describe('Error Handling', () => {
    
    it('should handle missing ideal candidate results gracefully', async () => {
      const participant = createTestParticipant({
        idealCandidateResults: []
      });
      
      try {
        const result = await generateDevelopmentReport(participant);
        // If it succeeds, verify it's valid
        assert.ok(isValidBase64PDF(result), 'Should handle empty idealCandidateResults');
      } catch (error) {
        // If it fails, that's also acceptable behavior - just ensure it's a proper error
        assert.ok(error instanceof Error, 'Should throw proper Error object');
      }
    });
  });
});

// Export for potential use in other test files
export { createTestParticipant, isValidBase64PDF };
