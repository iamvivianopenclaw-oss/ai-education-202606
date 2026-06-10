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

  it("does not praise evidence capture for partial predictions with no matched observations", () => {
    const experiment = experiments.find((item) => item.id === "co2-preparation")!;
    const evaluation = evaluateExpectation(experiment, "液体会变少");
    const reflection = generateLearningReflection(experiment, evaluation);

    expect(evaluation.status).toBe("partial");
    expect(evaluation.matchedObservations).toHaveLength(0);
    expect(reflection.insight).toMatch(/还没有|没有连接到关键证据/);
    expect(reflection.insight).not.toContain("抓住了一部分证据");
  });

  it("keeps evidence capture guidance for partial predictions with matched observations", () => {
    const experiment = experiments.find((item) => item.id === "co2-preparation")!;
    const evaluation = evaluateExpectation(experiment, "会冒泡");
    const reflection = generateLearningReflection(experiment, evaluation);

    expect(evaluation.status).toBe("partial");
    expect(evaluation.matchedObservations.length).toBeGreaterThan(0);
    expect(reflection.insight).toContain("抓住了一部分证据");
  });

  it("keeps prediction-first guidance for empty expectations", () => {
    const experiment = experiments.find((item) => item.id === "co2-preparation")!;
    const evaluation = evaluateExpectation(experiment, "");
    const reflection = generateLearningReflection(experiment, evaluation);

    expect(reflection.insight).toContain("先做预测");
  });
});
