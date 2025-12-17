function getScore(score: number) {
  if (score < 2.5) return 1;
  if (score < 3.5) return 2;
  return 3;
}

function getAlignment(participantScore: number, idealScore: number) {
  return 3 - Math.abs(participantScore - idealScore);
}

function getFitIndex(participantScores: number, idealScores: number) {
  return (5 - Math.abs(participantScores - idealScores)) / 5;
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
    H: (idealCandidate[0].result + idealCandidate[1].result) / 2,
    E: (idealCandidate[2].result + idealCandidate[3].result) / 2,
    X: (idealCandidate[4].result + idealCandidate[5].result) / 2,
    A: (idealCandidate[6].result + idealCandidate[7].result) / 2,
    C: (idealCandidate[8].result + idealCandidate[9].result) / 2,
    O: (idealCandidate[10].result + idealCandidate[11].result) / 2,
    Results: (idealCandidate[12].result + idealCandidate[13].result) / 2,
    Mindset: (idealCandidate[14].result + idealCandidate[15].result) / 2,
    Skills: (idealCandidate[16].result + idealCandidate[17].result) / 2,
    Communication: (idealCandidate[18].result + idealCandidate[19].result) / 2,
    Interpersonal: (idealCandidate[20].result + idealCandidate[21].result) / 2,
    Influence: (idealCandidate[22].result + idealCandidate[23].result) / 2
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
    Influence: getScore(idealCandidateCalculated.Influence)
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
    Influence: hBeck.O
  };

  const idealCandidateAlignment = {
    H: getAlignment(participantScoreCategories.H, idealScoreCategories.H),
    E: getAlignment(participantScoreCategories.E, idealScoreCategories.E),
    X: getAlignment(participantScoreCategories.X, idealScoreCategories.X),
    A: getAlignment(participantScoreCategories.A, idealScoreCategories.A),
    C: getAlignment(participantScoreCategories.C, idealScoreCategories.C),
    O: getAlignment(participantScoreCategories.O, idealScoreCategories.O),
    Results: getAlignment(participantScoreCategories.Results, idealScoreCategories.Results),
    Mindset: getAlignment(participantScoreCategories.Mindset, idealScoreCategories.Mindset),
    Skills: getAlignment(participantScoreCategories.Skills, idealScoreCategories.Skills),
    Communication: getAlignment(participantScoreCategories.Communication, idealScoreCategories.Communication),
    Interpersonal: getAlignment(participantScoreCategories.Interpersonal, idealScoreCategories.Interpersonal),
    Influence: getAlignment(participantScoreCategories.Influence, idealScoreCategories.Influence)
  };

  const fitIndexCloseToIdeal = {
    H: getFitIndex(participantScoreCategories.H, idealScoreCategories.H),
    E: getFitIndex(participantScoreCategories.E, idealScoreCategories.E),
    X: getFitIndex(participantScoreCategories.X, idealScoreCategories.X),
    A: getFitIndex(participantScoreCategories.A, idealScoreCategories.A),
    C: getFitIndex(participantScoreCategories.C, idealScoreCategories.C),
    O: getFitIndex(participantScoreCategories.O, idealScoreCategories.O),
    Results: getFitIndex(participantScoreCategories.Results, idealScoreCategories.Results),
    Mindset: getFitIndex(participantScoreCategories.Mindset, idealScoreCategories.Mindset),
    Skills: getFitIndex(participantScoreCategories.Skills, idealScoreCategories.Skills),
    Communication: getFitIndex(participantScoreCategories.Communication, idealScoreCategories.Communication),
    Interpersonal: getFitIndex(participantScoreCategories.Interpersonal, idealScoreCategories.Interpersonal),
    Influence: getFitIndex(participantScoreCategories.Influence, idealScoreCategories.Influence)
  };
  const fitIndexOverall =
    (Object.values(fitIndexCloseToIdeal).reduce((acc, val) => acc + val, 0) /
      Object.values(fitIndexCloseToIdeal).length) *
    100;

  return {
    idealCandidateCalculated,
    idealScoreCategories,
    participantScoreCategories,
    idealCandidateAlignment,
    fitIndexCloseToIdeal,
    fitIndexOverall
  };
}
