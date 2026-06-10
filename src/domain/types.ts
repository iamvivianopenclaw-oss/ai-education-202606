export type ObservationKind = "gas" | "color" | "precipitate" | "heat" | "flame" | "solid";

export interface Observation {
  kind: ObservationKind;
  label: string;
  detail: string;
  keywords: string[];
}

export interface ExperimentStep {
  title: string;
  detail: string;
}

export interface Experiment {
  id: string;
  title: string;
  subtitle: string;
  classroomFit: string;
  reactants: string[];
  condition: string;
  keywords: string[];
  steps: ExperimentStep[];
  observations: Observation[];
  equation: string;
  principle: string;
  conclusion: string;
  safetyNotes: string[];
  misconceptions: string[];
  followUpQuestions: string[];
  visual: {
    beakerLabel: string;
    liquidBefore: string;
    liquidAfter: string;
    accent: string;
  };
}

export interface ExpectationEvaluation {
  status: "accurate" | "partial" | "misconception" | "empty";
  matchedObservations: string[];
  missingObservations: string[];
  misconceptionHits: string[];
  message: string;
}

export interface TutorFeedback {
  headline: string;
  correction: string;
  observationSummary: string;
  equation: string;
  principle: string;
  conclusion: string;
  safety: string;
  followUpQuestion: string;
}

export interface LearningReflection {
  insight: string;
  nextStep: string;
  skillTags: string[];
}

export interface ProjectFeedback {
  id: string;
  clarity: "清楚" | "一般" | "需要改进";
  suggestion: string;
}
