import { describe, expect, it, vi } from "vitest";
import type { MemoryCard } from "./types";
import { loadMemoryCards, saveMemoryCards } from "./reviewStorage";

const card: MemoryCard = {
  id: "card-1",
  experimentId: "co2-preparation",
  experimentTitle: "二氧化碳的制取与检验",
  createdAt: 1000,
  status: "new",
  keyPhenomena: ["产生气泡"],
  equation: "CaCO3 + 2HCl -> CaCl2 + H2O + CO2↑",
  principle: "碳酸盐遇酸生成二氧化碳。",
  misconception: "只要有气泡就一定是二氧化碳",
  safety: "稀盐酸具有腐蚀性。",
  mnemonic: "先看气泡，再验石灰水。",
  recallPrompts: [{ question: "现象是什么？", answer: "产生气泡，石灰水变浑浊。" }],
  misconceptionPrompt: { statement: "只要有气泡就是 CO2。", isCorrect: false, explanation: "还需要检验。" },
  shortAnswerPrompt: { question: "为什么变浑浊？", answer: "生成碳酸钙沉淀。" }
};

function loadFromStoredValue(value: unknown) {
  const storage = {
    getItem: vi.fn(() => JSON.stringify(value)),
    setItem: vi.fn()
  } as unknown as Storage;

  return loadMemoryCards(storage);
}

function loadFromRawStorage(raw: string) {
  const storage = {
    getItem: vi.fn(() => raw),
    setItem: vi.fn()
  } as unknown as Storage;

  return loadMemoryCards(storage);
}

describe("reviewStorage", () => {
  it("saves and loads memory cards", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => store.set(key, value))
    } as unknown as Storage;

    saveMemoryCards(storage, [card]);

    expect(loadMemoryCards(storage)).toEqual([card]);
  });

  it("returns an empty list for malformed storage", () => {
    const storage = {
      getItem: vi.fn(() => "{bad json"),
      setItem: vi.fn()
    } as unknown as Storage;

    expect(loadMemoryCards(storage)).toEqual([]);
  });

  it("saves at most twelve memory cards", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => store.set(key, value))
    } as unknown as Storage;
    const cards = Array.from({ length: 13 }, (_, index) => ({ ...card, id: `card-${index}` }));

    saveMemoryCards(storage, cards);

    expect(loadMemoryCards(storage)).toHaveLength(12);
  });

  it.each([
    ["non-string keyPhenomena item", { ...card, id: "bad-key-phenomena", keyPhenomena: ["产生气泡", 12] }],
    ["null recall prompt item", { ...card, id: "bad-recall-null", recallPrompts: [null] }],
    ["recall prompt missing answer", { ...card, id: "bad-recall-answer", recallPrompts: [{ question: "现象是什么？" }] }],
    ["null createdAt from non-finite JSON value", { ...card, id: "bad-created-at-null", createdAt: Infinity }],
    ["non-number createdAt", { ...card, id: "bad-created-at-string", createdAt: "1000" }],
    ["string lastReviewedAt", { ...card, id: "bad-reviewed-at-string", lastReviewedAt: "3000" }],
    ["null lastReviewedAt", { ...card, id: "bad-reviewed-at-null", lastReviewedAt: null }],
    ["null lastReviewedAt from non-finite JSON value", { ...card, id: "bad-reviewed-at-infinity", lastReviewedAt: Infinity }]
  ])("filters out stored cards with %s", (_caseName, malformedCard) => {
    expect(loadFromStoredValue([card, malformedCard])).toEqual([card]);
  });

  it("filters out cards with non-finite timestamps from raw storage", () => {
    const validRaw = JSON.stringify(card);
    const nonFiniteCreatedAt = JSON.stringify({ ...card, id: "bad-created-at-finite" }).replace(
      '"createdAt":1000',
      '"createdAt":1e309'
    );
    const nonFiniteLastReviewedAt = JSON.stringify({
      ...card,
      id: "bad-reviewed-at-finite",
      lastReviewedAt: 3000
    }).replace('"lastReviewedAt":3000', '"lastReviewedAt":1e309');

    expect(loadFromRawStorage(`[${validRaw},${nonFiniteCreatedAt},${nonFiniteLastReviewedAt}]`)).toEqual([card]);
  });

  it("does not throw when saving is unavailable", () => {
    const storage = {
      getItem: vi.fn(),
      setItem: vi.fn(() => {
        throw new Error("blocked");
      })
    } as unknown as Storage;

    expect(() => saveMemoryCards(storage, [card])).not.toThrow();
  });
});
