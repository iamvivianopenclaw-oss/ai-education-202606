import type { Experiment, ExpectationEvaluation } from "./types";

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

function includesAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword.toLowerCase()));
}

function hasGasMention(input: string): boolean {
  return includesAny(input, ["气泡", "冒泡", "气体"]);
}

function hasNegatedGasMention(input: string): boolean {
  return /(?:不(?:会)?|没有|无)[^，。；、,.!?！？\s]{0,4}(?:气泡|冒泡|气体)/.test(input);
}

export function evaluateExpectation(experiment: Experiment, expectation: string): ExpectationEvaluation {
  const normalized = normalize(expectation);

  if (!normalized) {
    return {
      status: "empty",
      matchedObservations: [],
      missingObservations: experiment.observations.map((item) => item.label),
      misconceptionHits: [],
      message: "先写下你的预测，再和标准实验现象进行比较。"
    };
  }

  const matchedObservations = experiment.observations
    .filter((observation) => includesAny(normalized, observation.keywords))
    .map((observation) => observation.label);

  const missingObservations = experiment.observations
    .filter((observation) => !matchedObservations.includes(observation.label))
    .map((observation) => observation.label);

  const misconceptionHits = experiment.misconceptions.filter((misconception) => {
    if (misconception === "酸碱反应都会产生气泡") {
      return hasGasMention(normalized) && !hasNegatedGasMention(normalized);
    }

    return normalized.includes(misconception.toLowerCase());
  });

  if (misconceptionHits.length > 0) {
    return {
      status: "misconception",
      matchedObservations,
      missingObservations,
      misconceptionHits,
      message: "你的预测里有一个常见误区，建议先核对实验现象再下结论。"
    };
  }

  if (missingObservations.length === 0) {
    return {
      status: "accurate",
      matchedObservations,
      missingObservations,
      misconceptionHits,
      message: "你的预测与这个实验的关键现象基本一致。"
    };
  }

  return {
    status: "partial",
    matchedObservations,
    missingObservations,
    misconceptionHits,
    message:
      matchedObservations.length > 0
        ? "你抓住了部分现象，但还可以补充其他关键证据。"
        : "这个预测还没有命中关键实验现象。"
  };
}
