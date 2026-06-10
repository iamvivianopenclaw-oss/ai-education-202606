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

  it("explains partial predictions with no matched observations", () => {
    const experiment = experiments.find((item) => item.id === "oxygen-preparation")!;
    const evaluation = evaluateExpectation(experiment, "我觉得液体会变少");
    const feedback = generateTutorFeedback(experiment, evaluation);

    expect(evaluation.status).toBe("partial");
    expect(evaluation.matchedObservations).toHaveLength(0);
    expect(feedback.correction).not.toContain("命中 ，");
    expect(feedback.correction).toContain("还没有命中");
  });

  it("explains matched and missing observations for partial predictions", () => {
    const experiment = experiments.find((item) => item.id === "oxygen-preparation")!;
    const evaluation = evaluateExpectation(experiment, "我预测会冒泡");
    const feedback = generateTutorFeedback(experiment, evaluation);

    expect(evaluation.status).toBe("partial");
    expect(feedback.correction).toContain("大量气泡");
    expect(feedback.correction).toContain("带火星木条复燃");
  });

  it("prompts students to write a prediction when feedback is empty", () => {
    const experiment = experiments.find((item) => item.id === "oxygen-preparation")!;
    const evaluation = evaluateExpectation(experiment, "");
    const feedback = generateTutorFeedback(experiment, evaluation);

    expect(evaluation.status).toBe("empty");
    expect(feedback.correction).toContain("还没有写出明确预测");
  });
});
