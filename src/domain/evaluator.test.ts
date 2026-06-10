import { describe, expect, it } from "vitest";
import { experiments } from "./experiments";
import { evaluateExpectation } from "./evaluator";

const neutralization = experiments.find((experiment) => experiment.id === "acid-base-neutralization")!;
const co2 = experiments.find((experiment) => experiment.id === "co2-preparation")!;

describe("evaluateExpectation", () => {
  it("flags the acid-base gas misconception", () => {
    const result = evaluateExpectation(neutralization, "我觉得盐酸和氢氧化钠会产生很多气泡");

    expect(result.status).toBe("misconception");
    expect(result.misconceptionHits).toContain("酸碱反应都会产生气泡");
  });

  it("does not flag negated gas language as the acid-base gas misconception", () => {
    const result = evaluateExpectation(neutralization, "盐酸和氢氧化钠中和，不会产生气泡，酚酞会褪色");

    expect(result.status).not.toBe("misconception");
    expect(result.misconceptionHits).not.toContain("酸碱反应都会产生气泡");
  });

  it("recognizes a complete carbon dioxide expectation", () => {
    const result = evaluateExpectation(co2, "会产生气泡，并且澄清石灰水变浑浊");

    expect(result.status).toBe("accurate");
    expect(result.matchedObservations).toEqual(["产生气泡", "石灰水变浑浊"]);
  });

  it("recognizes partial expectation", () => {
    const result = evaluateExpectation(co2, "应该会冒泡");

    expect(result.status).toBe("partial");
    expect(result.missingObservations).toEqual(["石灰水变浑浊"]);
  });

  it("handles empty expectation", () => {
    const result = evaluateExpectation(co2, "   ");

    expect(result.status).toBe("empty");
    expect(result.message).toContain("先写下你的预测");
  });

  it("treats non-empty unmatched expectations as partial", () => {
    const result = evaluateExpectation(co2, "我觉得杯子会变重");

    expect(result.status).toBe("partial");
    expect(result.message).toContain("没有命中关键实验现象");
  });
});
