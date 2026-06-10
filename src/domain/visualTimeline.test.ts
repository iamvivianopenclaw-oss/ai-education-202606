import { describe, expect, it } from "vitest";
import { experiments } from "./experiments";
import { createVisualTimeline } from "./visualTimeline";

describe("createVisualTimeline", () => {
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
});
