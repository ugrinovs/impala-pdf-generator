import Big from "big.js";

function getScore(score: number) {
  if (score < 2.5) return 1;
  if (score < 3.5) return 2;
  return 3;
}

function getAlignment(participantScore: number, idealScore: number) {
  console.log(
    "alignment",
    participantScore,
    idealScore,
    3 - Math.abs(participantScore - idealScore),
  );
  // 3 - (3 - 3); => 3 - 0; => 3 // high
  // 3 - (2 - 3); => 3 - 1; => 2 // medium
  // 3 - (1 - 3); => 3 - 2; => 1 // low
  // 3 - (0 - 3); => 3 - 3; => 0
  // 3 - (1 - 3); => 3 - 2; => 1
  // 3 - (2 - 3); => 3 - 1; => 2
  // 3 - (0 - 3); => 3 - 3; => 0
  // 3 - (1 - 3); => 3 - 2; => 1
  // 3 - (2 - 3); => 3 - 1; => 2
  return 3 - Math.abs(participantScore - idealScore);
}

function getFitIndex(participantScores: number, idealScores: number) {
  console.log(
    "fitIndex",
    participantScores,
    idealScores,
    (5 - Math.abs(participantScores - idealScores)) / 5,
  );
  return Big(Big(5).minus(participantScores).minus(idealScores).abs()).div(5);
}
export default function calculateIdeaCandidate(results: {
  neuroCorrectionCorrected: any;
  hbeckResult: any;
  idealCandidateResults: any;
}) {
  const hexacoCorrected = results.neuroCorrectionCorrected;
  const hBeck = results.hbeckResult;

  const idealCandidate = results.idealCandidateResults;

  const idealCandidateCalculated = {
    H: (idealCandidate[0] + idealCandidate[1] + 2) / 2,
    E: (idealCandidate[2] + idealCandidate[3] + 2) / 2,
    X: (idealCandidate[4] + idealCandidate[5] + 2) / 2,
    A: (idealCandidate[6] + idealCandidate[7] + 2) / 2,
    C: (idealCandidate[8] + idealCandidate[9] + 2) / 2,
    O: (idealCandidate[10] + idealCandidate[11] + 2) / 2,
    Results: (idealCandidate[12] + idealCandidate[13] + 2) / 2,
    Mindset: (idealCandidate[14] + idealCandidate[15] + 2) / 2,
    Skills: (idealCandidate[16] + idealCandidate[17] + 2) / 2,
    Communication: (idealCandidate[18] + idealCandidate[19] + 2) / 2,
    Interpersonal: (idealCandidate[20] + idealCandidate[21] + 2) / 2,
    Influence: (idealCandidate[22] + idealCandidate[23] + 2) / 2,
  };

  const idealScoreCategories = {
    H: getScore(idealCandidateCalculated.H),
    E: getScore(idealCandidateCalculated.E),
    X: getScore(idealCandidateCalculated.X),
    A: getScore(idealCandidateCalculated.A),
    C: getScore(idealCandidateCalculated.C),
    O: getScore(idealCandidateCalculated.O),
    Results: getScore(idealCandidateCalculated.Results),
    Mindset: getScore(idealCandidateCalculated.Mindset),
    Skills: getScore(idealCandidateCalculated.Skills),
    Communication: getScore(idealCandidateCalculated.Communication),
    Interpersonal: getScore(idealCandidateCalculated.Interpersonal),
    Influence: getScore(idealCandidateCalculated.Influence),
  };

  const participantScoreCategories = {
    H: getScore(hexacoCorrected.H),
    E: getScore(hexacoCorrected.E),
    X: getScore(hexacoCorrected.X),
    A: getScore(hexacoCorrected.A),
    C: getScore(hexacoCorrected.C),
    O: getScore(hexacoCorrected.O),
    Results: hBeck.H,
    Mindset: hBeck.E,
    Skills: hBeck.X,
    Communication: hBeck.A,
    Interpersonal: hBeck.C,
    Influence: hBeck.O,
  };
  console.log("idealCandidateCalculated", idealCandidateCalculated);

  const idealCandidateAlignment = {
    H: getAlignment(participantScoreCategories.H, idealScoreCategories.H),
    E: getAlignment(participantScoreCategories.E, idealScoreCategories.E),
    X: getAlignment(participantScoreCategories.X, idealScoreCategories.X),
    A: getAlignment(participantScoreCategories.A, idealScoreCategories.A),
    C: getAlignment(participantScoreCategories.C, idealScoreCategories.C),
    O: getAlignment(participantScoreCategories.O, idealScoreCategories.O),
    Results: getAlignment(
      participantScoreCategories.Results,
      idealScoreCategories.Results,
    ),
    Mindset: getAlignment(
      participantScoreCategories.Mindset,
      idealScoreCategories.Mindset,
    ),
    Skills: getAlignment(
      participantScoreCategories.Skills,
      idealScoreCategories.Skills,
    ),
    Communication: getAlignment(
      participantScoreCategories.Communication,
      idealScoreCategories.Communication,
    ),
    Interpersonal: getAlignment(
      participantScoreCategories.Interpersonal,
      idealScoreCategories.Interpersonal,
    ),
    Influence: getAlignment(
      participantScoreCategories.Influence,
      idealScoreCategories.Influence,
    ),
  };

  const fitIndexCloseToIdeal = {
    H: getFitIndex(hexacoCorrected.H, idealCandidateCalculated.H),
    E: getFitIndex(hexacoCorrected.E, idealCandidateCalculated.E),
    X: getFitIndex(hexacoCorrected.X, idealCandidateCalculated.X),
    A: getFitIndex(hexacoCorrected.A, idealCandidateCalculated.A),
    C: getFitIndex(hexacoCorrected.C, idealCandidateCalculated.C),
    O: getFitIndex(hexacoCorrected.O, idealCandidateCalculated.O),
    Results: getFitIndex(hBeck.H, idealCandidateCalculated.Results),
    Mindset: getFitIndex(hBeck.E, idealCandidateCalculated.Mindset),
    Skills: getFitIndex(hBeck.X, idealCandidateCalculated.Skills),
    Communication: getFitIndex(hBeck.A, idealCandidateCalculated.Communication),
    Interpersonal: getFitIndex(hBeck.C, idealCandidateCalculated.Interpersonal),
    Influence: getFitIndex(hBeck.O, idealCandidateCalculated.Influence),
  };
  const fitIndexOverall = Object.values(fitIndexCloseToIdeal)
    .reduce((acc, val) => acc.plus(val), new Big(0))
    .div(Object.values(fitIndexCloseToIdeal).length)
    .times(100);

  return {
    idealCandidateCalculated,
    idealScoreCategories,
    participantScoreCategories,
    idealCandidateAlignment,
    fitIndexCloseToIdeal,
    fitIndexOverall,
  };
}
