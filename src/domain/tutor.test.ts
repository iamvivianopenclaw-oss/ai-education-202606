import { describe, expect, it } from "vitest";
import { experiments } from "./experiments";
import { evaluateExpectation } from "./evaluator";
import { generateTutorFeedback } from "./tutor";

describe("generateTutorFeedback", () => {
  it("corrects the neutralization gas misconception", () => {
    const experiment = experiments.find((item) => item.id === "acid-base-neutralization")!;
    const evaluation = evaluateExpectation(experiment, "我认为会产生气泡");
    const feedback = generateTutorFeedback(experiment, evaluation);

    expect(feedback.correction).toContain("不是所有酸碱反应都会产生气泡");
    expect(feedback.equation).toContain("HCl + NaOH");
  });

  it("includes safety and follow-up question", () => {
    const experiment = experiments.find((item) => item.id === "oxygen-preparation")!;
    const evaluation = evaluateExpectation(experiment, "会冒泡，木条复燃");
    const feedback = generateTutorFeedback(experiment, evaluation);

    expect(feedback.safety).toContain("过氧化氢");
    expect(feedback.followUpQuestion).toContain("二氧化锰");
  });
});
