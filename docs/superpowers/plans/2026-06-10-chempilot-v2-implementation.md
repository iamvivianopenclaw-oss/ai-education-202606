# ChemPilot V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade ChemPilot with a visual experiment timeline and a memory/review loop that helps students see, recall, and retain chemistry experiment knowledge.

**Architecture:** Keep the existing React + TypeScript + Vite app and add focused domain modules for visual timelines, memory cards, review scheduling, and browser storage. UI components consume those pure domain outputs so chemistry facts remain testable and separated from presentation.

**Tech Stack:** React, TypeScript, Vite, Vitest, CSS animations, browser `localStorage`.

---

## File Structure

- Create `src/domain/visualTimeline.ts`: maps an experiment to visual steps and scene state.
- Create `src/domain/visualTimeline.test.ts`: verifies each experiment has visual states and chemistry-relevant cues.
- Create `src/domain/memory.ts`: generates memory cards and review prompts from experiments and tutor feedback.
- Create `src/domain/memory.test.ts`: verifies card content, recall prompts, misconceptions, and status transitions.
- Create `src/domain/reviewStorage.ts`: load/save memory cards from `localStorage` with safe fallback behavior.
- Create `src/domain/reviewStorage.test.ts`: covers storage success, malformed data, and unavailable storage.
- Modify `src/domain/types.ts`: add `VisualTimelineStep`, `MemoryCard`, `ReviewStatus`, and related review prompt types.
- Modify `src/components/ExperimentStage.tsx`: turn the static two-tube display into a step-driven visual stage with playback controls.
- Create `src/components/MemoryCardPanel.tsx`: shows the current experiment memory card and recall practice.
- Create `src/components/ReviewPanel.tsx`: shows saved cards, today’s review tasks, and status actions.
- Modify `src/App.tsx`: connect visual step state, card generation, saved review cards, and review status updates.
- Modify `src/styles.css`: add visual stage, controls, memory card, review panel, and responsive layout styles.

---

### Task 1: Domain Types And Visual Timeline

**Files:**
- Modify: `src/domain/types.ts`
- Create: `src/domain/visualTimeline.ts`
- Create: `src/domain/visualTimeline.test.ts`

- [ ] **Step 1: Add failing visual timeline tests**

Create `src/domain/visualTimeline.test.ts`:

```ts
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

    expect(timeline.every((step) => step.scene.bubbleIntensity !== "medium" && step.scene.bubbleIntensity !== "strong")).toBe(true);
    expect(timeline.some((step) => step.scene.temperature === "warm")).toBe(true);
    expect(timeline.map((step) => step.observationCue).join(" ")).toContain("无气泡");
  });
});
```

- [ ] **Step 2: Run the failing test**

Run: `npm test -- src/domain/visualTimeline.test.ts`

Expected: fail because `src/domain/visualTimeline.ts` and timeline types do not exist.

- [ ] **Step 3: Add visual timeline types**

Append these exports to `src/domain/types.ts`:

```ts
export type VisualPhase = "setup" | "reaction" | "observation" | "test" | "conclusion";
export type BubbleIntensity = "none" | "soft" | "medium" | "strong";
export type TurbidityLevel = "clear" | "misty" | "cloudy";
export type FlameState = "none" | "ember" | "rekindled";

export interface VisualSceneState {
  vessel: "test-tube" | "beaker" | "gas-generator";
  liquidColor: string;
  secondaryLiquidColor?: string;
  bubbleIntensity: BubbleIntensity;
  turbidity: TurbidityLevel;
  solid?: "none" | "calcium-carbonate" | "iron-nail" | "copper-coating" | "manganese-dioxide";
  colorChange?: "none" | "fade" | "blue-fade" | "pink-to-clear";
  flame: FlameState;
  temperature?: "normal" | "warm";
}

export interface VisualTimelineStep {
  id: string;
  phase: VisualPhase;
  title: string;
  instruction: string;
  observationCue: string;
  knowledgeTag: string;
  scene: VisualSceneState;
}
```

- [ ] **Step 4: Implement `createVisualTimeline`**

Create `src/domain/visualTimeline.ts`:

```ts
import type { Experiment, VisualTimelineStep } from "./types";

const visualTimelines: Record<string, VisualTimelineStep[]> = {
  "co2-preparation": [
    {
      id: "co2-setup",
      phase: "setup",
      title: "准备反应装置",
      instruction: "碳酸钙与稀盐酸分别就位，导气管连接澄清石灰水。",
      observationCue: "先确认生成气体会被导入石灰水，而不是直接闻气体。",
      knowledgeTag: "气体制备",
      scene: {
        vessel: "gas-generator",
        liquidColor: "#dceff3",
        secondaryLiquidColor: "#edf6f6",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "calcium-carbonate",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    },
    {
      id: "co2-reaction",
      phase: "reaction",
      title: "加入稀盐酸",
      instruction: "稀盐酸接触碳酸钙，试管中开始产生气泡。",
      observationCue: "气泡说明有气体生成，但还不能只凭气泡断定就是 CO2。",
      knowledgeTag: "产生 CO2",
      scene: {
        vessel: "gas-generator",
        liquidColor: "#dceff3",
        secondaryLiquidColor: "#edf6f6",
        bubbleIntensity: "medium",
        turbidity: "clear",
        solid: "calcium-carbonate",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    },
    {
      id: "co2-test",
      phase: "test",
      title: "通入澄清石灰水",
      instruction: "把生成的气体通入澄清石灰水。",
      observationCue: "石灰水逐渐变浑浊，说明生成 CaCO3 沉淀。",
      knowledgeTag: "CO2 检验",
      scene: {
        vessel: "gas-generator",
        liquidColor: "#dceff3",
        secondaryLiquidColor: "#d8d8cf",
        bubbleIntensity: "soft",
        turbidity: "cloudy",
        solid: "calcium-carbonate",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    },
    {
      id: "co2-conclusion",
      phase: "conclusion",
      title: "形成实验结论",
      instruction: "把气泡和石灰水浑浊作为两个连续证据。",
      observationCue: "结论不是“有气泡”，而是“生成并检验出 CO2”。",
      knowledgeTag: "证据链",
      scene: {
        vessel: "gas-generator",
        liquidColor: "#dceff3",
        secondaryLiquidColor: "#d8d8cf",
        bubbleIntensity: "none",
        turbidity: "cloudy",
        solid: "calcium-carbonate",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    }
  ],
  "acid-base-neutralization": [
    {
      id: "neutralization-setup",
      phase: "setup",
      title: "滴入酚酞",
      instruction: "在氢氧化钠溶液中滴入酚酞。",
      observationCue: "碱性环境下酚酞呈粉红色。",
      knowledgeTag: "指示剂",
      scene: {
        vessel: "beaker",
        liquidColor: "#f7a8c4",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "none",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    },
    {
      id: "neutralization-reaction",
      phase: "reaction",
      title: "逐滴加入盐酸",
      instruction: "边滴加边振荡，观察颜色变化。",
      observationCue: "颜色逐渐变浅，不应期待大量气泡。",
      knowledgeTag: "酸碱中和",
      scene: {
        vessel: "beaker",
        liquidColor: "#f3c6d5",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "none",
        colorChange: "pink-to-clear",
        flame: "none",
        temperature: "warm"
      }
    },
    {
      id: "neutralization-observation",
      phase: "observation",
      title: "接近中性",
      instruction: "继续少量滴加，溶液颜色褪去。",
      observationCue: "无气泡也能发生反应，证据是指示剂颜色变化和放热。",
      knowledgeTag: "误区纠正",
      scene: {
        vessel: "beaker",
        liquidColor: "#f3f4f2",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "none",
        colorChange: "fade",
        flame: "none",
        temperature: "warm"
      }
    },
    {
      id: "neutralization-conclusion",
      phase: "conclusion",
      title: "形成实验结论",
      instruction: "用 H+ 与 OH- 生成水解释颜色变化。",
      observationCue: "酸碱中和的核心证据不是气体，而是酸碱性改变。",
      knowledgeTag: "离子反应",
      scene: {
        vessel: "beaker",
        liquidColor: "#f3f4f2",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "none",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    }
  ],
  "iron-copper-sulfate": [
    {
      id: "iron-setup",
      phase: "setup",
      title: "处理铁钉",
      instruction: "打磨铁钉后放入硫酸铜溶液。",
      observationCue: "洁净铁表面更容易观察生成物。",
      knowledgeTag: "金属活动性",
      scene: {
        vessel: "beaker",
        liquidColor: "#62b7d8",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "iron-nail",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    },
    {
      id: "iron-reaction",
      phase: "reaction",
      title: "发生置换反应",
      instruction: "铁与硫酸铜溶液接触。",
      observationCue: "铁表面开始出现红色物质。",
      knowledgeTag: "铜析出",
      scene: {
        vessel: "beaker",
        liquidColor: "#73bfd9",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "copper-coating",
        colorChange: "blue-fade",
        flame: "none",
        temperature: "normal"
      }
    },
    {
      id: "iron-observation",
      phase: "observation",
      title: "观察颜色变化",
      instruction: "继续观察铁表面和溶液颜色。",
      observationCue: "红色铜附着在铁表面，蓝色溶液变浅。",
      knowledgeTag: "置换证据",
      scene: {
        vessel: "beaker",
        liquidColor: "#a7d5d6",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "copper-coating",
        colorChange: "blue-fade",
        flame: "none",
        temperature: "normal"
      }
    },
    {
      id: "iron-conclusion",
      phase: "conclusion",
      title: "形成实验结论",
      instruction: "用金属活动性解释置换反应。",
      observationCue: "红色物质是铜，不是铁锈。",
      knowledgeTag: "材料联系",
      scene: {
        vessel: "beaker",
        liquidColor: "#a7d5d6",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "copper-coating",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    }
  ],
  "oxygen-preparation": [
    {
      id: "oxygen-setup",
      phase: "setup",
      title: "加入二氧化锰",
      instruction: "向过氧化氢溶液中加入少量二氧化锰。",
      observationCue: "二氧化锰是催化剂，不是生成物。",
      knowledgeTag: "催化剂",
      scene: {
        vessel: "test-tube",
        liquidColor: "#e9f3fb",
        bubbleIntensity: "soft",
        turbidity: "clear",
        solid: "manganese-dioxide",
        colorChange: "none",
        flame: "ember",
        temperature: "normal"
      }
    },
    {
      id: "oxygen-reaction",
      phase: "reaction",
      title: "快速产生气泡",
      instruction: "过氧化氢分解，试管中出现大量气泡。",
      observationCue: "气泡说明有氧气生成，但要用木条进一步检验。",
      knowledgeTag: "生成 O2",
      scene: {
        vessel: "test-tube",
        liquidColor: "#eef8ff",
        bubbleIntensity: "strong",
        turbidity: "clear",
        solid: "manganese-dioxide",
        colorChange: "none",
        flame: "ember",
        temperature: "normal"
      }
    },
    {
      id: "oxygen-test",
      phase: "test",
      title: "带火星木条复燃",
      instruction: "将带火星木条伸入集气瓶。",
      observationCue: "木条复燃说明氧气支持燃烧。",
      knowledgeTag: "O2 检验",
      scene: {
        vessel: "test-tube",
        liquidColor: "#eef8ff",
        bubbleIntensity: "medium",
        turbidity: "clear",
        solid: "manganese-dioxide",
        colorChange: "none",
        flame: "rekindled",
        temperature: "normal"
      }
    },
    {
      id: "oxygen-conclusion",
      phase: "conclusion",
      title: "形成实验结论",
      instruction: "把气泡和木条复燃连接成证据链。",
      observationCue: "关键结论是制取并检验出氧气。",
      knowledgeTag: "证据链",
      scene: {
        vessel: "test-tube",
        liquidColor: "#eef8ff",
        bubbleIntensity: "none",
        turbidity: "clear",
        solid: "manganese-dioxide",
        colorChange: "none",
        flame: "none",
        temperature: "normal"
      }
    }
  ]
};

export function createVisualTimeline(experiment: Experiment): VisualTimelineStep[] {
  return visualTimelines[experiment.id] ?? experiment.steps.map((step, index) => ({
    id: `${experiment.id}-${index}`,
    phase: index === 0 ? "setup" : index === experiment.steps.length - 1 ? "conclusion" : "observation",
    title: step.title,
    instruction: step.detail,
    observationCue: experiment.observations[index]?.label ?? experiment.conclusion,
    knowledgeTag: experiment.observations[index]?.kind ?? "实验观察",
    scene: {
      vessel: "test-tube",
      liquidColor: experiment.visual.liquidAfter,
      bubbleIntensity: "none",
      turbidity: "clear",
      solid: "none",
      colorChange: "none",
      flame: "none",
      temperature: "normal"
    }
  }));
}
```

- [ ] **Step 5: Verify Task 1**

Run: `npm test -- src/domain/visualTimeline.test.ts`

Expected: pass.

- [ ] **Step 6: Commit Task 1**

Run:

```bash
git add src/domain/types.ts src/domain/visualTimeline.ts src/domain/visualTimeline.test.ts
git commit -m "feat: add visual experiment timeline"
```

---

### Task 2: Memory Cards, Review Scheduling, And Storage

**Files:**
- Modify: `src/domain/types.ts`
- Create: `src/domain/memory.ts`
- Create: `src/domain/memory.test.ts`
- Create: `src/domain/reviewStorage.ts`
- Create: `src/domain/reviewStorage.test.ts`

- [ ] **Step 1: Add failing memory and storage tests**

Create `src/domain/memory.test.ts`:

```ts
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
```

Create `src/domain/reviewStorage.test.ts`:

```ts
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
```

- [ ] **Step 2: Run failing tests**

Run: `npm test -- src/domain/memory.test.ts src/domain/reviewStorage.test.ts`

Expected: fail because modules and types do not exist.

- [ ] **Step 3: Add memory types**

Append these exports to `src/domain/types.ts`:

```ts
export type ReviewStatus = "new" | "due" | "mastered";

export interface RecallPrompt {
  question: string;
  answer: string;
}

export interface MisconceptionPrompt {
  statement: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ShortAnswerPrompt {
  question: string;
  answer: string;
}

export interface MemoryCard {
  id: string;
  experimentId: string;
  experimentTitle: string;
  createdAt: number;
  lastReviewedAt?: number;
  status: ReviewStatus;
  keyPhenomena: string[];
  equation: string;
  principle: string;
  misconception: string;
  safety: string;
  mnemonic: string;
  recallPrompts: RecallPrompt[];
  misconceptionPrompt: MisconceptionPrompt;
  shortAnswerPrompt: ShortAnswerPrompt;
}
```

- [ ] **Step 4: Implement memory logic**

Create `src/domain/memory.ts`:

```ts
import type { ExpectationEvaluation, Experiment, MemoryCard, ReviewStatus, TutorFeedback } from "./types";

const statusPriority: Record<ReviewStatus, number> = {
  due: 0,
  new: 1,
  mastered: 2
};

export function createMemoryCard(
  experiment: Experiment,
  feedback: TutorFeedback,
  evaluation: ExpectationEvaluation,
  nowId = `${Date.now()}`
): MemoryCard {
  const keyPhenomena = experiment.observations.map((observation) => observation.label);
  const misconception = evaluation.misconceptionHits[0] ?? experiment.misconceptions[0] ?? "把现象和结论混在一起";
  const firstObservation = keyPhenomena[0] ?? "关键现象";
  const secondObservation = keyPhenomena[1] ?? experiment.conclusion;

  return {
    id: `${experiment.id}-${nowId}`,
    experimentId: experiment.id,
    experimentTitle: experiment.title,
    createdAt: Number(nowId) || Date.now(),
    status: "new",
    keyPhenomena,
    equation: feedback.equation,
    principle: feedback.principle,
    misconception,
    safety: feedback.safety,
    mnemonic: buildMnemonic(experiment, keyPhenomena),
    recallPrompts: [
      {
        question: `${experiment.title}最关键的可观察现象是什么？`,
        answer: keyPhenomena.join("；")
      },
      {
        question: `${experiment.title}的化学方程式是什么？`,
        answer: feedback.equation
      },
      {
        question: `这个实验能得出什么结论？`,
        answer: feedback.conclusion
      }
    ],
    misconceptionPrompt: {
      statement: misconception,
      isCorrect: false,
      explanation: feedback.correction
    },
    shortAnswerPrompt: {
      question: `为什么${firstObservation}能作为${experiment.title}的证据？`,
      answer: `${firstObservation}与${secondObservation}共同指向：${experiment.principle}`
    }
  };
}

export function getReviewQueue(cards: MemoryCard[]): MemoryCard[] {
  return [...cards].sort((left, right) => {
    const statusDiff = statusPriority[left.status] - statusPriority[right.status];
    if (statusDiff !== 0) return statusDiff;
    return (left.lastReviewedAt ?? left.createdAt) - (right.lastReviewedAt ?? right.createdAt);
  });
}

export function updateReviewStatus(card: MemoryCard, status: ReviewStatus, reviewedAt = Date.now()): MemoryCard {
  return {
    ...card,
    status,
    lastReviewedAt: reviewedAt
  };
}

function buildMnemonic(experiment: Experiment, phenomena: string[]) {
  if (experiment.id === "co2-preparation") return "先看气泡，再验石灰水，浑浊才说明 CO2。";
  if (experiment.id === "acid-base-neutralization") return "中和不靠冒泡，颜色和酸碱性才是证据。";
  if (experiment.id === "iron-copper-sulfate") return "铁换铜，红色出，蓝色浅，活动性强弱见。";
  if (experiment.id === "oxygen-preparation") return "气泡先出现，木条再复燃，氧气检验要成链。";
  return `记住证据链：${phenomena.join(" -> ")}。`;
}
```

- [ ] **Step 5: Implement safe storage**

Create `src/domain/reviewStorage.ts`:

```ts
import type { MemoryCard } from "./types";

const STORAGE_KEY = "chempilot.memoryCards.v1";

export function loadMemoryCards(storage: Storage | undefined): MemoryCard[] {
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isMemoryCard) : [];
  } catch {
    return [];
  }
}

export function saveMemoryCards(storage: Storage | undefined, cards: MemoryCard[]) {
  if (!storage) return;

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(cards.slice(0, 12)));
  } catch {
    // In private browsing or restricted environments, the app still works without persistence.
  }
}

function isMemoryCard(value: unknown): value is MemoryCard {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<MemoryCard>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.experimentId === "string" &&
    typeof candidate.experimentTitle === "string" &&
    Array.isArray(candidate.keyPhenomena) &&
    (candidate.status === "new" || candidate.status === "due" || candidate.status === "mastered")
  );
}
```

- [ ] **Step 6: Verify Task 2**

Run: `npm test -- src/domain/memory.test.ts src/domain/reviewStorage.test.ts`

Expected: pass.

- [ ] **Step 7: Commit Task 2**

Run:

```bash
git add src/domain/types.ts src/domain/memory.ts src/domain/memory.test.ts src/domain/reviewStorage.ts src/domain/reviewStorage.test.ts
git commit -m "feat: add experiment memory review loop"
```

---

### Task 3: Visual Stage UI

**Files:**
- Modify: `src/components/ExperimentStage.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Replace ExperimentStage with a controlled timeline UI**

Modify `src/components/ExperimentStage.tsx`:

```tsx
import type { CSSProperties } from "react";
import type { Experiment, VisualTimelineStep } from "../domain/types";

interface ExperimentStageProps {
  experiment: Experiment;
  timeline: VisualTimelineStep[];
  activeStepIndex: number;
  isPlaying: boolean;
  onStepSelect: (index: number) => void;
  onTogglePlay: () => void;
  onReplay: () => void;
}

export function ExperimentStage({
  experiment,
  timeline,
  activeStepIndex,
  isPlaying,
  onStepSelect,
  onTogglePlay,
  onReplay
}: ExperimentStageProps) {
  const activeStep = timeline[activeStepIndex] ?? timeline[0];

  return (
    <section className="panel stage-panel">
      <div className="panel-heading stage-heading">
        <div>
          <p className="eyebrow">视觉化实验</p>
          <h2>{experiment.title}</h2>
        </div>
        <div className="stage-controls" aria-label="实验播放控制">
          <button type="button" className="icon-button" onClick={onTogglePlay} aria-label={isPlaying ? "暂停实验演示" : "播放实验演示"}>
            {isPlaying ? "暂停" : "播放"}
          </button>
          <button type="button" className="icon-button" onClick={onReplay} aria-label="重播实验演示">
            重播
          </button>
        </div>
      </div>

      <div
        className={`lab-visual enhanced ${activeStep.scene.vessel} bubbles-${activeStep.scene.bubbleIntensity} turbidity-${activeStep.scene.turbidity} flame-${activeStep.scene.flame}`}
        style={
          {
            "--accent": experiment.visual.accent,
            "--liquid": activeStep.scene.liquidColor,
            "--secondary-liquid": activeStep.scene.secondaryLiquidColor ?? experiment.visual.liquidAfter
          } as CSSProperties
        }
      >
        <div className="apparatus">
          <div className="vessel">
            <div className="liquid-layer" />
            <div className={`solid-marker ${activeStep.scene.solid ?? "none"}`} />
            <div className="bubble-field">
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="connector" />
          <div className="collector">
            <div className="collector-liquid" />
            <span>{experiment.visual.beakerLabel}</span>
          </div>
          <div className="flame-stick" />
        </div>
        <div className="observation-card">
          <strong>{activeStep.observationCue}</strong>
          <span>{activeStep.knowledgeTag}</span>
        </div>
      </div>

      <div className="timeline" aria-label="实验步骤时间线">
        {timeline.map((step, index) => (
          <button
            type="button"
            key={step.id}
            className={index === activeStepIndex ? "active" : ""}
            onClick={() => onStepSelect(index)}
          >
            <span>{index + 1}</span>
            <strong>{step.title}</strong>
            <small>{step.instruction}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add stage styles**

Modify `src/styles.css` by replacing the old `.lab-visual`, `.tube`, `.liquid`, `.bubble`, `.arrow`, and `.tube-label` block with visual stage styles that define `.stage-heading`, `.stage-controls`, `.icon-button`, `.lab-visual.enhanced`, `.apparatus`, `.vessel`, `.liquid-layer`, `.bubble-field`, `.solid-marker`, `.connector`, `.collector`, `.collector-liquid`, `.flame-stick`, `.observation-card`, and `.timeline`.

The CSS must:

- keep `.lab-visual.enhanced` at `min-height: 320px` on desktop;
- show bubble intensity through opacity and animation speed;
- show turbidity by changing collector liquid opacity/color;
- show `flame-rekindled` with a visible orange glow;
- keep `.timeline` buttons fixed enough that text wraps without resizing the stage.

- [ ] **Step 3: Verify stage compiles after App integration**

Do not run tests yet because `App.tsx` still uses the old `ExperimentStage` props. Continue to Task 4 before verification.

- [ ] **Step 4: Commit after Task 4 integration**

Do not commit this task alone unless `npm run build` passes.

---

### Task 4: Memory/Review UI And App Integration

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/MemoryCardPanel.tsx`
- Create: `src/components/ReviewPanel.tsx`
- Modify: `src/styles.css`
- Modify: `README.md`

- [ ] **Step 1: Add MemoryCardPanel**

Create `src/components/MemoryCardPanel.tsx`:

```tsx
import { useState } from "react";
import type { MemoryCard } from "../domain/types";

interface MemoryCardPanelProps {
  card?: MemoryCard;
}

export function MemoryCardPanel({ card }: MemoryCardPanelProps) {
  const [revealedPromptIndex, setRevealedPromptIndex] = useState<number | null>(null);
  const [showMisconception, setShowMisconception] = useState(false);
  const [showShortAnswer, setShowShortAnswer] = useState(false);

  if (!card) {
    return (
      <section className="panel memory-panel">
        <div className="panel-heading">
          <p className="eyebrow">记忆卡片</p>
          <h2>生成反馈后自动沉淀知识点</h2>
        </div>
        <p className="muted">完成一次实验反馈后，这里会生成现象、方程式、原理、易错点和安全提醒。</p>
      </section>
    );
  }

  return (
    <section className="panel memory-panel">
      <div className="panel-heading">
        <p className="eyebrow">记忆卡片</p>
        <h2>{card.experimentTitle}</h2>
      </div>
      <div className="memory-grid">
        <article>
          <span>关键现象</span>
          <strong>{card.keyPhenomena.join("；")}</strong>
        </article>
        <article>
          <span>方程式</span>
          <strong className="equation">{card.equation}</strong>
        </article>
        <article>
          <span>一句话抓手</span>
          <strong>{card.mnemonic}</strong>
        </article>
      </div>
      <div className="practice-list">
        {card.recallPrompts.map((prompt, index) => (
          <button type="button" key={prompt.question} onClick={() => setRevealedPromptIndex(revealedPromptIndex === index ? null : index)}>
            <strong>{prompt.question}</strong>
            {revealedPromptIndex === index && <span>{prompt.answer}</span>}
          </button>
        ))}
        <button type="button" onClick={() => setShowMisconception((value) => !value)}>
          <strong>易错判断：{card.misconceptionPrompt.statement}</strong>
          {showMisconception && <span>{card.misconceptionPrompt.isCorrect ? "正确。" : `错误。${card.misconceptionPrompt.explanation}`}</span>}
        </button>
        <button type="button" onClick={() => setShowShortAnswer((value) => !value)}>
          <strong>短问答：{card.shortAnswerPrompt.question}</strong>
          {showShortAnswer && <span>{card.shortAnswerPrompt.answer}</span>}
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add ReviewPanel**

Create `src/components/ReviewPanel.tsx`:

```tsx
import type { MemoryCard, ReviewStatus } from "../domain/types";

interface ReviewPanelProps {
  cards: MemoryCard[];
  onStatusChange: (cardId: string, status: ReviewStatus) => void;
}

const statusLabels: Record<ReviewStatus, string> = {
  new: "新学",
  due: "需复习",
  mastered: "已掌握"
};

export function ReviewPanel({ cards, onStatusChange }: ReviewPanelProps) {
  return (
    <section className="panel review-panel">
      <div className="panel-heading">
        <p className="eyebrow">今日复习</p>
        <h2>防遗忘知识点</h2>
      </div>
      {cards.length === 0 ? (
        <p className="muted">生成记忆卡片后，系统会把新学和需复习的实验排在前面。</p>
      ) : (
        <ul className="review-list">
          {cards.slice(0, 4).map((card) => (
            <li key={card.id}>
              <div>
                <strong>{card.experimentTitle}</strong>
                <span>{statusLabels[card.status]} · {card.mnemonic}</span>
              </div>
              <div className="review-actions">
                <button type="button" onClick={() => onStatusChange(card.id, "mastered")}>记住了</button>
                <button type="button" onClick={() => onStatusChange(card.id, "due")}>还不熟</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Integrate App state**

Modify `src/App.tsx` to:

- import `useEffect`;
- import `MemoryCardPanel`, `ReviewPanel`, `createVisualTimeline`, `createMemoryCard`, `getReviewQueue`, `updateReviewStatus`, `loadMemoryCards`, and `saveMemoryCards`;
- add `activeStepIndex`, `isPlaying`, `currentMemoryCard`, and `memoryCards` state;
- derive `timeline` with `useMemo`;
- reset `activeStepIndex` when `matchedExperiment.id` changes;
- auto-advance while `isPlaying` is true;
- load cards from localStorage on mount;
- save cards to localStorage when cards change;
- in `runFeedback`, create a card and add it to `memoryCards`;
- pass timeline props to `ExperimentStage`;
- render `MemoryCardPanel` and `ReviewPanel`.

The integration must preserve the existing experiment selection, tutor feedback, notebook, and project feedback flows.

- [ ] **Step 4: Add memory/review styles**

Modify `src/styles.css` to style:

- `.memory-panel`, `.memory-grid`, `.practice-list`;
- `.review-panel`, `.review-list`, `.review-actions`;
- responsive layout so these sections fit under the right column without text overflow.

- [ ] **Step 5: Update README**

Modify `README.md` to add V2 bullets:

```md
- V2 增加视觉化实验时间线，用可播放步骤呈现气泡、浑浊、颜色变化、铜析出和木条复燃。
- V2 增加记忆卡片和今日复习，帮助学生回忆现象、方程式、核心原理、易错点和安全提醒。
```

- [ ] **Step 6: Verify all tests and build**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 7: Commit Task 3 and Task 4**

Run:

```bash
git add src/App.tsx src/components/ExperimentStage.tsx src/components/MemoryCardPanel.tsx src/components/ReviewPanel.tsx src/styles.css README.md
git commit -m "feat: add visual lab stage and memory review UI"
```

---

### Task 5: Browser Verification And Polish

**Files:**
- Modify only files needed to fix issues found during verification.

- [ ] **Step 1: Start or reuse dev server**

Run:

```bash
npm run dev -- --port 5273 --strictPort
```

Expected: Vite serves `http://localhost:5273/`.

- [ ] **Step 2: Verify desktop workflow**

Open `http://localhost:5273/` and verify:

- experiment stage shows visual apparatus and timeline;
- play, pause, replay, and step buttons work;
- CO2 experiment shows gas and limewater turbidity;
- acid-base neutralization clearly communicates no gas and color fade;
- generating feedback creates a memory card;
- today’s review shows the card and status buttons work.

- [ ] **Step 3: Verify mobile layout**

Use a mobile viewport around `390x844` and verify:

- no horizontal scroll;
- timeline text wraps cleanly;
- memory card answer reveal does not overlap other content;
- review actions remain tappable.

- [ ] **Step 4: Fix any browser issues**

If issues appear, fix them in the smallest relevant file. For style-only issues, modify `src/styles.css`; for state issues, modify `src/App.tsx`; for component issues, modify the component that owns the broken UI.

- [ ] **Step 5: Final verification**

Run:

```bash
npm test
npm run build
```

Expected: all tests pass and production build succeeds.

- [ ] **Step 6: Commit verification fixes**

If fixes were needed, run:

```bash
git add src/App.tsx src/components/ExperimentStage.tsx src/components/MemoryCardPanel.tsx src/components/ReviewPanel.tsx src/styles.css README.md src/domain/types.ts src/domain/visualTimeline.ts src/domain/memory.ts src/domain/reviewStorage.ts
git commit -m "fix: polish ChemPilot V2 experience"
```

If no fixes were needed, do not create an empty commit.
