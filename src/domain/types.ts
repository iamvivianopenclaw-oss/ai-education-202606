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

export type VisualPhase = "setup" | "reaction" | "observation" | "test" | "conclusion";
export type BubbleIntensity = "none" | "soft" | "medium" | "strong";
export type TurbidityLevel = "clear" | "misty" | "cloudy";
export type FlameState = "none" | "ember" | "rekindled";

export interface VisualSceneState {
  vessel: "test-tube" | "beaker" | "gas-generator";
  liquidColor: string;
  secondaryLiquidColor?: string;
  bubbleIntensity: BubbleIntensity;
  turbidity: TurbidityLevel;
  solid?: "none" | "calcium-carbonate" | "iron-nail" | "copper-coating" | "manganese-dioxide";
  colorChange?: "none" | "fade" | "blue-fade" | "pink-to-clear";
  flame: FlameState;
  temperature?: "normal" | "warm";
}

export interface VisualTimelineStep {
  id: string;
  phase: VisualPhase;
  title: string;
  instruction: string;
  observationCue: string;
  knowledgeTag: string;
  scene: VisualSceneState;
}

export type ReviewStatus = "new" | "due" | "mastered";

export interface RecallPrompt {
  question: string;
  answer: string;
}

export interface MisconceptionPrompt {
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ShortAnswerPrompt {
  question: string;
  answer: string;
}

export interface MemoryCard {
  id: string;
  experimentId: string;
  experimentTitle: string;
  createdAt: number;
  lastReviewedAt?: number;
  status: ReviewStatus;
  keyPhenomena: string[];
  equation: string;
  principle: string;
  misconception: string;
  safety: string;
  mnemonic: string;
  recallPrompts: RecallPrompt[];
  misconceptionPrompt: MisconceptionPrompt;
  shortAnswerPrompt: ShortAnswerPrompt;
}
