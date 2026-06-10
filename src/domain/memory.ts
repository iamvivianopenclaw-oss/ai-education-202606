import type { ExpectationEvaluation, Experiment, MemoryCard, ReviewStatus, TutorFeedback } from "./types";

const statusPriority: Record<ReviewStatus, number> = {
  due: 0,
  new: 1,
  mastered: 2
};

const mnemonics: Record<string, string> = {
  "co2-preparation": "先看气泡，再验石灰水，浑浊才说明 CO2。",
  "acid-base-neutralization": "中和不靠冒泡，颜色和酸碱性才是证据。",
  "iron-copper-sulfate": "铁换铜，红色出，蓝色浅，活动性强弱见。",
  "oxygen-preparation": "气泡先出现，木条再复燃，氧气检验要成链。"
};

export function createMemoryCard(
  experiment: Experiment,
  feedback: TutorFeedback,
  evaluation: ExpectationEvaluation,
  nowId = `${Date.now()}`
): MemoryCard {
  const keyPhenomena = experiment.observations.map((observation) => observation.label);
  const misconception = evaluation.misconceptionHits[0] ?? experiment.misconceptions[0] ?? "把现象和结论混在一起";
  const firstObservation = keyPhenomena[0] ?? "关键现象";
  const secondObservation = keyPhenomena[1] ?? experiment.conclusion;
  const createdAt = Number(nowId);

  return {
    id: `${experiment.id}-${nowId}`,
    experimentId: experiment.id,
    experimentTitle: experiment.title,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
    status: "new",
    keyPhenomena,
    equation: feedback.equation,
    principle: feedback.principle,
    misconception,
    safety: feedback.safety,
    mnemonic: buildMnemonic(experiment, keyPhenomena),
    recallPrompts: [
      {
        question: `${experiment.title}最关键的可观察现象是什么？`,
        answer: keyPhenomena.join("；")
      },
      {
        question: `${experiment.title}的化学方程式是什么？`,
        answer: feedback.equation
      },
      {
        question: "这个实验能得出什么结论？",
        answer: feedback.conclusion
      }
    ],
    misconceptionPrompt: {
      statement: misconception,
      isCorrect: false,
      explanation: feedback.correction
    },
    shortAnswerPrompt: {
      question: `为什么${firstObservation}能作为${experiment.title}的证据？`,
      answer: `${firstObservation}与${secondObservation}共同指向：${experiment.principle}`
    }
  };
}

export function getReviewQueue(cards: MemoryCard[]): MemoryCard[] {
  return [...cards].sort((left, right) => {
    const statusDiff = statusPriority[left.status] - statusPriority[right.status];
    if (statusDiff !== 0) return statusDiff;
    return (left.lastReviewedAt ?? left.createdAt) - (right.lastReviewedAt ?? right.createdAt);
  });
}

export function updateReviewStatus(card: MemoryCard, status: ReviewStatus, reviewedAt = Date.now()): MemoryCard {
  return {
    ...card,
    status,
    lastReviewedAt: reviewedAt
  };
}

function buildMnemonic(experiment: Experiment, phenomena: string[]): string {
  return mnemonics[experiment.id] ?? `记住证据链：${phenomena.join(" -> ")}。`;
}
