import { experiments } from "./experiments";
import type { Experiment } from "./types";

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

const STRONG_KEYWORDS: Record<string, string[]> = {
  "co2-preparation": ["二氧化碳", "澄清石灰水"],
  "acid-base-neutralization": ["酚酞", "中和"],
  "iron-copper-sulfate": ["硫酸铜"],
  "oxygen-preparation": ["氧气", "过氧化氢", "双氧水", "二氧化锰", "带火星木条", "复燃"]
};

const OXYGEN_PREPARATION_PROCEDURAL_KEYWORDS = ["过氧化氢", "双氧水", "二氧化锰", "带火星", "木条", "复燃"];

function includesAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword.toLowerCase()));
}

function isUnsupportedSulfurCombustion(input: string): boolean {
  return input.includes("硫") && input.includes("燃烧") && !includesAny(input, OXYGEN_PREPARATION_PROCEDURAL_KEYWORDS);
}

function hasStrongKeywordHit(experiment: Experiment, input: string): boolean {
  return includesAny(input, STRONG_KEYWORDS[experiment.id] ?? []);
}

export function getExperimentById(id: string): Experiment | undefined {
  return experiments.find((experiment) => experiment.id === id);
}

export function findExperimentByInput(input: string): Experiment | undefined {
  const normalized = normalize(input);

  if (!normalized) {
    return undefined;
  }

  if (isUnsupportedSulfurCombustion(normalized)) {
    return undefined;
  }

  const scored = experiments
    .map((experiment) => ({
      experiment,
      score: experiment.keywords.reduce((total, keyword) => {
        return normalized.includes(keyword.toLowerCase()) ? total + 1 : total;
      }, 0)
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best) {
    return undefined;
  }

  return best.score > 1 || hasStrongKeywordHit(best.experiment, normalized) ? best.experiment : undefined;
}
