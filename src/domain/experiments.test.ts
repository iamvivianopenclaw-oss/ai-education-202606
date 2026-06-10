import { describe, expect, it } from "vitest";
import { experiments } from "./experiments";

describe("experiments", () => {
  it("contains the four classroom experiments required for the first prototype", () => {
    expect(experiments.map((experiment) => experiment.id)).toEqual([
      "co2-preparation",
      "acid-base-neutralization",
      "iron-copper-sulfate",
      "oxygen-preparation"
    ]);
  });

  it("marks hydrochloric acid and sodium hydroxide as no visible gas production", () => {
    const experiment = experiments.find((item) => item.id === "acid-base-neutralization");

    expect(experiment?.observations.some((item) => item.kind === "gas")).toBe(false);
    expect(experiment?.misconceptions).toContain("酸碱反应都会产生气泡");
  });

  it("includes equation, safety note, and classroom question for every experiment", () => {
    for (const experiment of experiments) {
      expect(experiment.equation.length).toBeGreaterThan(0);
      expect(experiment.safetyNotes.length).toBeGreaterThan(0);
      expect(experiment.followUpQuestions.length).toBeGreaterThan(0);
    }
  });
});
