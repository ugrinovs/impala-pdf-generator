import { ParticipantInfo } from "../index.js";
import { personalityProfileMap } from "./personality-profile.mapper.js";

export default {
  fullName: "Miro Mirić",
  position_name: "Recruiter",
  flow_name: "Development flow ",
  assessment_type: "Development",
  recruitmentProfile: "Too good to be true",
  discrepancyHexaco: {
    H: "0.863333333333333259999",
    E: "-0.21",
    X: "-0.1100000000000001",
    A: "0.63",
    C: "0.63",
    O: "0.78",
  },
  neuroCorrectionCorrected: {
    H: "2.236666666666666740001",
    E: "3.01",
    X: "2.4100000000000001",
    A: "1.47",
    C: "1.47",
    O: "1.82",
  },
  neuroCorrectionRaw: { H: 3.1, E: 2.8, X: 2.3, A: 2.1, C: 2.1, O: 2.6 },
  hbeckResult: {
    H: "2.6",
    E: "1",
    X: "3.14285714285714285714",
    A: "2",
    C: "2.44444444444444444444",
    O: "1",
  },
  idealCandidateResults: [
    0, 1, 2, 0, 0, 0, 1, 2, 4, 3, 3, 4, 4, 4, 2, 1, 3, 4, 2, 0, 1, 2, 0, 1,
  ],
  gender: "male",
} satisfies ParticipantInfo;

// {
//   participantId: "36sU6nKZOFRyy7r5Ygj4TyJ5A88",
//   fullName: "Savo Savic",
//   position_name: "Accountant",
//   flow_name: "Development flow ",
//   assessment_type: "Development",
//   recruitmentProfile:
//     "Charming manipulator" as keyof typeof personalityProfileMap,
//   discrepancyHexaco: {
//     H: "0.4633333333333332",
//     E: "0.78",
//     X: "0.96",
//     A: "0.99",
//     C: "0.93",
//     O: "0.93",
//   },
//   neuroCorrectionCorrected: {
//     H: "2.6366666666666668",
//     E: "1.82",
//     X: "2.24",
//     A: "2.31",
//     C: "2.17",
//     O: "2.17",
//   },
//   neuroCorrectionRaw: { H: 3.1, E: 2.6, X: 3.2, A: 3.3, C: 3.1, O: 3.1 },
//   hbeckResult: {
//     H: "3.6",
//     E: "3",
//     X: "3",
//     A: "2.77777777777777777778",
//     C: "2.66666666666666666667",
//     O: "2.66666666666666666667",
//   },
//   idealCandidateResults: [
//     2, 1, 2, 3, 4, 3, 2, 1, 3, 2, 1, 0, 3, 4, 4, 3, 3, 2, 3, 1, 2, 3, 4, 3,
//   ],
//   gender: "male" as "male" | "female",
// };

// {
//   fullName: "Employee 1",
//   ageRange: "25 - 34",
//   flow_name: "Recruitment & Development Flow",
//   position_name: "Software Engineer",
//   assessment_type: `Integrated Psychometric
// and Neurocognitive Evaluation`,
//   recruitmentProfile:
//     "Too good to be true" as keyof typeof personalityProfileMap,
//   gender: "male" as "male" | "female",
//   neuroCorrectionCorrected: {
//     A: "2.38",
//     C: "2.66",
//     E: "2.17",
//     H: "3.457054218248168152801",
//     O: "2.8",
//     X: "1.47",
//   },
//   neuroCorrectionRaw: {
//     A: 3.4,
//     C: 3.8,
//     E: 3.1,
//     H: 4.6,
//     O: 4,
//     X: 2.1,
//   },
//   developmentChangePriority: "Medium Priority",
//   developmentFinalMatrix: "Medium Priority",
//   developmentSuccessorReadiness: "Ready in 3+ Years",
//   discrepancyHexaco: {
//     A: "1.02",
//     C: "1.14",
//     E: "0.93",
//     H: "1.142945781751831847199",
//     O: "1.2",
//     X: "0.63",
//   },
//   hbeckResult: {
//     A: 2.38,
//     C: 2.66,
//     E: 2.17,
//     H: 3.457,
//     O: 2.8,
//     X: 1.47,
//   },
//   hbConcreteDevelopmentAreas: {
//     A: "Maintenance: rules of constructive disagreement; rotation in cross-team tasks, paired decision-making in conflict cases.",
//     C: "Maintenance: planning rhythms (weekly/quarterly); self-process audit once a month.",
//     E: "Maintenance: check-in rituals in meetings (check-in sessions about the emotional state in the team); journaling once a week.",
//     H: "Training (targeted): micro-skills of honesty and open reporting; reflection of values with 360 micro-feedback.",
//     O: "Training (targeted): idea generation techniques (SCAMPER), hypothesis-driven work; cultural sensitivity, micro-exercises of creative thinking.",
//     X: "Training (targeted): facilitation of discussions and networking scripts; social boldness exercises, elevator pitch exercises.",
//   },
//   hbOverallDevelopmentSuggestion: {
//     A: "Maintenance: high compliance; continue with rhythms and light stretch tasks.",
//     C: "Maintenance: high compliance; continue with rhythms and light stretch tasks.",
//     E: "Maintenance: high compliance; continue with rhythms and light stretch tasks.",
//     H: "Training (targeted): behavior below potential; focus on specific situations and routines.",
//     O: "Training (targeted): behavior below potential; focus on specific situations and routines.",
//     X: "Training (targeted): behavior below potential; focus on specific situations and routines.",
//   },
//   neuroRedFlagAdditionalCheckNeeded: true,
//   neuroRiskCategory: "high",
//   nineGridFinalClassification:
//     "High performance - Low potential - Misplaced Talent (Reallocation)",
//   recruitmentHRActions: "N/A",
//   recruitmentRisks: "N/A",
//   recruitmentStrengths: "N/A",
//   // length: 24
//   idealCandidateResults: [
//     3, 3, 2, 3, 3, 3, 2, 3, 2, 1, 3, 3, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3,
//   ],
// };
