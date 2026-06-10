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
