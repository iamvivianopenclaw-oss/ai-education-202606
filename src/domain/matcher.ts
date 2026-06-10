import { experiments } from "./experiments";
import type { Experiment } from "./types";

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

export function getExperimentById(id: string): Experiment | undefined {
  return experiments.find((experiment) => experiment.id === id);
}

export function findExperimentByInput(input: string): Experiment | undefined {
  const normalized = normalize(input);

  if (!normalized) {
    return undefined;
  }

  const scored = experiments
    .map((experiment) => ({
      experiment,
      score: experiment.keywords.reduce((total, keyword) => {
        return normalized.includes(keyword.toLowerCase()) ? total + 1 : total;
      }, 0)
    }))
    .filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.experiment;
}
