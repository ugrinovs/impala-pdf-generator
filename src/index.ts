import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import * as config from "./lib/config.js";
import resExample from "./lib/res-example.js";
import calculateIdeaCandidate from "./lib/ideal-candidate.calculation.js";
import { personalityProfileMap } from "./lib/personality-profile.mapper.js";
import {
  createElement,
  findElementById,
  parseHTML,
  serializeDocument,
} from "./lib/html-parser.js";
import Big from "big.js";

// const __dirname = path.dirname(fileURLToPath(import.meta.dirname));
const __dirname = import.meta.dirname;
console.log("__dirname", __dirname);

const fitIndexIcons = {
  female: {
    low: fs.readFileSync(path.join(__dirname, "icons/fit-index/f_index1.png"), {
      encoding: "base64",
    }),
    medium: fs.readFileSync(
      path.join(__dirname, "icons/fit-index/f_index2.png"),
      { encoding: "base64" },
    ),
    high: fs.readFileSync(
      path.join(__dirname, "icons/fit-index/f_index3.png"),
      { encoding: "base64" },
    ),
  },
  male: {
    low: fs.readFileSync(path.join(__dirname, "icons/fit-index/m_index1.png"), {
      encoding: "base64",
    }),
    medium: fs.readFileSync(
      path.join(__dirname, "icons/fit-index/m_index2.png"),
      { encoding: "base64" },
    ),
    high: fs.readFileSync(
      path.join(__dirname, "icons/fit-index/m_index3.png"),
      { encoding: "base64" },
    ),
  },
};

const recruiter_name = "#{{RECRUITER_NAME}}";
const flow_name = "#{{FLOW_NAME}}";
const position_name = "#{{POSITION_NAME}}";
const assessment_type = "#{{ASSESSMENT_TYPE}}";
const first_name = "#{{FIRST_NAME}}";
const personality_profile_about = "#{{PERSONALITY_PROFILE_ABOUT}}";
const key_strengths = "#{{KEY_STRENGTHS}}";
const possible_weaknesses = "#{{POSSIBLE_WEAKNESSES}}";
const overall_recommendation = "#{{OVERALL_RECOMMENDATION}}";
const fit_index_percentage = "#{{FIT_INDEX_PERCENTAGE}}";
const ideal_ethical_profile = "#{{IDEAL_ETHICAL_PROFILE}}";
const candidate_ethical_alignment = "#{{CANDIDATE_ETHICAL_ALIGNMENT}}";
const ethical_interpretation = "#{{ETHICAL_INTERPRETATION}}";
const ideal_emotional_profile = "#{{IDEAL_EMOTIONAL_PROFILE}}";
const candidate_emotional_alignment = "#{{CANDIDATE_EMOTIONAL_ALIGNMENT}}";
const emotional_interpretation = "#{{EMOTIONAL_INTERPRETATION}}";
const ideal_engagement_profile = "#{{IDEAL_ENGAGEMENT_PROFILE}}";
const candidate_engagement_alignment = "#{{CANDIDATE_ENGAGEMENT_ALIGNMENT}}";
const engagement_interpretation = "#{{ENGAGEMENT_INTERPRETATION}}";
const ideal_collaboration_profile = "#{{IDEAL_COLLABORATION_PROFILE}}";
const candidate_collaboration_alignment =
  "#{{CANDIDATE_COLLABORATION_ALIGNMENT}}";
const collaboration_interpretation = "#{{COLLABORATION_INTERPRETATION}}";

const ideal_dependability_profile = "#{{IDEAL_DEPENDABILITY_PROFILE}}";
const candidate_dependability_alignment =
  "#{{CANDIDATE_DEPENDABILITY_ALIGNMENT}}";
const dependability_interpretation = "#{{DEPENDABILITY_INTERPRETATION}}";

const ideal_innovation_profile = "#{{IDEAL_INNOVATION_PROFILE}}";
const candidate_innovation_alignment = "#{{CANDIDATE_INNOVATION_ALIGNMENT}}";
const innovation_interpretation = "#{{INNOVATION_INTERPRETATION}}";

const ideal_strategic_profile = "#{{IDEAL_STRATEGIC_PROFILE}}";
const candidate_strategic_alignment = "#{{CANDIDATE_STRATEGIC_ALIGNMENT}}";
const strategic_interpretation = "#{{STRATEGIC_INTERPRETATION}}";

const ideal_insight_profile = "#{{IDEAL_INSIGHT_PROFILE}}";
const candidate_insight_alignment = "#{{CANDIDATE_INSIGHT_ALIGNMENT}}";
const insight_interpretation = "#{{INSIGHT_INTERPRETATION}}";

const ideal_productivity_profile = "#{{IDEAL_PRODUCTIVITY_PROFILE}}";
const candidate_productivity_alignment =
  "#{{CANDIDATE_PRODUCTIVITY_ALIGNMENT}}";
const productivity_interpretation = "#{{PRODUCTIVITY_INTERPRETATION}}";

const ideal_communication_profile = "#{{IDEAL_COMMUNICATION_PROFILE}}";
const candidate_communication_alignment =
  "#{{CANDIDATE_COMMUNICATION_ALIGNMENT}}";
const communication_interpretation = "#{{COMMUNICATION_INTERPRETATION}}";

const ideal_relational_profile = "#{{IDEAL_RELATIONAL_PROFILE}}";
const candidate_relational_alignment = "#{{CANDIDATE_RELATIONAL_ALIGNMENT}}";
const relational_interpretation = "#{{RELATIONAL_INTERPRETATION}}";

const ideal_leadership_profile = "#{{IDEAL_LEADERSHIP_PROFILE}}";
const candidate_leadership_alignment = "#{{CANDIDATE_LEADERSHIP_ALIGNMENT}}";
const leadership_interpretation = "#{{LEADERSHIP_INTERPRETATION}}";

const development_plan_dimension = "#{{DEVELOPMENT_PLAN_DIMENSION}}";
const development_plan_integrity = "#{{DEVELOPMENT_PLAN_INTEGRITY}}";
const development_plan_emotional_regulation =
  "#{{DEVELOPMENT_PLAN_EMOTIONAL_REGULATION}}";
const development_plan_communication_influence =
  "#{{DEVELOPMENT_PLAN_COMMUNICATION_INFLUENCE}}";
const development_plan_collaboration_diplomacy =
  "#{{DEVELOPMENT_PLAN_COLLABORATION_DIPLOMACY}}";
const development_plan_execution_reliability =
  "#{{DEVELOPMENT_PLAN_EXECUTION_RELIABILITY}}";
const development_plan_learning_innovation =
  "#{{DEVELOPMENT_PLAN_LEARNING_INNOVATION}}";

const explicit_integrity = "#{{EXPLICIT_INTEGRITY}}";
const implicit_integrity = "#{{IMPLICIT_INTEGRITY}}";
const discrepancy_integrity = "#{{DISCREPANCY_INTEGRITY}}";
const interpretation_integrity = "#{{INTERPRETATION_INTEGRITY}}";

const explicit_emotional = "#{{EXPLICIT_EMOTIONAL}}";
const implicit_emotional = "#{{IMPLICIT_EMOTIONAL}}";
const discrepancy_emotional = "#{{DISCREPANCY_EMOTIONAL}}";
const interpretation_emotional = "#{{INTERPRETATION_EMOTIONAL}}";

const explicit_communication = "#{{EXPLICIT_COMMUNICATION}}";
const implicit_communication = "#{{IMPLICIT_COMMUNICATION}}";
const discrepancy_communication = "#{{DISCREPANCY_COMMUNICATION}}";
const interpretation_communication = "#{{INTERPRETATION_COMMUNICATION}}";

const explicit_cooperation = "#{{EXPLICIT_COOPERATION}}";
const implicit_cooperation = "#{{IMPLICIT_COOPERATION}}";
const discrepancy_cooperation = "#{{DISCREPANCY_COOPERATION}}";
const interpretation_cooperation = "#{{INTERPRETATION_COOPERATION}}";

const explicit_performance = "#{{EXPLICIT_PERFORMANCE}}";
const implicit_performance = "#{{IMPLICIT_PERFORMANCE}}";
const discrepancy_performance = "#{{DISCREPANCY_PERFORMANCE}}";
const interpretation_performance = "#{{INTERPRETATION_PERFORMANCE}}";

const explicit_learning = "#{{EXPLICIT_LEARNING}}";
const implicit_learning = "#{{IMPLICIT_LEARNING}}";
const discrepancy_learning = "#{{DISCREPANCY_LEARNING}}";
const interpretation_learning = "#{{INTERPRETATION_LEARNING}}";

const personalty_profile_conclusion = "#{{PERSONALITY_PROFILE_CONCLUSION}}";
const personality_profile_conclusion_image_url =
  "#{{PERSONALITY_PROFILE_CONCLUSION_IMAGE_URL}}";
const fit_index_conclusion = "#{{FIT_INDEX_CONCLUSION}}";
const dev_plan_highest_score_image_url =
  "#{{DEV_PLAN_HIGHEST_SCORE_IMAGE_URL}}";
const dev_plan_highest_score = "#{{DEV_PLAN_HIGHEST_SCORE}}";
const dev_plan_second_highest_image_url =
  "#{{DEV_PLAN_SECOND_HIGHEST_IMAGE_URL}}";
const dev_plan_second_highest = "#{{DEV_PLAN_SECOND_HIGHEST}}";
const dev_plan_lowest_score_image_url = "#{{DEV_PLAN_LOWEST_SCORE_IMAGE_URL}}";
const dev_plan_lowest_score = "#{{DEV_PLAN_LOWEST_SCORE}}";
const dev_plan_second_lowest = "#{{DEV_PLAN_SECOND_LOWEST}}";

function getHexacoScore(hexacoData: {
  H: string;
  E: string;
  X: string;
  A: string;
  C: string;
  O: string;
}): {
  H: "low" | "medium" | "high";
  E: "low" | "medium" | "high";
  X: "low" | "medium" | "high";
  A: "low" | "medium" | "high";
  C: "low" | "medium" | "high";
  O: "low" | "medium" | "high";
} {
  return Object.keys(hexacoData).reduce(
    (acc, key) => {
      const k = key as "H" | "E" | "X" | "A" | "C" | "O";
      if (parseFloat(hexacoData[k]) < 0.3) {
        acc[k] = "low";
      }
      if (parseFloat(hexacoData[k]) >= 0.3 || parseFloat(hexacoData[k]) <= 0.7) {
        acc[k] = "medium";
      }

      if (parseFloat(hexacoData[k]) > 0.7) {
        acc[k] = "high";
      }
      return acc;
    },
    {} as {
      H: "low" | "medium" | "high";
      E: "low" | "medium" | "high";
      X: "low" | "medium" | "high";
      A: "low" | "medium" | "high";
      C: "low" | "medium" | "high";
      O: "low" | "medium" | "high";
    },
  );
}

//
// development_plan_integrity: "Integrity & Trust",
// development_plan_emotional_regulation: "Emotional Regulation & Resilience",
// development_plan_communication_influence: "Communication & Influence",
// development_plan_collaboration_diplomacy: "Collaboration & Diplomacy",
// development_plan_execution_reliability: "Execution & Reliability",
// development_plan_learning_innovation: "Learning & Innovation",
//
// H: "integrity",
// E: "emotional",
// X: "communication",
// A: "collaboration",
// C: "execution",
// O: "learning",
const hexacoNegativeBadges = {
  development_plan_integrity: fs.readFileSync(
    path.join(__dirname, "icons/badges/n_badge_h.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_emotional_regulation: fs.readFileSync(
    path.join(__dirname, "icons/badges/n_badge_e.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_communication_influence: fs.readFileSync(
    path.join(__dirname, "icons/badges/n_badge_x.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_collaboration_diplomacy: fs.readFileSync(
    path.join(__dirname, "icons/badges/n_badge_a.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_execution_reliability: fs.readFileSync(
    path.join(__dirname, "icons/badges/n_badge_c.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_learning_innovation: fs.readFileSync(
    path.join(__dirname, "icons/badges/n_badge_o.png"),
    {
      encoding: "base64",
    },
  ),
};

const hexacoPositiveBadges = {
  development_plan_integrity: fs.readFileSync(
    path.join(__dirname, "icons/badges/p_badge_h.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_emotional_regulation: fs.readFileSync(
    path.join(__dirname, "icons/badges/p_badge_e.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_communication_influence: fs.readFileSync(
    path.join(__dirname, "icons/badges/p_badge_x.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_collaboration_diplomacy: fs.readFileSync(
    path.join(__dirname, "icons/badges/p_badge_a.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_execution_reliability: fs.readFileSync(
    path.join(__dirname, "icons/badges/p_badge_c.png"),
    {
      encoding: "base64",
    },
  ),
  development_plan_learning_innovation: fs.readFileSync(
    path.join(__dirname, "icons/badges/p_badge_o.png"),
    {
      encoding: "base64",
    },
  ),
};

const overallBadges = {
  "charismatic-driver": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_charismatic_driver.png"),
    {
      encoding: "base64",
    },
  ),
  "charming-manipulator": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_charming_manipulator.png"),
    {
      encoding: "base64",
    },
  ),
  "passive-aggressive-perfectionist": fs.readFileSync(
    path.join(
      __dirname,
      "icons/badges/o_badge_passive_aggressive_perfectionist.png",
    ),
    {
      encoding: "base64",
    },
  ),
  "too-good-to-be-true": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_too_good_to_be_true.png"),
    {
      encoding: "base64",
    },
  ),
  "withdrawn-opportunist": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_withdrawn_opportunist.png"),
    {
      encoding: "base64",
    },
  ),
  "wall-of-silence": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_wall_of_silence.png"),
    {
      encoding: "base64",
    },
  ),
  "emotionally-reactive": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_emotionally_reactive.png"),
    {
      encoding: "base64",
    },
  ),
  "cool-calculator": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_cool_calculator.png"),
    {
      encoding: "base64",
    },
  ),
  "conflicted-soloist": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_conflicted_soloist.png"),
    {
      encoding: "base64",
    },
  ),
  "rigid-proceduralist": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_rigid_proceduralist.png"),
    {
      encoding: "base64",
    },
  ),
  "visionary-without-realization": fs.readFileSync(
    path.join(
      __dirname,
      "icons/badges/o_badge_visionary_without_realization.png",
    ),
    {
      encoding: "base64",
    },
  ),
  "latent-opponent": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_latent_opponent.png"),
    {
      encoding: "base64",
    },
  ),
  "stable-team-player": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_stable_team_player.png"),
    {
      encoding: "base64",
    },
  ),
  "innovator-disruptor": fs.readFileSync(
    path.join(__dirname, "icons/badges/o_badge_innovator_disruptor.png"),
    {
      encoding: "base64",
    },
  ),
  "operator-without-initiative": fs.readFileSync(
    path.join(
      __dirname,
      "icons/badges/o_badge_operator_without_initiative.png",
    ),
    {
      encoding: "base64",
    },
  ),
};

const idealProfileMap = {
  H: "ethical",
  E: "emotional",
  X: "engagement",
  A: "collaboration",
  C: "structured",
  O: "innovation",
  Results: "strategic",
  Mindset: "insight",
  Skills: "productivity",
  Communication: "communication",
  Interpersonal: "relational",
  Influence: "leadership",
};

const devPlanMap = {
  H: "integrity",
  E: "emotional",
  X: "communication",
  A: "collaboration",
  C: "execution",
  O: "learning",
} as const;

const devPlanDimensionMap = {
  development_plan_integrity: "Integrity & Trust",
  development_plan_emotional_regulation: "Emotional Regulation & Resilience",
  development_plan_communication_influence: "Communication & Influence",
  development_plan_collaboration_diplomacy: "Collaboration & Diplomacy",
  development_plan_execution_reliability: "Execution & Reliability",
  development_plan_learning_innovation: "Learning & Innovation",
};

const devPlanDimensionToHexacoKeyMap = {
  H: "development_plan_integrity",
  E: "development_plan_emotional_regulation",
  X: "development_plan_communication_influence",
  A: "development_plan_collaboration_diplomacy",
  C: "development_plan_execution_reliability",
  O: "development_plan_learning_innovation",
};

function getPersonalityProfile(
  recruitmentProfile: keyof typeof personalityProfileMap,
  name: string,
  gender: "male" | "female",
) {
  const profile = personalityProfileMap[recruitmentProfile];
  const personality = config.personalityProfileConfig[profile];

  const overallBadge = overallBadges[profile];
  const pronoun = gender === "male" ? "He" : "She";
  const about = personality.about
    .replaceAll("[Name]", name)
    .replaceAll("(NAME)", name)
    .replaceAll("[He/She]", pronoun);
  const strengths = personality.strengths
    .replaceAll("[Name]", name)
    .replaceAll("(NAME)", name)
    .replaceAll("[He/She]", pronoun);
  const weaknesses = personality.weaknesses
    .replaceAll("[Name]", name)
    .replaceAll("(NAME)", name)
    .replaceAll("[He/She]", pronoun);
  const recommendation = personality.overall
    .replaceAll("[Name]", name)
    .replaceAll("(NAME)", name)
    .replaceAll("[He/She]", pronoun);
  return {
    personality_profile_about: about
      .replaceAll("(He/She)", pronoun)
      .replaceAll("(His/Her)", gender === "male" ? "His" : "Her")
      .replaceAll("(His/Hers)", gender === "male" ? "His" : "Hers")
      .replaceAll("(his/her)", gender === "male" ? "His" : "Her")
      .replaceAll("(him/her)", gender === "male" ? "him" : "her"),
    key_strengths: strengths,
    possible_weaknesses: weaknesses,
    overall_recommendation: recommendation,
    personality_profile_conclusion_image_url: overallBadge,
    personality_profile_conclusion: config.personalityProfileConfig[
      profile
    ].conclusion
      .replaceAll("[Name]", name)
      .replaceAll("(NAME)", name)
      .replaceAll("[He/She]", pronoun)
      .replaceAll("(He/She)", pronoun)
      .replaceAll("(His/Her)", gender === "male" ? "His" : "Her")
      .replaceAll("(His/Hers)", gender === "male" ? "His" : "Hers")
      .replaceAll("(his/her)", gender === "male" ? "His" : "Her"),
  };
}

function getDevPlanFromScore(
  neuroCorrectionCorrected: {
    H: string;
    E: string;
    X: string;
    A: string;
    C: string;
    O: string;
  },
  name: string,
) {
  return {
    development_plan_integrity: config.dev_plan[devPlanMap["H"]][
      parseFloat(neuroCorrectionCorrected.H) <= 3 ? 1 : 2
    ].replaceAll("(Name)", name),
    development_plan_emotional_regulation: config.dev_plan[devPlanMap["E"]][
      parseFloat(neuroCorrectionCorrected.E) <= 3 ? 1 : 2
    ].replaceAll("(Name)", name),
    development_plan_communication_influence: config.dev_plan[devPlanMap["X"]][
      parseFloat(neuroCorrectionCorrected.X) <= 3 ? 1 : 2
    ].replaceAll("(Name)", name),
    development_plan_collaboration_diplomacy: config.dev_plan[devPlanMap["A"]][
      parseFloat(neuroCorrectionCorrected.A) <= 3 ? 1 : 2
    ].replaceAll("(Name)", name),
    development_plan_execution_reliability: config.dev_plan[devPlanMap["C"]][
      parseFloat(neuroCorrectionCorrected.C) <= 3 ? 1 : 2
    ].replaceAll("(Name)", name),
    development_plan_learning_innovation: config.dev_plan[devPlanMap["O"]][
      parseFloat(neuroCorrectionCorrected.O) <= 3 ? 1 : 2
    ].replaceAll("(Name)", name),
  };
}

function getIdealProfile(
  idealProfile: {
    ethical: "low" | "medium" | "high";
    emotional: "low" | "medium" | "high";
    engagement: "low" | "medium" | "high";
    collaboration: "low" | "medium" | "high";
    structured: "low" | "medium" | "high";
    innovation: "low" | "medium" | "high";
    strategic: "low" | "medium" | "high";
    insight: "low" | "medium" | "high";
    productivity: "low" | "medium" | "high";
    communication: "low" | "medium" | "high";
    relational: "low" | "medium" | "high";
    leadership: "low" | "medium" | "high";
  },
  candidateAlignment: {
    ethical: "low" | "medium" | "high";
    emotional: "low" | "medium" | "high";
    engagement: "low" | "medium" | "high";
    collaboration: "low" | "medium" | "high";
    structured: "low" | "medium" | "high";
    innovation: "low" | "medium" | "high";
    strategic: "low" | "medium" | "high";
    insight: "low" | "medium" | "high";
    productivity: "low" | "medium" | "high";
    communication: "low" | "medium" | "high";
    relational: "low" | "medium" | "high";
    leadership: "low" | "medium" | "high";
  },
) {
  return {
    ideal_ethical_profile:
      config.ideal_profile.ethical[idealProfile.ethical].profile,
    candidate_ethical_alignment: candidateAlignment.ethical,
    ethical_interpretation:
      config.ideal_profile.ethical[idealProfile.ethical].interpretation[
        candidateAlignment.ethical
      ],

    ideal_emotional_profile:
      config.ideal_profile.emotional[idealProfile.emotional].profile,
    candidate_emotional_alignment: candidateAlignment.emotional,
    emotional_interpretation:
      config.ideal_profile.emotional[idealProfile.emotional].interpretation[
        candidateAlignment.emotional
      ],

    ideal_engagement_profile:
      config.ideal_profile.engagement[idealProfile.engagement].profile,
    candidate_engagement_alignment: candidateAlignment.engagement,
    engagement_interpretation:
      config.ideal_profile.engagement[idealProfile.engagement].interpretation[
        candidateAlignment.engagement
      ],

    ideal_collaboration_profile:
      config.ideal_profile.collaboration[idealProfile.collaboration].profile,
    candidate_collaboration_alignment: candidateAlignment.collaboration,
    collaboration_interpretation:
      config.ideal_profile.collaboration[idealProfile.collaboration]
        .interpretation[candidateAlignment.collaboration],

    ideal_dependability_profile:
      config.ideal_profile.structured[idealProfile.structured].profile,
    candidate_dependability_alignment: candidateAlignment.structured,
    dependability_interpretation:
      config.ideal_profile.structured[idealProfile.structured].interpretation[
        candidateAlignment.structured
      ],

    ideal_innovation_profile:
      config.ideal_profile.innovation[idealProfile.innovation].profile,
    candidate_innovation_alignment: candidateAlignment.innovation,
    innovation_interpretation:
      config.ideal_profile.innovation[idealProfile.innovation].interpretation[
        candidateAlignment.innovation
      ],

    ideal_strategic_profile:
      config.ideal_profile.strategic[idealProfile.strategic].profile,
    candidate_strategic_alignment: candidateAlignment.strategic,
    strategic_interpretation:
      config.ideal_profile.strategic[idealProfile.strategic].interpretation[
        candidateAlignment.strategic
      ],

    ideal_insight_profile:
      config.ideal_profile.insight[idealProfile.insight].profile,
    candidate_insight_alignment: candidateAlignment.insight,
    insight_interpretation:
      config.ideal_profile.insight[idealProfile.insight].interpretation[
        candidateAlignment.insight
      ],

    ideal_productivity_profile:
      config.ideal_profile.productivity[idealProfile.productivity].profile,
    candidate_productivity_alignment: candidateAlignment.productivity,
    productivity_interpretation:
      config.ideal_profile.productivity[idealProfile.productivity]
        .interpretation[candidateAlignment.productivity],

    ideal_communication_profile:
      config.ideal_profile.communication[idealProfile.communication].profile,
    candidate_communication_alignment: candidateAlignment.communication,
    communication_interpretation:
      config.ideal_profile.communication[idealProfile.communication]
        .interpretation[candidateAlignment.communication],

    ideal_relational_profile:
      config.ideal_profile.relational[idealProfile.relational].profile,
    candidate_relational_alignment: candidateAlignment.relational,
    relational_interpretation:
      config.ideal_profile.relational[idealProfile.relational].interpretation[
        candidateAlignment.relational
      ],

    ideal_leadership_profile:
      config.ideal_profile.leadership[idealProfile.leadership].profile,
    candidate_leadership_alignment: candidateAlignment.leadership,
    leadership_interpretation:
      config.ideal_profile.leadership[idealProfile.leadership].interpretation[
        candidateAlignment.leadership
      ],
  };
}

export type ParticipantInfo = {
  fullName: string;
  discrepancyHexaco?: {
    H: string;
    E: string;
    X: string;
    A: string;
    C: string;
    O: string;
  };
  flow_name: string;
  position_name: string;
  assessment_type: string;
  recruitmentProfile: keyof typeof personalityProfileMap;
  neuroCorrectionCorrected: {
    H: string;
    E: string;
    X: string;
    A: string;
    C: string;
    O: string;
  };
  neuroCorrectionRaw: {
    H: number;
    E: number;
    X: number;
    A: number;
    C: number;
    O: number;
  };
  hbeckResult: {
    H: number;
    E: number;
    X: number;
    A: number;
    C: number;
    O: number;
  };
  idealCandidateResults: Array<number>;
  gender: "male" | "female";
};

function resultCreator(results: ParticipantInfo) {
  const hexacoScore = getHexacoScore(
    results.discrepancyHexaco ?? {
      H: "3",
      E: "3",
      X: "3",
      A: "3",
      C: "3",
      O: "3",
    },
  );

  const idealCandidate = calculateIdeaCandidate(results);
  const idealProfile = Object.keys(idealCandidate.idealScoreCategories).reduce(
    (acc, key) => {
      const profileKey = idealProfileMap[
        key as keyof typeof idealProfileMap
      ] as
        | "ethical"
        | "emotional"
        | "engagement"
        | "collaboration"
        | "structured"
        | "innovation"
        | "strategic"
        | "insight"
        | "productivity"
        | "communication"
        | "relational"
        | "leadership";
      acc[profileKey] =
        idealCandidate.idealScoreCategories[
          key as keyof typeof idealCandidate.idealScoreCategories
        ] < 2
          ? "low"
          : idealCandidate.idealScoreCategories[
                key as keyof typeof idealCandidate.idealScoreCategories
              ] === 2
            ? "medium"
            : "high";
      return acc;
    },
    {} as {
      ethical: "low" | "medium" | "high";
      emotional: "low" | "medium" | "high";
      engagement: "low" | "medium" | "high";
      collaboration: "low" | "medium" | "high";
      structured: "low" | "medium" | "high";
      innovation: "low" | "medium" | "high";
      strategic: "low" | "medium" | "high";
      insight: "low" | "medium" | "high";
      productivity: "low" | "medium" | "high";
      communication: "low" | "medium" | "high";
      relational: "low" | "medium" | "high";
      leadership: "low" | "medium" | "high";
    },
  );

  const candidateAlignment = Object.keys(
    idealCandidate.idealCandidateAlignment,
  ).reduce(
    (acc, key) => {
      const profileKey = idealProfileMap[
        key as keyof typeof idealProfileMap
      ] as
        | "ethical"
        | "emotional"
        | "engagement"
        | "collaboration"
        | "structured"
        | "innovation"
        | "strategic"
        | "insight"
        | "productivity"
        | "communication"
        | "relational"
        | "leadership";
      acc[profileKey] =
        idealCandidate.idealCandidateAlignment[
          key as keyof typeof idealCandidate.idealCandidateAlignment
        ] === 3
          ? "high"
          : idealCandidate.idealCandidateAlignment[
                key as keyof typeof idealCandidate.idealCandidateAlignment
              ] === 2
            ? "medium"
            : "low";
      return acc;
    },
    {} as {
      ethical: "low" | "medium" | "high";
      emotional: "low" | "medium" | "high";
      engagement: "low" | "medium" | "high";
      collaboration: "low" | "medium" | "high";
      structured: "low" | "medium" | "high";
      innovation: "low" | "medium" | "high";
      strategic: "low" | "medium" | "high";
      insight: "low" | "medium" | "high";
      productivity: "low" | "medium" | "high";
      communication: "low" | "medium" | "high";
      relational: "low" | "medium" | "high";
      leadership: "low" | "medium" | "high";
    },
  );

  const devPlanScore = getDevPlanFromScore(
    results.neuroCorrectionCorrected,
    results.fullName.split(" ")[0],
  );
  const sortedFromHighest = Object.keys(devPlanScore).sort((a, b) => {
    const devPlanA =
      devPlanMap[a.charAt(a.length - 1) as keyof typeof devPlanMap];
    const devPlanB =
      devPlanMap[b.charAt(b.length - 1) as keyof typeof devPlanMap];
    return (
      parseFloat(
        results.neuroCorrectionCorrected[
          devPlanA as keyof typeof results.neuroCorrectionCorrected
        ],
      ) -
      parseFloat(
        results.neuroCorrectionCorrected[
          devPlanB as keyof typeof results.neuroCorrectionCorrected
        ],
      )
    );
  }) as Array<keyof typeof devPlanScore>;
  const twoHighest = sortedFromHighest.slice(0, 2);
  const twoLowest = sortedFromHighest.slice(-2);

  console.log("fitIndexOverall", idealCandidate.fitIndexOverall.toString());
  return {
    recruiter_name: results.fullName,
    flow_name: results.flow_name,
    position_name: results.position_name,
    first_name: results.fullName.split(" ")[0],
    assessment_type: results.assessment_type,
    ...getPersonalityProfile(
      results.recruitmentProfile,
      results.fullName.split(" ")[0],
      results.gender,
    ),
    ...getIdealProfile(idealProfile, candidateAlignment),
    explicit_integrity: results.neuroCorrectionRaw.H.toFixed(2),
    implicit_integrity: parseFloat(results.neuroCorrectionCorrected.H).toFixed(
      2,
    ),
    discrepancy_integrity: hexacoScore.H,
    explicit_emotional: results.neuroCorrectionRaw.E.toFixed(2),
    implicit_emotional: parseFloat(results.neuroCorrectionCorrected.E).toFixed(
      2,
    ),
    discrepancy_emotional: hexacoScore.E,
    explicit_communication: results.neuroCorrectionRaw.X.toFixed(2),
    implicit_communication: parseFloat(
      results.neuroCorrectionCorrected.X,
    ).toFixed(2),
    discrepancy_communication: hexacoScore.X,
    explicit_cooperation: results.neuroCorrectionRaw.A.toFixed(2),
    implicit_cooperation: parseFloat(
      results.neuroCorrectionCorrected.A,
    ).toFixed(2),
    discrepancy_cooperation: hexacoScore.A,
    explicit_performance: results.neuroCorrectionRaw.C.toFixed(2),
    implicit_performance: parseFloat(
      results.neuroCorrectionCorrected.C,
    ).toFixed(2),
    discrepancy_performance: hexacoScore.C,
    explicit_learning: results.neuroCorrectionRaw.O.toFixed(2),
    implicit_learning: parseFloat(results.neuroCorrectionCorrected.O).toFixed(
      2,
    ),
    discrepancy_learning: hexacoScore.O,
    interpretation_integrity: config.neurocorrection.honesty[hexacoScore.H],
    interpretation_emotional:
      config.neurocorrection.emotionality[hexacoScore.E],
    interpretation_communication:
      config.neurocorrection.extraversion[hexacoScore.X],
    interpretation_cooperation:
      config.neurocorrection.agreeableness[hexacoScore.A],
    interpretation_performance:
      config.neurocorrection.conscientiousness[hexacoScore.C],
    interpretation_learning: config.neurocorrection.openness[hexacoScore.O],
    ...devPlanScore,
    fit_index_percentage: idealCandidate.fitIndexOverall.toFixed(2),
    fit_index_conclusion: config.fit_index_conclusion[
      idealCandidate.fitIndexOverall.lt(30)
        ? "low"
        : idealCandidate.fitIndexOverall.lt(70)
          ? "medium"
          : "high"
    ]
      .replaceAll("(Name)", results.fullName.split(" ")[0])
      .replaceAll("[Name]", results.fullName.split(" ")[0])
      .replaceAll("[He/She]", results.gender === "male" ? "He" : "She")
      .replaceAll("(His/Her)", results.gender === "male" ? "His" : "Her")
      .replaceAll("( )", idealCandidate.fitIndexOverall.toFixed(2) + "%"),
    dev_plan_highest_score_image_url: hexacoPositiveBadges[twoHighest[0]],
    dev_plan_second_highest_image_url: hexacoPositiveBadges[twoHighest[1]],
    dev_plan_highest_score: devPlanDimensionMap[twoHighest[0]],
    dev_plan_second_highest: devPlanDimensionMap[twoHighest[1]],
    dev_plan_lowest_score_image_url: hexacoNegativeBadges[twoLowest[0]],
    dev_plan_lowest_score: devPlanScore[twoLowest[0]],
    dev_plan_second_lowest: devPlanScore[twoLowest[1]],
  };
}

const selectors = {
  recruiter_name: {
    selector: '[data-id="recruiter_name"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(recruiter_name, replacementText),
  },
  flow_name: {
    selector: '[data-id="flow_name"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(flow_name, replacementText),
  },
  position_name: {
    selector: '[data-id="position_name"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(position_name, replacementText),
  },
  assessment_type: {
    selector: '[data-id="assessment_type"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(assessment_type, replacementText),
  },
  first_name: {
    selector: '[data-id="first_name"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(first_name, replacementText),
  },
  personality_profile_about: {
    selector: '[data-id="personality_profile_about"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(personality_profile_about, replacementText),
  },
  key_strengths: {
    selector: '[data-id="key_strengths"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(key_strengths, replacementText),
  },
  possible_weaknesses: {
    selector: '[data-id="possible_weaknesses"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(possible_weaknesses, replacementText),
  },
  overall_recommendation: {
    selector: '[data-id="overall_recommendation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(overall_recommendation, replacementText),
  },
  fit_index_percentage: {
    selector: '[data-id="fit_index_percentage"]',
    type: "text",
    replacement: (text, replacementText) => {
      return text.replaceAll(fit_index_percentage, replacementText);
    },
  },
  ideal_ethical_profile: {
    selector: '[data-id="ideal_ethical_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_ethical_profile, replacementText),
  },
  candidate_ethical_alignment: {
    selector: '[data-id="candidate_ethical_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_ethical_alignment, replacementText),
  },
  ethical_interpretation: {
    selector: '[data-id="ethical_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ethical_interpretation, replacementText),
  },
  ideal_emotional_profile: {
    selector: '[data-id="ideal_emotional_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_emotional_profile, replacementText),
  },
  candidate_emotional_alignment: {
    selector: '[data-id="candidate_emotional_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_emotional_alignment, replacementText),
  },
  emotional_interpretation: {
    selector: '[data-id="emotional_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(emotional_interpretation, replacementText),
  },
  ideal_engagement_profile: {
    selector: '[data-id="ideal_engagement_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_engagement_profile, replacementText),
  },
  candidate_engagement_alignment: {
    selector: '[data-id="candidate_engagement_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_engagement_alignment, replacementText),
  },
  engagement_interpretation: {
    selector: '[data-id="engagement_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(engagement_interpretation, replacementText),
  },
  ideal_collaboration_profile: {
    selector: '[data-id="ideal_collaboration_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_collaboration_profile, replacementText),
  },
  candidate_collaboration_alignment: {
    selector: '[data-id="candidate_collaboration_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_collaboration_alignment, replacementText),
  },
  collaboration_interpretation: {
    selector: '[data-id="collaboration_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(collaboration_interpretation, replacementText),
  },
  ideal_dependability_profile: {
    selector: '[data-id="ideal_dependability_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_dependability_profile, replacementText),
  },
  candidate_dependability_alignment: {
    selector: '[data-id="candidate_dependability_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_dependability_alignment, replacementText),
  },
  dependability_interpretation: {
    selector: '[data-id="dependability_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(dependability_interpretation, replacementText),
  },
  ideal_innovation_profile: {
    selector: '[data-id="ideal_innovation_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_innovation_profile, replacementText),
  },
  candidate_innovation_alignment: {
    selector: '[data-id="candidate_innovation_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_innovation_alignment, replacementText),
  },
  innovation_interpretation: {
    selector: '[data-id="innovation_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(innovation_interpretation, replacementText),
  },
  ideal_strategic_profile: {
    selector: '[data-id="ideal_strategic_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_strategic_profile, replacementText),
  },
  candidate_strategic_alignment: {
    selector: '[data-id="candidate_strategic_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_strategic_alignment, replacementText),
  },
  strategic_interpretation: {
    selector: '[data-id="strategic_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(strategic_interpretation, replacementText),
  },
  ideal_insight_profile: {
    selector: '[data-id="ideal_insight_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_insight_profile, replacementText),
  },
  candidate_insight_alignment: {
    selector: '[data-id="candidate_insight_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_insight_alignment, replacementText),
  },
  insight_interpretation: {
    selector: '[data-id="insight_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(insight_interpretation, replacementText),
  },
  ideal_productivity_profile: {
    selector: '[data-id="ideal_productivity_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_productivity_profile, replacementText),
  },
  candidate_productivity_alignment: {
    selector: '[data-id="candidate_productivity_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_productivity_alignment, replacementText),
  },
  productivity_interpretation: {
    selector: '[data-id="productivity_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(productivity_interpretation, replacementText),
  },
  ideal_communication_profile: {
    selector: '[data-id="ideal_communication_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_communication_profile, replacementText),
  },
  candidate_communication_alignment: {
    selector: '[data-id="candidate_communication_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_communication_alignment, replacementText),
  },
  communication_interpretation: {
    selector: '[data-id="communication_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(communication_interpretation, replacementText),
  },
  ideal_relational_profile: {
    selector: '[data-id="ideal_relational_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_relational_profile, replacementText),
  },
  candidate_relational_alignment: {
    selector: '[data-id="candidate_relational_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_relational_alignment, replacementText),
  },
  relational_interpretation: {
    selector: '[data-id="relational_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(relational_interpretation, replacementText),
  },
  ideal_leadership_profile: {
    selector: '[data-id="ideal_leadership_profile"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(ideal_leadership_profile, replacementText),
  },
  candidate_leadership_alignment: {
    selector: '[data-id="candidate_leadership_alignment"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(candidate_leadership_alignment, replacementText),
  },
  leadership_interpretation: {
    selector: '[data-id="leadership_interpretation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(leadership_interpretation, replacementText),
  },
  development_plan_dimension: {
    selector: '[data-id="development_plan_dimension"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(development_plan_dimension, replacementText),
  },
  development_plan_integrity: {
    selector: '[data-id="development_plan_integrity"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(development_plan_integrity, replacementText),
  },
  development_plan_emotional_regulation: {
    selector: '[data-id="development_plan_emotional_regulation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(development_plan_emotional_regulation, replacementText),
  },
  development_plan_communication_influence: {
    selector: '[data-id="development_plan_communication_influence"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(
        development_plan_communication_influence,
        replacementText,
      ),
  },
  development_plan_collaboration_diplomacy: {
    selector: '[data-id="development_plan_collaboration_diplomacy"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(
        development_plan_collaboration_diplomacy,
        replacementText,
      ),
  },
  development_plan_execution_reliability: {
    selector: '[data-id="development_plan_execution_reliability"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(development_plan_execution_reliability, replacementText),
  },
  development_plan_learning_innovation: {
    selector: '[data-id="development_plan_learning_innovation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(development_plan_learning_innovation, replacementText),
  },
  explicit_integrity: {
    selector: '[data-id="explicit_integrity"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(explicit_integrity, replacementText),
  },
  implicit_integrity: {
    selector: '[data-id="implicit_integrity"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(implicit_integrity, replacementText),
  },
  discrepancy_integrity: {
    selector: '[data-id="discrepancy_integrity"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(discrepancy_integrity, replacementText),
  },
  interpretation_integrity: {
    selector: '[data-id="interpretation_integrity"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(interpretation_integrity, replacementText),
  },
  explicit_emotional: {
    selector: '[data-id="explicit_emotional"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(explicit_emotional, replacementText),
  },
  implicit_emotional: {
    selector: '[data-id="implicit_emotional"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(implicit_emotional, replacementText),
  },
  discrepancy_emotional: {
    selector: '[data-id="discrepancy_emotional"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(discrepancy_emotional, replacementText),
  },
  interpretation_emotional: {
    selector: '[data-id="interpretation_emotional"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(interpretation_emotional, replacementText),
  },
  explicit_communication: {
    selector: '[data-id="explicit_communication"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(explicit_communication, replacementText),
  },
  implicit_communication: {
    selector: '[data-id="implicit_communication"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(implicit_communication, replacementText),
  },
  discrepancy_communication: {
    selector: '[data-id="discrepancy_communication"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(discrepancy_communication, replacementText),
  },
  interpretation_communication: {
    selector: '[data-id="interpretation_communication"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(interpretation_communication, replacementText),
  },
  explicit_cooperation: {
    selector: '[data-id="explicit_cooperation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(explicit_cooperation, replacementText),
  },
  implicit_cooperation: {
    selector: '[data-id="implicit_cooperation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(implicit_cooperation, replacementText),
  },
  discrepancy_cooperation: {
    selector: '[data-id="discrepancy_cooperation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(discrepancy_cooperation, replacementText),
  },
  interpretation_cooperation: {
    selector: '[data-id="interpretation_cooperation"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(interpretation_cooperation, replacementText),
  },
  explicit_performance: {
    selector: '[data-id="explicit_performance"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(explicit_performance, replacementText),
  },
  implicit_performance: {
    selector: '[data-id="implicit_performance"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(implicit_performance, replacementText),
  },
  discrepancy_performance: {
    selector: '[data-id="discrepancy_performance"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(discrepancy_performance, replacementText),
  },
  interpretation_performance: {
    selector: '[data-id="interpretation_performance"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(interpretation_performance, replacementText),
  },
  explicit_learning: {
    selector: '[data-id="explicit_learning"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(explicit_learning, replacementText),
  },
  implicit_learning: {
    selector: '[data-id="implicit_learning"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(implicit_learning, replacementText),
  },
  discrepancy_learning: {
    selector: '[data-id="discrepancy_learning"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(discrepancy_learning, replacementText),
  },
  interpretation_learning: {
    selector: '[data-id="interpretation_learning"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(interpretation_learning, replacementText),
  },
  personality_profile_conclusion_image_url: {
    selector: '[data-id="personality_profile_conclusion_image_url"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(
        personality_profile_conclusion_image_url,
        "data:image/png;base64, " + replacementText,
      ),
  },
  personality_profile_conclusion: {
    selector: '[data-id="personality_profile_conclusion"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(personalty_profile_conclusion, replacementText),
  },
  fit_index_conclusion: {
    selector: '[data-id="fit_index_conclusion"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(fit_index_conclusion, replacementText),
  },
  dev_plan_highest_score_image_url: {
    selector: '[data-id="dev_plan_highest_score_image_url"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(
        dev_plan_highest_score_image_url,
        "data:image/png;base64, " + replacementText,
      ),
  },
  dev_plan_highest_score: {
    selector: '[data-id="dev_plan_highest_score"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(dev_plan_highest_score, replacementText),
  },
  dev_plan_second_highest_image_url: {
    selector: '[data-id="dev_plan_second_highest_image_url"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(
        dev_plan_second_highest_image_url,
        "data:image/png;base64, " + replacementText,
      ),
  },
  dev_plan_second_highest: {
    selector: '[data-id="dev_plan_second_highest"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(dev_plan_second_highest, replacementText),
  },
  dev_plan_lowest_score_image_url: {
    selector: '[data-id="dev_plan_lowest_score_image_url"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(
        dev_plan_lowest_score_image_url,
        "data:image/png;base64, " + replacementText,
      ),
  },
  dev_plan_lowest_score: {
    selector: '[data-id="dev_plan_lowest_score"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(dev_plan_lowest_score, replacementText),
  },
  dev_plan_second_lowest: {
    selector: '[data-id="dev_plan_second_lowest"]',
    type: "text",
    replacement: (text, replacementText) =>
      text.replaceAll(dev_plan_second_lowest, replacementText),
  },
} as {
  [key: string]: {
    selector: string;
    type: "text" | "html";
    replacement: (text: string, replacementText: string) => string;
  };
};

export async function generateDevelopmentReport(
  result: ParticipantInfo = resExample,
) {
  const filePath = path.resolve(__dirname, "index.html"); // Replace with your file name
  let htmlContent = fs.readFileSync(filePath, "utf8");
  const finalResult = resultCreator(result);
  for (const key in selectors) {
    const { replacement } = selectors[key];
    htmlContent = replacement(
      htmlContent,
      finalResult[key as keyof typeof finalResult] ?? "N/A",
    );
  }

  const htmlDoc = parseHTML(htmlContent);

  const lowDiscrepancyScoreEl = findElementById(
    htmlDoc,
    "low_discrepancy_score",
  );
  const lowDiscrepancyScores = Object.keys(
    result.discrepancyHexaco ?? {},
  ).filter((key) => new Big(result.discrepancyHexaco?.[key] ?? 0).lt(3));
  console.log("lowDiscrepancyScores", lowDiscrepancyScores);
  console.log("lowDiscrepancyScoreEl", lowDiscrepancyScoreEl);
  for (const scoreKey of lowDiscrepancyScores) {
    const img = createElement(htmlDoc, "img");
    const dimension =
      devPlanDimensionToHexacoKeyMap[
        scoreKey as keyof typeof devPlanDimensionToHexacoKeyMap
      ];

    console.log("dimension", dimension);
    img.setAttribute(
      "src",
      "data:image/png;base64, " + hexacoPositiveBadges[dimension],
    );
    img.setAttribute("alt", scoreKey);
    img.classList.add("o-badge-lg");
    lowDiscrepancyScoreEl?.appendChild(img);
  }

  const highDiscrepancyScoreEl = findElementById(
    htmlDoc,
    "high_discrepancy_score",
  );
  const highDiscrepancyScores = Object.keys(
    result.discrepancyHexaco ?? {},
  ).filter((key) => new Big(result.discrepancyHexaco?.[key] ?? 0).gte(3));
  console.log("highDiscrepancyScores", highDiscrepancyScores);
  console.log("highDiscrepancyScoreEl", highDiscrepancyScoreEl);
  for (const scoreKey of highDiscrepancyScores) {
    const img = createElement(htmlDoc, "img");
    const dimension =
      devPlanDimensionToHexacoKeyMap[
        scoreKey as keyof typeof devPlanDimensionToHexacoKeyMap
      ];

    console.log("dimension", dimension);
    img.setAttribute(
      "src",
      "data:image/png;base64, " + hexacoNegativeBadges[dimension],
    );
    img.setAttribute("alt", scoreKey);
    img.classList.add("o-badge-lg");
    highDiscrepancyScoreEl?.appendChild(img);
  }

  const fitIndex = parseFloat(
    finalResult.fit_index_percentage?.toString() ?? "0",
  );
  const gender = result.gender;

  const iconConf = fitIndexIcons[gender];
  const fitIndexString =
    fitIndex < 21 ? "low" : fitIndex < 50 ? "medium" : "high";
  const iconUrl = "data:image/png;base64, " + iconConf[fitIndexString];
  const fitIndexConclusionSectionEl = findElementById(
    htmlDoc,
    "fit_index_conclusion_section",
  );
  const image = createElement(htmlDoc, "img");
  const span = createElement(htmlDoc, "span");
  const p = createElement(htmlDoc, "p");
  const p2 = createElement(htmlDoc, "p");
  const div = createElement(htmlDoc, "div");
  image.setAttribute("src", iconUrl);
  image.setAttribute("alt", "Fit Index Icon");
  image.classList.add("o-badge");
  p.textContent = `${new Big(finalResult.fit_index_percentage).toFixed(0)}%`;
  p2.textContent = "Overall match";

  p.classList.add("fit_index_percentage_value");
  const color = fitIndex < 21 ? "red" : fitIndex < 50 ? "yellow" : "green";
  p.classList.add(color);

  span.appendChild(p);
  span.appendChild(p2);
  span.classList.add("o_fit_index_percent");

  div.appendChild(image);
  div.appendChild(span);
  div.classList.add("fit-index-summary");

  fitIndexConclusionSectionEl?.prepend(div);

  fs.writeFileSync(
    path.resolve(__dirname, "output.html"),
    serializeDocument(htmlDoc),
    {
      encoding: "utf8",
    },
  );
  const outputFileUrl = `file://${path.resolve(__dirname, "output.html")}`;

  // Launch the browser and open a new blank page.
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  // Navigate the page to a URL.
  console.log("Loading HTML content...");
  await page.goto(outputFileUrl);
  console.log("HTML content loaded.");

  // page.waitForSelector(".explicit-implicit-table").then(async () => {
  const element = await page.$$("[data-id]");
  for (const el of element) {
    const attr = await page.evaluate((el) => el.getAttribute("data-id"), el);
    const startsWithDiscrepancy = attr?.startsWith("discrepancy_");
    const endsWithAlignment = attr?.endsWith("_alignment");
    if (!(startsWithDiscrepancy || endsWithAlignment)) {
      continue;
    }
    const textContent = await page.evaluate((el) => el.textContent, el);
    if (textContent === "high") {
      await page.evaluate((el) => {
        (el as HTMLElement).style.color = "red";
        el.textContent = "High";
      }, el);
    }
    if (textContent === "medium") {
      await page.evaluate((el) => {
        (el as HTMLElement).style.color = "orange";
        el.textContent = "Medium";
      }, el);
    }
    if (textContent === "low") {
      await page.evaluate((el) => {
        (el as HTMLElement).style.color = "green";
        el.textContent = "Low";
      }, el);
    }
  }

  await page.waitForSelector('[data-id="fit_index_icon"]').then(async () => {
    const fitIndex = parseFloat(
      finalResult.fit_index_percentage?.toString() ?? "0",
    );
    const iconElements = await page.$$('[data-id="fit_index_icon"]');
    const gender = result.gender;

    const iconConf = fitIndexIcons[gender];
    const fitIndexString =
      fitIndex < 21 ? "low" : fitIndex < 50 ? "medium" : "high";
    const iconUrl = "data:image/png;base64, " + iconConf[fitIndexString];

    const fitIndexClass = await page.$$(".fit_index_percent");
    console.log("fitIndexClass length", fitIndexClass.length);
    for (const el of fitIndexClass) {
      if (fitIndex < 21) {
        await page.evaluate((el) => {
          console.log("Adding red class to", el.classList);
          (el as HTMLElement).classList.add("red");
        }, el);
      } else if (fitIndex >= 21 && fitIndex < 50) {
        await page.evaluate((el) => {
          console.log("Adding yellow class to", el.classList);
          (el as HTMLElement).classList.add("yellow");
        }, el);
      } else {
        await page.evaluate((el) => {
          console.log("Adding green class to", el.classList);
          (el as HTMLElement).classList.add("green");
        }, el);
      }
    }

    for (const iconElement of iconElements) {
      if (fitIndex < 21) {
        await page.evaluate(
          (el, iconUrl) => {
            el.setAttribute("src", iconUrl);
          },
          iconElement,
          iconUrl,
        );
      } else if (fitIndex >= 21 && fitIndex < 50) {
        await page.evaluate(
          (el, iconUrl) => {
            el.setAttribute("src", iconUrl);
          },
          iconElement,
          iconUrl,
        );
      } else {
        await page.evaluate(
          (el, iconUrl) => {
            el.setAttribute("src", iconUrl);
          },
          iconElement,
          iconUrl,
        );
      }
    }
  });

  // await page.waitForSelector("#chart").then(async () => {
  //   const element = await page.$("#chart");
  //   await page.evaluate((el) => {
  //     function createChart(ctx) {
  //       const chartWidth = 400;
  //       ctx.font = "12px Roboto";
  //       ctx.textRendering = "geometricPrecision";
  //       function createBarPath(
  //         value,
  //         x,
  //         yMax,
  //         options = {
  //           offsetY: 0,
  //           offsetX: 0,
  //         },
  //       ) {
  //         const startOff = options.offsetX;
  //         const width = 30 + (options.offsetX ?? 0);
  //         const cornerRadius = 5;
  //         const cornerHeight = 10;
  //         const yMaxAdjusted = yMax + (options.offsetY ?? 0);
  //         const height = (value / 100) * yMax; // Scale value to fit in canvas height
  //         const y = yMax - height + (options.offsetY ?? 0); // Calculate y position based on height
  //         const path = new Path2D();
  //         path.moveTo(x + startOff, yMaxAdjusted - cornerHeight); // Bottom left
  //         path.lineTo(x + startOff, y); // Top left with rounded corner
  //         // path.quadraticCurveTo(x + 30, y, x + 35, y); // Top left corner
  //         path.lineTo(x + width, y); // Top right
  //         // path.quadraticCurveTo(x + 60, y, x + 60, y + 10); // Top right corner
  //         path.lineTo(x + width, yMaxAdjusted - cornerHeight); // Bottom right
  //         path.quadraticCurveTo(
  //           x + width,
  //           yMaxAdjusted,
  //           x + width - cornerRadius,
  //           yMaxAdjusted,
  //         ); // Bottom right corner
  //         path.lineTo(x + startOff + cornerRadius, yMaxAdjusted); // Bottom left
  //         path.quadraticCurveTo(
  //           x + startOff,
  //           yMaxAdjusted,
  //           x + startOff,
  //           yMaxAdjusted - cornerHeight,
  //         ); // Bottom left corner
  //
  //         path.closePath();
  //         return path;
  //       }
  //
  //       function createFilterPath(
  //         x,
  //         yMax,
  //         options = {
  //           offsetY: 0,
  //         },
  //       ) {
  //         const startOff = 15;
  //         const width = 30;
  //         const cornerRadius = 5;
  //         const path = new Path2D();
  //         const y = options.offsetY ?? 0;
  //         const cornerHeight = 10;
  //         const yMaxAdjusted = yMax + (options.offsetY ?? 0);
  //         // path.rect(x + 30, 41, 30, 210); // Simple rectangle for filter area
  //
  //         path.moveTo(x + startOff, y + cornerHeight); // Bottom left
  //         path.lineTo(x + startOff, yMaxAdjusted - cornerHeight); // Top left
  //         path.quadraticCurveTo(
  //           x + startOff,
  //           yMaxAdjusted,
  //           x + startOff + cornerRadius,
  //           yMaxAdjusted,
  //         ); // Top left corner
  //         path.lineTo(x + width - cornerRadius, yMaxAdjusted); // Top right
  //         path.quadraticCurveTo(
  //           x + width,
  //           yMaxAdjusted,
  //           x + width,
  //           yMaxAdjusted - cornerHeight,
  //         ); // Top right corner
  //         path.lineTo(x + width, y + cornerHeight); // Bottom right
  //         path.quadraticCurveTo(x + width, y, x + width - cornerRadius, y); // Bottom right corner
  //         path.lineTo(x + startOff + cornerRadius, y); // Bottom left
  //         path.quadraticCurveTo(
  //           x + startOff,
  //           y,
  //           x + startOff,
  //           y + cornerHeight,
  //         ); // Bottom left corner
  //         path.closePath();
  //         return path;
  //       }
  //
  //       function createTicksPath(
  //         x,
  //         yMax,
  //         options = {
  //           offsetY: 0,
  //           offsetX: 0,
  //         },
  //       ) {
  //         const yMaxAdjusted = yMax + (options.offsetY ?? 0);
  //         const path = new Path2D();
  //         const bigTickLength = 20;
  //         const smallTickLength = 10;
  //         const bigTickInterval = 40;
  //         const smallTickInterval = 4;
  //         // Draw ticks at every 50 units
  //         for (let i = 4; i <= yMax; i += smallTickInterval) {
  //           const y = yMaxAdjusted - i;
  //           const isTickAtBigInterval = i % bigTickInterval === 0;
  //           const tickLength =
  //             i % 40 === 0 && i !== 0 ? bigTickLength : smallTickLength;
  //           const tickStart = i % 40 === 0 && i !== 0 ? 10 : 15;
  //           const tickEnd = tickStart + tickLength;
  //           path.moveTo(x + tickStart + options.offsetX, y);
  //           path.lineTo(x + tickEnd + options.offsetX, y);
  //         }
  //         return path;
  //       }
  //
  //       function createBar(ctx, value, x, color, discrepancy) {
  //         const options = {
  //           offsetY: 30,
  //           offsetX: 30,
  //         };
  //
  //         const yMax = 200;
  //         const path = createBarPath(value, x, yMax, options);
  //         const filterPath = createFilterPath(x, yMax, options);
  //         const ticksPath = createTicksPath(x, yMax, options);
  //         // ctx.stroke(path);
  //         // Draw filter area
  //         ctx.strokeStyle = "rgb(222, 222, 222)";
  //         ctx.lineWidth = 1;
  //         ctx.fillStyle = "white";
  //         ctx.fill(filterPath);
  //         ctx.stroke(filterPath);
  //         // #00CCFF opacity 0.25
  //         ctx.fillStyle = color;
  //         ctx.fillOpacity = 0.25;
  //         ctx.fill(path);
  //
  //         // ticks
  //         ctx.strokeStyle = "rgb(218, 218, 218)";
  //         ctx.lineWidth = 1;
  //         ctx.lineCap = "round";
  //         ctx.stroke(ticksPath);
  //
  //         if (discrepancy) {
  //           console.log("Discrepancy detected:", discrepancy);
  //           const startOff = 10;
  //           const width = 20;
  //           // Highlight discrepancy area
  //           const start = (value / 100) * yMax; // Scale value to fit in canvas height
  //           const discHeight = (discrepancy / 100) * yMax;
  //           const y = 200 - start + options.offsetY;
  //           const discY = y - discHeight;
  //           const discPath = new Path2D();
  //           discPath.moveTo(x + startOff, discY);
  //           discPath.lineTo(x + width, discY);
  //           discPath.lineTo(x + width, y);
  //           discPath.lineTo(x + startOff, y);
  //           discPath.closePath();
  //           ctx.fillStyle = "rgb(238, 91, 91, 0.1)";
  //           ctx.strokeStyle = "rgb(255, 0, 0, 0.5)";
  //           ctx.setLineDash([2, 2]);
  //           ctx.fill(discPath);
  //           ctx.stroke(discPath);
  //
  //           ctx.font = "600 6px Roboto";
  //           ctx.fillStyle = "rgb(0, 0, 0, 1)";
  //           ctx.textAlign = "center";
  //           ctx.textBaseline = "middle";
  //           const discText = discrepancy < 30 ? "Low" : "Medium\n/High";
  //           const lines = discText.split("\n");
  //           for (let i = 0; i < lines.length; i++) {
  //             ctx.fillText(
  //               lines[i],
  //               x + 45,
  //               discY + discHeight / 2 + i * 7 - (lines.length - 1) * 3.5,
  //             );
  //           }
  //
  //           ctx.setLineDash([]);
  //           // ctx.fillStyle = 'rgb(255, 0, 0, 1)';
  //           // ctx.fill(disc);
  //         }
  //       }
  //
  //       function createHorizontalLines(
  //         ctx,
  //         yMax = 200,
  //         options = {
  //           offsetY: 0,
  //           offsetX: 0,
  //         },
  //       ) {
  //         const path = new Path2D();
  //         const yMaxAdjusted = yMax + (options.offsetY ?? 0);
  //         const offsetY = options.offsetY ?? 0;
  //         const offsetX = options.offsetX ?? 0;
  //         for (let i = 0; i <= yMax; i += 40) {
  //           const y = yMaxAdjusted - i;
  //           path.moveTo(offsetX, y);
  //           path.lineTo(chartWidth - 30, y);
  //         }
  //         ctx.strokeStyle = "rgb(212, 212, 212, 0.5)";
  //         ctx.lineWidth = 1;
  //         ctx.lineCap = "round";
  //         ctx.stroke(path);
  //       }
  //
  //       function createYScaleLabels(
  //         ctx,
  //         yMax = 200,
  //         options = {
  //           offsetY: 0,
  //           offsetX: 0,
  //         },
  //       ) {
  //         const offsetY = options.offsetY ?? 0;
  //         const offsetX = options.offsetX ?? 0;
  //         ctx.fillStyle = "black";
  //         ctx.font = "700 7px Roboto";
  //         ctx.textAlign = "right";
  //         ctx.textBaseline = "middle";
  //         for (let i = 0; i <= yMax; i += 40) {
  //           const y = yMax - i + offsetY;
  //           ctx.fillText((i / 40).toString(), offsetX + 20, y);
  //         }
  //       }
  //
  //       function textBetweenBars(ctx, text, x1, x2, y, options = {}) {
  //         const offsetY = options.offsetY ?? 0;
  //         const offsetX = options.offsetX ?? 0;
  //         ctx.fillStyle = "black";
  //         ctx.font = "700 7px Roboto";
  //         ctx.textAlign = "center";
  //         ctx.textBaseline = "middle";
  //         // get text width
  //         const textWidth = ctx.measureText(text).width;
  //         const x = x1 + offsetX - textWidth;
  //         ctx.fillText(text, x, y + offsetY);
  //       }
  //
  //       // Draw horizontal lines
  //       createHorizontalLines(ctx, 200, {
  //         offsetY: 50,
  //         offsetX: 24,
  //       });
  //
  //       createYScaleLabels(ctx, 200, {
  //         offsetY: 50,
  //         offsetX: 0,
  //       });
  //
  //       const values = Array.from({ length: 6 }).map(() => {
  //         const explicit = Math.floor(Math.random() * 100) + 1;
  //         const implicit = Math.floor(Math.random() * 100) + 1;
  //         return {
  //           explicit: explicit,
  //           implicit: implicit,
  //           discrepancy: Math.abs(explicit - implicit),
  //           isLowerExplicit: explicit < implicit,
  //         };
  //       });
  //
  //       function createXAxisLabels(
  //         ctx,
  //         values,
  //         x1,
  //         x2,
  //         options = {
  //           offsetY: 260,
  //           offsetX: 50,
  //         },
  //       ) {
  //         const offsetY = options.offsetY ?? 0;
  //         const offsetX = options.offsetX ?? 0;
  //         ctx.fillStyle = "hsla(0, 0%, 38%, 1)";
  //         ctx.textAlign = "center";
  //         ctx.font = "300 7px Roboto";
  //         ctx.textBaseline = "middle";
  //         ctx.fillText(values[0], x1 + offsetX + 15, offsetY);
  //         ctx.fillText(values[1], x2 + offsetX + 15, offsetY);
  //       }
  //
  //       function createGroupLabels(
  //         ctx,
  //         options = {
  //           offsetY: 20,
  //           offsetX: 50,
  //         },
  //       ) {
  //         const groups = [
  //           "Integrity and \ntrust",
  //           "Emotional \nregulation and \nresilience",
  //           "Communication \nand influence",
  //           "Cooperation \nand diplomacy",
  //           "Performance \nand reliability",
  //           "Learning and \ninnovation",
  //         ];
  //         const offsetY = options.offsetY ?? 0;
  //         const offsetX = options.offsetX ?? 0;
  //         const barSpacing = chartWidth / barCount;
  //         ctx.fillStyle = "hsla(0, 0%, 38%, 1)";
  //         ctx.textAlign = "left";
  //         ctx.font = "300 10px Roboto";
  //         ctx.textBaseline = "bottom";
  //         const maxLines = Math.max(...groups.map((g) => g.split("\n").length));
  //         for (let i = 0; i < groups.length; i++) {
  //           const x = i * (barSpacing * 2) + offsetX;
  //           const lines = groups[i].split("\n");
  //           for (let j = lines.length - 1; j >= 0; j--) {
  //             const lineOffset = maxLines * 10 - (lines.length - j) * 10;
  //
  //             console.log(
  //               "Drawing group label:",
  //               lines[j],
  //               "at",
  //               x,
  //               offsetY + lineOffset,
  //             );
  //             ctx.fillText(lines[j], x, offsetY + lineOffset);
  //           }
  //         }
  //       }
  //
  //       const width = chartWidth;
  //       const barCount = 12;
  //       createGroupLabels(ctx, {
  //         offsetY: 20,
  //         offsetX: 38,
  //       });
  //       for (let i = 0; i < values.length; i++) {
  //         const value = values[i]; // Random value between 1 and 100
  //         // every two bars have different x position
  //         const color =
  //           i % 2 === 1 ? "rgb(0, 9, 255, 0.25)" : "rgba(0, 204, 255, 0.25)";
  //         const barSpacing = width / barCount;
  //         const x1 = i * (barSpacing * 2) + 5;
  //         const x2 = x1 + 43;
  //         console.log(
  //           "Bar",
  //           i,
  //           "Explicit:",
  //           value.explicit,
  //           "Implicit:",
  //           value.implicit,
  //           x1,
  //           x2,
  //         );
  //         createBar(
  //           ctx,
  //           value.explicit,
  //           x1,
  //           "rgba(0, 204, 255, 0.25)",
  //           value.isLowerExplicit ? value.discrepancy : 0,
  //         );
  //         textBetweenBars(ctx, `vs`, x1 + 29, x2, 100, {
  //           offsetY: 50,
  //           offsetX: 45,
  //         });
  //         createBar(
  //           ctx,
  //           value.implicit,
  //           x2,
  //           "rgb(0, 9, 255, 0.25)",
  //           value.isLowerExplicit ? 0 : value.discrepancy,
  //         );
  //         createXAxisLabels(ctx, ["Explicit", "Implicit"], x1, x2, {
  //           offsetY: 260,
  //           offsetX: 30,
  //         });
  //       }
  //       // });
  //     }
  //     function generateFitIndexChart(container) {
  //       // Example chart generation using Chart.js
  //       const ctx = container.getContext("2d");
  //       createChart(ctx);
  //     }
  //     console.log("Generating chart in element:", el, typeof cChart);
  //     generateFitIndexChart(el);
  //   }, element);
  // });

  const someLow = Object.values(result.discrepancyHexaco ?? {}).some(
    (v) => Number(v) < 0.3,
  );
  if (someLow) {
    const lowScores = Object.entries(result.discrepancyHexaco ?? {}).filter(
      ([_, v]) => Number(v) < 0.3,
    );
    console.log("Low discrepancy scores found:", lowScores);
    // await page.waitForSelector("#low_discrepancy_score").then(async () => {
    //   for (const [trait, score] of lowScores) {
    //     const el = await page.$(`#low_discrepancy_score`);
    //     el.chi;
    //   }
    // });
  }

  const someHigh = Object.values(result.discrepancyHexaco ?? {}).some(
    (v) => Number(v) > 0.7,
  );
  if (someHigh) {
    const highScores = Object.entries(result.discrepancyHexaco ?? {}).filter(
      ([_, v]) => Number(v) > 0.7,
    );
    console.log("High discrepancy scores found:", highScores);
    await page.waitForSelector("#high_discrepancy_score").then(async () => {});
  }
  // await page.waitForSelector('[data-id="overall_badge"]').then(async () => {
  //   const overallBadgeName = personalityProfileMap[result.recruitmentProfile];
  //   const badgeElements = await page.$$('[data-id="overall_badge"]');
  //   const overallBadge = overallBadges[overallBadgeName];
  //   for (const badgeElement of badgeElements) {
  //     await page.evaluate(
  //       (el, overallBadge) => {
  //         el.textContent = overallBadge;
  //       },
  //       badgeElement,
  //       overallBadge,
  //     );
  //   }
  // });

  const puppeteerDPI = 96 + 48; // Default is 96 DPI
  const projectDPI = 72; // Project is designed at 72 DPI

  // Set screen size.
  await page.setViewport({
    width: 595,
    height: 842,
    deviceScaleFactor: 1,
  });
  const pdfStream = await page.pdf({
    // path: 'output.pdf',
    format: "A4",
    printBackground: true,
    width: "210mm",
    scale: puppeteerDPI / projectDPI,
    preferCSSPageSize: false,
  });
  const base64 = Buffer.from(pdfStream).toString("base64");
  return base64;
}

// serves for testing

// generateDevelopmentReport()
//   .then((base64) => {
//     console.log("Generated PDF base64 length:", base64.length);
//     fs.writeFileSync(path.resolve(__dirname, "output.pdf"), base64, {
//       encoding: "base64",
//     });
//     process.exit(0);
//   })
//   .catch((error) => {
//     console.error("Error generating PDF:", error);
//     process.exit(1);
//   });
