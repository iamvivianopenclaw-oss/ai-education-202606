import { describe, expect, it } from "vitest";
import { evaluateExpectation } from "./evaluator";
import { experiments } from "./experiments";
import { createMemoryCard, getReviewQueue, updateReviewStatus } from "./memory";
import { generateTutorFeedback } from "./tutor";

const co2 = experiments.find((item) => item.id === "co2-preparation")!;
const neutralization = experiments.find((item) => item.id === "acid-base-neutralization")!;

describe("memory cards", () => {
  it("creates a card from experiment facts and tutor feedback", () => {
    const evaluation = evaluateExpectation(co2, "会产生气泡，石灰水变浑浊");
    const feedback = generateTutorFeedback(co2, evaluation);
    const card = createMemoryCard(co2, feedback, evaluation, "1000");

    expect(card.experimentId).toBe("co2-preparation");
    expect(card.experimentTitle).toBe("二氧化碳的制取与检验");
    expect(card.status).toBe("new");
    expect(card.keyPhenomena).toContain("产生气泡");
    expect(card.equation).toContain("CaCO3");
    expect(card.recallPrompts[0].answer).toContain("石灰水");
    expect(card.misconceptionPrompt.statement).toContain("气泡");
  });

  it("creates misconception practice for acid-base neutralization", () => {
    const evaluation = evaluateExpectation(neutralization, "会冒很多气泡");
    const feedback = generateTutorFeedback(neutralization, evaluation);
    const card = createMemoryCard(neutralization, feedback, evaluation, "2000");

    expect(card.misconceptionPrompt.statement).toContain("酸碱反应");
    expect(card.misconceptionPrompt.isCorrect).toBe(false);
    expect(card.shortAnswerPrompt.question).toContain("为什么");
  });

  it("creates a memorable mnemonic for each experiment", () => {
    for (const experiment of experiments) {
      const evaluation = evaluateExpectation(experiment, "");
      const feedback = generateTutorFeedback(experiment, evaluation);
      const card = createMemoryCard(experiment, feedback, evaluation, "3000");

      expect(card.mnemonic.length).toBeGreaterThan(8);
      expect(card.mnemonic).not.toContain("undefined");
    }
  });

  it("orders review queue by status priority", () => {
    const base = createMemoryCard(co2, generateTutorFeedback(co2, evaluateExpectation(co2, "")), evaluateExpectation(co2, ""), "1");
    const due = { ...base, id: "due", status: "due" as const, lastReviewedAt: 1 };
    const fresh = { ...base, id: "new", status: "new" as const, lastReviewedAt: undefined };
    const mastered = { ...base, id: "mastered", status: "mastered" as const, lastReviewedAt: 3 };

    expect(getReviewQueue([mastered, fresh, due]).map((item) => item.id)).toEqual(["due", "new", "mastered"]);
  });

  it("updates review status with timestamps", () => {
    const card = createMemoryCard(co2, generateTutorFeedback(co2, evaluateExpectation(co2, "")), evaluateExpectation(co2, ""), "1");

    expect(updateReviewStatus(card, "mastered", 3000)).toMatchObject({
      status: "mastered",
      lastReviewedAt: 3000
    });
  });
});
