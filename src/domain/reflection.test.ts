import { describe, expect, it } from "vitest";
import { experiments } from "./experiments";
import { evaluateExpectation } from "./evaluator";
import { generateLearningReflection } from "./reflection";

describe("generateLearningReflection", () => {
  it("encourages evidence-based observation for accurate predictions", () => {
    const experiment = experiments.find((item) => item.id === "co2-preparation")!;
    const evaluation = evaluateExpectation(experiment, "有气泡，石灰水变浑浊");
    const reflection = generateLearningReflection(experiment, evaluation);

    expect(reflection.insight).toContain("证据");
    expect(reflection.skillTags).toContain("气体检验");
  });

  it("turns misconception into a next-step learning suggestion", () => {
    const experiment = experiments.find((item) => item.id === "acid-base-neutralization")!;
    const evaluation = evaluateExpectation(experiment, "会产生气泡");
    const reflection = generateLearningReflection(experiment, evaluation);

    expect(reflection.nextStep).toContain("先观察");
    expect(reflection.skillTags).toContain("误区修正");
  });
});
