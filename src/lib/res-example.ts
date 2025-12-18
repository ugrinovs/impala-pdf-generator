import { personalityProfileMap } from "./personality-profile.mapper.js";

export default {
  ageRange: "25 - 34",
  flow_name: "Recruitment & Development Flow",
  developmentChangePriority: "Medium Priority",
  developmentFinalMatrix: "Medium Priority",
  developmentSuccessorReadiness: "Ready in 3+ Years",
  position_name: "Software Engineer",
  assessment_type: `Integrated Psychometric
and Neurocognitive Evaluation`,
  discrepancyHexaco: {
    A: "1.02",
    C: "1.14",
    E: "0.93",
    H: "1.142945781751831847199",
    O: "1.2",
    X: "0.63",
  },
  fullName: "Employee 1",
  gender: "male" as "male" | "female",
  hbeckResult: {
    A: 2.38,
    C: 2.66,
    E: 2.17,
    H: 3.457,
    O: 2.8,
    X: 1.47,
  },
  hbConcreteDevelopmentAreas: {
    A: "Maintenance: rules of constructive disagreement; rotation in cross-team tasks, paired decision-making in conflict cases.",
    C: "Maintenance: planning rhythms (weekly/quarterly); self-process audit once a month.",
    E: "Maintenance: check-in rituals in meetings (check-in sessions about the emotional state in the team); journaling once a week.",
    H: "Training (targeted): micro-skills of honesty and open reporting; reflection of values with 360 micro-feedback.",
    O: "Training (targeted): idea generation techniques (SCAMPER), hypothesis-driven work; cultural sensitivity, micro-exercises of creative thinking.",
    X: "Training (targeted): facilitation of discussions and networking scripts; social boldness exercises, elevator pitch exercises.",
  },
  hbOverallDevelopmentSuggestion: {
    A: "Maintenance: high compliance; continue with rhythms and light stretch tasks.",
    C: "Maintenance: high compliance; continue with rhythms and light stretch tasks.",
    E: "Maintenance: high compliance; continue with rhythms and light stretch tasks.",
    H: "Training (targeted): behavior below potential; focus on specific situations and routines.",
    O: "Training (targeted): behavior below potential; focus on specific situations and routines.",
    X: "Training (targeted): behavior below potential; focus on specific situations and routines.",
  },
  neuroCorrectionCorrected: {
    A: "2.38",
    C: "2.66",
    E: "2.17",
    H: "3.457054218248168152801",
    O: "2.8",
    X: "1.47",
  },
  neuroCorrectionRaw: {
    A: 3.4,
    C: 3.8,
    E: 3.1,
    H: 4.6,
    O: 4,
    X: 2.1,
  },
  neuroRedFlagAdditionalCheckNeeded: true,
  neuroRiskCategory: "high",
  nineGridFinalClassification:
    "High performance - Low potential - Misplaced Talent (Reallocation)",
  recruitmentHRActions: "N/A",
  recruitmentProfile:
    "Too good to be true" as keyof typeof personalityProfileMap,
  recruitmentRisks: "N/A",
  recruitmentStrengths: "N/A",
  idealCandidateResults: [
    3, 3, 2, 3, 3, 3, 2, 3, 2, 1, 3, 3, 1, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 3,
  ],
};
