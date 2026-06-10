import { describe, expect, it } from "vitest";
import { findExperimentByInput, getExperimentById } from "./matcher";

describe("matcher", () => {
  it("finds carbon dioxide experiment from classroom language", () => {
    const experiment = findExperimentByInput("碳酸钙和稀盐酸反应后通入澄清石灰水");
    expect(experiment?.id).toBe("co2-preparation");
  });

  it("finds neutralization from acid-base keywords", () => {
    const experiment = findExperimentByInput("盐酸和氢氧化钠混合会不会产生气泡");
    expect(experiment?.id).toBe("acid-base-neutralization");
  });

  it("returns undefined for unsupported experiments", () => {
    expect(findExperimentByInput("硫在氧气中燃烧")).toBeUndefined();
  });

  it.each([
    ["二氧化碳", "co2-preparation"],
    ["酚酞", "acid-base-neutralization"],
    ["氧气", "oxygen-preparation"],
    ["硫酸铜", "iron-copper-sulfate"]
  ])("matches strong canonical cue %s", (input, expectedId) => {
    expect(findExperimentByInput(input)?.id).toBe(expectedId);
  });

  it("gets experiment by exact id", () => {
    expect(getExperimentById("oxygen-preparation")?.title).toBe("过氧化氢制取氧气");
  });
});
