import { describe, expect, it } from "vitest";
import { experiments } from "./experiments";
import { createVisualTimeline, hasCuratedVisualTimeline } from "./visualTimeline";

describe("createVisualTimeline", () => {
  it("has a curated visual timeline for every current experiment", () => {
    expect(experiments.every((experiment) => hasCuratedVisualTimeline(experiment.id))).toBe(true);
  });

  it("creates at least three visual states for each experiment", () => {
    for (const experiment of experiments) {
      const timeline = createVisualTimeline(experiment);

      expect(timeline.length).toBeGreaterThanOrEqual(3);
      expect(timeline[0].phase).toBe("setup");
      expect(timeline.at(-1)?.phase).toBe("conclusion");
      expect(timeline.every((step) => step.observationCue.length > 0)).toBe(true);
    }
  });

  it("shows carbon dioxide bubbles and limewater turbidity", () => {
    const experiment = experiments.find((item) => item.id === "co2-preparation");
    expect(experiment).toBeDefined();

    const timeline = createVisualTimeline(experiment!);

    expect(timeline.some((step) => step.scene.bubbleIntensity === "medium")).toBe(true);
    expect(timeline.some((step) => step.scene.turbidity === "cloudy")).toBe(true);
    expect(timeline.map((step) => step.observationCue).join(" ")).toContain("石灰水");
  });

  it("keeps acid-base neutralization visually distinct from gas generation", () => {
    const experiment = experiments.find((item) => item.id === "acid-base-neutralization");
    expect(experiment).toBeDefined();

    const timeline = createVisualTimeline(experiment!);

    expect(
      timeline.every(
        (step) => step.scene.bubbleIntensity !== "medium" && step.scene.bubbleIntensity !== "strong",
      ),
    ).toBe(true);
    expect(timeline.some((step) => step.scene.temperature === "warm")).toBe(true);
    expect(timeline.map((step) => step.observationCue).join(" ")).toContain("无气泡");
  });

  it("shows iron replacing copper sulfate with red copper coating and blue fade", () => {
    const experiment = experiments.find((item) => item.id === "iron-copper-sulfate");
    expect(experiment).toBeDefined();

    const timeline = createVisualTimeline(experiment!);
    const cues = timeline.map((step) => step.observationCue).join(" ");

    expect(timeline.some((step) => step.scene.solid === "copper-coating")).toBe(true);
    expect(timeline.some((step) => step.scene.colorChange === "blue-fade")).toBe(true);
    expect(cues).toMatch(/红色|铜/);
  });

  it("shows oxygen bubbles before rekindling the splint only at the test step", () => {
    const experiment = experiments.find((item) => item.id === "oxygen-preparation");
    expect(experiment).toBeDefined();

    const timeline = createVisualTimeline(experiment!);

    expect(timeline.some((step) => step.scene.bubbleIntensity === "strong")).toBe(true);
    expect(timeline.filter((step) => step.scene.flame === "rekindled").map((step) => step.phase)).toEqual(["test"]);
    expect(timeline.filter((step) => step.phase !== "test").every((step) => step.scene.flame === "none")).toBe(true);
  });
});
