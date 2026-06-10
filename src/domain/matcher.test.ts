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

  it("gets experiment by exact id", () => {
    expect(getExperimentById("oxygen-preparation")?.title).toBe("过氧化氢制取氧气");
  });
});
