# ChemPilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first runnable ChemPilot student-side chemistry experiment intelligent agent prototype.

**Architecture:** A Vite + React + TypeScript single-page app will run fully in the browser. Chemistry facts come from a deterministic experiment rule library, while the local tutor layer turns those facts and the student's expectation into readable feedback, correction, safety notes, classroom follow-up questions, and learning-reflection suggestions. A lightweight local feedback loop shows how the project itself can iterate with classroom use.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS modules or plain CSS, browser local state.

---

## File Structure

Create the following files:

- `package.json`: npm scripts and dependencies.
- `index.html`: Vite HTML entry.
- `tsconfig.json`: TypeScript compiler configuration.
- `vite.config.ts`: Vite, React, and Vitest configuration.
- `src/main.tsx`: React app bootstrap.
- `src/App.tsx`: application state composition and page layout.
- `src/styles.css`: global visual system and component styles.
- `src/domain/types.ts`: shared domain types for experiments, observations, expectations, and tutor feedback.
- `src/domain/experiments.ts`: four experiment definitions and keyword metadata.
- `src/domain/matcher.ts`: maps free-text input or selected ids to experiment records.
- `src/domain/evaluator.ts`: compares student expectation text against expected observations and common misconceptions.
- `src/domain/tutor.ts`: generates local intelligent-agent feedback from experiment and evaluation results.
- `src/domain/reflection.ts`: generates student learning insights and next-experiment suggestions.
- `src/domain/experiments.test.ts`: verifies experiment library completeness and core chemistry facts.
- `src/domain/matcher.test.ts`: verifies experiment matching behavior.
- `src/domain/evaluator.test.ts`: verifies correct, partial, and mistaken expectation evaluation.
- `src/domain/tutor.test.ts`: verifies feedback contains correction, conclusion, safety, and question.
- `src/domain/reflection.test.ts`: verifies learning reflection supports student iteration.
- `src/components/ExperimentSelector.tsx`: experiment cards and selection.
- `src/components/StudentInputPanel.tsx`: free-text experiment input and expected phenomenon input.
- `src/components/ExperimentStage.tsx`: visual experiment process and phenomenon rendering.
- `src/components/TutorPanel.tsx`: intelligent-agent feedback rendering.
- `src/components/LabNotebook.tsx`: local session history.
- `src/components/ProjectFeedbackPanel.tsx`: local project feedback and iteration display.
- `src/test/setup.ts`: Testing Library setup.

Do not add authentication, backend services, remote databases, 3D/VR, or real LLM API integration in this first implementation.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create the npm project manifest**

Create `package.json`:

```json
{
  "name": "chempilot",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.6.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create TypeScript and Vite config files**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true
  }
});
```

- [ ] **Step 3: Create the HTML and React entry**

Create `index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ChemPilot 智能化学实验数字平台</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Create a temporary App shell**

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <section className="intro-panel">
        <p className="eyebrow">ChemPilot</p>
        <h1>智能化学实验数字平台</h1>
        <p>面向中学课堂实验的学生端 AI 实验智能体原型。</p>
      </section>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  font-family: Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  color: #16211f;
  background: #f4f7f5;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
textarea,
select {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 24px;
}

.intro-panel {
  max-width: 960px;
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 8px;
  color: #236f63;
  font-weight: 700;
}
```

- [ ] **Step 5: Install dependencies**

Run:

```bash
npm install
```

Expected: npm creates `package-lock.json` and exits successfully.

- [ ] **Step 6: Verify scaffold builds**

Run:

```bash
npm run build
npm test
```

Expected: `npm run build` succeeds. `npm test` succeeds with no test files or a no-test pass depending on Vitest behavior. If Vitest fails because no tests exist, add the domain tests in Task 2 before treating test status as meaningful.

- [ ] **Step 7: Commit scaffold**

```bash
git add package.json package-lock.json index.html tsconfig.json vite.config.ts src/main.tsx src/App.tsx src/styles.css src/test/setup.ts
git commit -m "feat: scaffold ChemPilot app"
```

---

### Task 2: Experiment Rule Library

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/experiments.ts`
- Create: `src/domain/experiments.test.ts`

- [ ] **Step 1: Write failing tests for experiment completeness**

Create `src/domain/experiments.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/domain/experiments.test.ts
```

Expected: FAIL because `src/domain/experiments.ts` does not exist.

- [ ] **Step 3: Create domain types**

Create `src/domain/types.ts`:

```ts
export type ObservationKind = "gas" | "color" | "precipitate" | "heat" | "flame" | "solid";

export interface Observation {
  kind: ObservationKind;
  label: string;
  detail: string;
  keywords: string[];
}

export interface ExperimentStep {
  title: string;
  detail: string;
}

export interface Experiment {
  id: string;
  title: string;
  subtitle: string;
  classroomFit: string;
  reactants: string[];
  condition: string;
  keywords: string[];
  steps: ExperimentStep[];
  observations: Observation[];
  equation: string;
  principle: string;
  conclusion: string;
  safetyNotes: string[];
  misconceptions: string[];
  followUpQuestions: string[];
  visual: {
    beakerLabel: string;
    liquidBefore: string;
    liquidAfter: string;
    accent: string;
  };
}

export interface ExpectationEvaluation {
  status: "accurate" | "partial" | "misconception" | "empty";
  matchedObservations: string[];
  missingObservations: string[];
  misconceptionHits: string[];
  message: string;
}

export interface TutorFeedback {
  headline: string;
  correction: string;
  observationSummary: string;
  equation: string;
  principle: string;
  conclusion: string;
  safety: string;
  followUpQuestion: string;
}

export interface LearningReflection {
  insight: string;
  nextStep: string;
  skillTags: string[];
}

export interface ProjectFeedback {
  id: string;
  clarity: "清楚" | "一般" | "需要改进";
  suggestion: string;
}
```

- [ ] **Step 4: Create the experiment data**

Create `src/domain/experiments.ts`:

```ts
import type { Experiment } from "./types";

export const experiments: Experiment[] = [
  {
    id: "co2-preparation",
    title: "二氧化碳的制取与检验",
    subtitle: "碳酸盐与稀盐酸反应，检验 CO2",
    classroomFit: "中学课堂中气体制备与检验的代表实验，现象明显、展示性强。",
    reactants: ["碳酸钙", "稀盐酸", "澄清石灰水"],
    condition: "常温，将生成气体通入澄清石灰水",
    keywords: ["二氧化碳", "co2", "碳酸钙", "碳酸钠", "稀盐酸", "澄清石灰水", "气泡", "浑浊"],
    steps: [
      { title: "加入试剂", detail: "向试管中的碳酸钙加入适量稀盐酸。" },
      { title: "观察气体", detail: "试管中迅速产生气泡，说明有气体生成。" },
      { title: "检验气体", detail: "将气体通入澄清石灰水，石灰水变浑浊。" }
    ],
    observations: [
      { kind: "gas", label: "产生气泡", detail: "碳酸盐与酸反应生成二氧化碳气体。", keywords: ["气泡", "冒泡", "气体", "二氧化碳"] },
      { kind: "precipitate", label: "石灰水变浑浊", detail: "二氧化碳与氢氧化钙反应生成碳酸钙沉淀。", keywords: ["浑浊", "沉淀", "石灰水", "白色"] }
    ],
    equation: "CaCO3 + 2HCl -> CaCl2 + H2O + CO2↑；CO2 + Ca(OH)2 -> CaCO3↓ + H2O",
    principle: "碳酸盐遇酸生成二氧化碳，二氧化碳能使澄清石灰水变浑浊。",
    conclusion: "该实验可以用于制取并检验二氧化碳，关键证据是气泡生成和澄清石灰水变浑浊。",
    safetyNotes: ["稀盐酸具有腐蚀性，取用时避免接触皮肤和眼睛。", "导气管不要伸入液面过深，避免倒吸。"],
    misconceptions: ["只要有气泡就一定是二氧化碳", "石灰水变浑浊是因为盐酸挥发"],
    followUpQuestions: ["如果把碳酸钙换成碳酸钠，现象和结论会发生什么变化？"],
    visual: { beakerLabel: "石灰水", liquidBefore: "#dceff3", liquidAfter: "#d8d8cf", accent: "#2f8f83" }
  },
  {
    id: "acid-base-neutralization",
    title: "盐酸与氢氧化钠中和",
    subtitle: "酸碱中和与指示剂变化",
    classroomFit: "适合展示酸碱反应不一定有气泡，突出纠错价值。",
    reactants: ["稀盐酸", "氢氧化钠溶液", "酚酞"],
    condition: "常温，滴加酚酞观察酸碱性变化",
    keywords: ["盐酸", "氢氧化钠", "naoh", "hcl", "中和", "酸碱", "酚酞", "放热"],
    steps: [
      { title: "加入指示剂", detail: "在氢氧化钠溶液中滴入酚酞，溶液呈红色或粉红色。" },
      { title: "滴加盐酸", detail: "逐滴加入稀盐酸并振荡，颜色逐渐变浅直至褪色。" },
      { title: "判断中和", detail: "颜色变化说明溶液酸碱性改变，反应本身通常不产生气泡。" }
    ],
    observations: [
      { kind: "color", label: "酚酞颜色变化", detail: "碱性溶液中的酚酞呈红色，接近中性或酸性时褪色。", keywords: ["红色", "粉红", "褪色", "变色", "酚酞"] },
      { kind: "heat", label: "可能轻微放热", detail: "酸碱中和释放热量，课堂中可用温度变化辅助观察。", keywords: ["放热", "升温", "热"] }
    ],
    equation: "HCl + NaOH -> NaCl + H2O",
    principle: "酸中的 H+ 与碱中的 OH- 结合生成水，反应生成盐和水。",
    conclusion: "盐酸与氢氧化钠发生中和反应，典型证据是指示剂颜色变化，而不是产生气泡。",
    safetyNotes: ["稀盐酸和氢氧化钠都不能直接接触皮肤。", "滴加酸或碱时应少量、多次、边加边振荡。"],
    misconceptions: ["酸碱反应都会产生气泡", "没有气泡就说明没有发生反应"],
    followUpQuestions: ["为什么这个实验通常没有气泡，却仍然能证明发生了化学反应？"],
    visual: { beakerLabel: "酚酞溶液", liquidBefore: "#f7a8c4", liquidAfter: "#f3f4f2", accent: "#cf4e7c" }
  },
  {
    id: "iron-copper-sulfate",
    title: "铁与硫酸铜反应",
    subtitle: "金属活动性与置换反应",
    classroomFit: "与材料和应用化学背景自然衔接，颜色和固体变化清楚。",
    reactants: ["铁钉", "硫酸铜溶液"],
    condition: "常温，将洁净铁钉放入硫酸铜溶液",
    keywords: ["铁", "硫酸铜", "置换", "金属活动性", "铜", "蓝色", "红色"],
    steps: [
      { title: "处理铁钉", detail: "用砂纸打磨铁钉表面，去除氧化层。" },
      { title: "浸入溶液", detail: "将铁钉放入硫酸铜溶液中。" },
      { title: "观察变化", detail: "铁钉表面析出红色物质，蓝色溶液逐渐变浅。" }
    ],
    observations: [
      { kind: "solid", label: "红色铜析出", detail: "铁将铜离子还原为单质铜，附着在铁表面。", keywords: ["红色", "铜", "析出", "附着"] },
      { kind: "color", label: "蓝色变浅", detail: "溶液中的铜离子减少，蓝色逐渐变浅。", keywords: ["蓝色", "变浅", "颜色"] }
    ],
    equation: "Fe + CuSO4 -> FeSO4 + Cu",
    principle: "铁的金属活动性强于铜，能把铜从硫酸铜溶液中置换出来。",
    conclusion: "该实验说明铁比铜活泼，能发生置换反应并生成单质铜。",
    safetyNotes: ["硫酸铜溶液不可入口，实验后应按要求回收。", "打磨铁钉时注意不要划伤手。"],
    misconceptions: ["红色物质是铁锈", "蓝色变浅是因为水把溶液稀释了"],
    followUpQuestions: ["如果把铁换成铜片放入硫酸亚铁溶液，会发生类似现象吗？为什么？"],
    visual: { beakerLabel: "CuSO4 溶液", liquidBefore: "#62b7d8", liquidAfter: "#a7d5d6", accent: "#b64f36" }
  },
  {
    id: "oxygen-preparation",
    title: "过氧化氢制取氧气",
    subtitle: "催化分解与氧气检验",
    classroomFit: "气泡和带火星木条复燃现象直观，适合课堂展示。",
    reactants: ["过氧化氢溶液", "二氧化锰", "带火星木条"],
    condition: "常温，二氧化锰作催化剂",
    keywords: ["过氧化氢", "双氧水", "二氧化锰", "氧气", "带火星木条", "复燃", "催化剂"],
    steps: [
      { title: "加入催化剂", detail: "向过氧化氢溶液中加入少量二氧化锰。" },
      { title: "观察气泡", detail: "溶液中快速产生大量气泡。" },
      { title: "检验氧气", detail: "将带火星木条伸入集气瓶，木条复燃。" }
    ],
    observations: [
      { kind: "gas", label: "大量气泡", detail: "过氧化氢分解生成氧气。", keywords: ["气泡", "氧气", "冒泡", "气体"] },
      { kind: "flame", label: "带火星木条复燃", detail: "氧气支持燃烧，使带火星木条复燃。", keywords: ["复燃", "木条", "火星", "燃烧"] }
    ],
    equation: "2H2O2 -> 2H2O + O2↑",
    principle: "二氧化锰作催化剂，加快过氧化氢分解，但反应前后质量和化学性质基本不变。",
    conclusion: "该实验可用于制取并检验氧气，关键证据是气泡生成和带火星木条复燃。",
    safetyNotes: ["过氧化氢溶液不可接触眼睛。", "检验氧气时不要让燃烧物靠近易燃物。"],
    misconceptions: ["二氧化锰被反应消耗掉了", "能让木条复燃的气体是二氧化碳"],
    followUpQuestions: ["为什么二氧化锰能加快反应，却不写在化学方程式的生成物里？"],
    visual: { beakerLabel: "H2O2 溶液", liquidBefore: "#e9f3fb", liquidAfter: "#eef8ff", accent: "#f0a13a" }
  }
];
```

- [ ] **Step 5: Run tests to verify pass**

Run:

```bash
npm test -- src/domain/experiments.test.ts
```

Expected: PASS for all three tests.

- [ ] **Step 6: Commit experiment library**

```bash
git add src/domain/types.ts src/domain/experiments.ts src/domain/experiments.test.ts
git commit -m "feat: add chemistry experiment rule library"
```

---

### Task 3: Matching and Expectation Evaluation

**Files:**
- Create: `src/domain/matcher.ts`
- Create: `src/domain/evaluator.ts`
- Create: `src/domain/matcher.test.ts`
- Create: `src/domain/evaluator.test.ts`

- [ ] **Step 1: Write matcher tests**

Create `src/domain/matcher.test.ts`:

```ts
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
```

- [ ] **Step 2: Write evaluator tests**

Create `src/domain/evaluator.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { experiments } from "./experiments";
import { evaluateExpectation } from "./evaluator";

const neutralization = experiments.find((experiment) => experiment.id === "acid-base-neutralization")!;
const co2 = experiments.find((experiment) => experiment.id === "co2-preparation")!;

describe("evaluateExpectation", () => {
  it("flags the acid-base gas misconception", () => {
    const result = evaluateExpectation(neutralization, "我觉得盐酸和氢氧化钠会产生很多气泡");

    expect(result.status).toBe("misconception");
    expect(result.misconceptionHits).toContain("酸碱反应都会产生气泡");
  });

  it("recognizes a complete carbon dioxide expectation", () => {
    const result = evaluateExpectation(co2, "会产生气泡，并且澄清石灰水变浑浊");

    expect(result.status).toBe("accurate");
    expect(result.matchedObservations).toEqual(["产生气泡", "石灰水变浑浊"]);
  });

  it("recognizes partial expectation", () => {
    const result = evaluateExpectation(co2, "应该会冒泡");

    expect(result.status).toBe("partial");
    expect(result.missingObservations).toEqual(["石灰水变浑浊"]);
  });

  it("handles empty expectation", () => {
    const result = evaluateExpectation(co2, "   ");

    expect(result.status).toBe("empty");
    expect(result.message).toContain("先写下你的预测");
  });
});
```

- [ ] **Step 3: Run tests to verify failure**

Run:

```bash
npm test -- src/domain/matcher.test.ts src/domain/evaluator.test.ts
```

Expected: FAIL because matcher and evaluator modules do not exist.

- [ ] **Step 4: Implement matcher**

Create `src/domain/matcher.ts`:

```ts
import { experiments } from "./experiments";
import type { Experiment } from "./types";

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

export function getExperimentById(id: string): Experiment | undefined {
  return experiments.find((experiment) => experiment.id === id);
}

export function findExperimentByInput(input: string): Experiment | undefined {
  const normalized = normalize(input);

  if (!normalized) {
    return undefined;
  }

  const scored = experiments
    .map((experiment) => ({
      experiment,
      score: experiment.keywords.reduce((total, keyword) => {
        return normalized.includes(keyword.toLowerCase()) ? total + 1 : total;
      }, 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.experiment;
}
```

- [ ] **Step 5: Implement evaluator**

Create `src/domain/evaluator.ts`:

```ts
import type { Experiment, ExpectationEvaluation } from "./types";

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

function includesAny(input: string, keywords: string[]): boolean {
  return keywords.some((keyword) => input.includes(keyword.toLowerCase()));
}

export function evaluateExpectation(experiment: Experiment, expectation: string): ExpectationEvaluation {
  const normalized = normalize(expectation);

  if (!normalized) {
    return {
      status: "empty",
      matchedObservations: [],
      missingObservations: experiment.observations.map((item) => item.label),
      misconceptionHits: [],
      message: "先写下你的预测，再和标准实验现象进行比较。"
    };
  }

  const matchedObservations = experiment.observations
    .filter((observation) => includesAny(normalized, observation.keywords))
    .map((observation) => observation.label);

  const missingObservations = experiment.observations
    .filter((observation) => !matchedObservations.includes(observation.label))
    .map((observation) => observation.label);

  const misconceptionHits = experiment.misconceptions.filter((misconception) => {
    if (misconception === "酸碱反应都会产生气泡") {
      return normalized.includes("气泡") || normalized.includes("冒泡") || normalized.includes("气体");
    }

    return normalized.includes(misconception.toLowerCase());
  });

  if (misconceptionHits.length > 0) {
    return {
      status: "misconception",
      matchedObservations,
      missingObservations,
      misconceptionHits,
      message: "你的预测里有一个常见误区，建议先核对实验现象再下结论。"
    };
  }

  if (missingObservations.length === 0) {
    return {
      status: "accurate",
      matchedObservations,
      missingObservations,
      misconceptionHits,
      message: "你的预测与这个实验的关键现象基本一致。"
    };
  }

  return {
    status: matchedObservations.length > 0 ? "partial" : "empty",
    matchedObservations,
    missingObservations,
    misconceptionHits,
    message: matchedObservations.length > 0
      ? "你抓住了部分现象，但还可以补充其他关键证据。"
      : "这个预测还没有命中关键实验现象。"
  };
}
```

- [ ] **Step 6: Run tests to verify pass**

Run:

```bash
npm test -- src/domain/matcher.test.ts src/domain/evaluator.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit matching and evaluation**

```bash
git add src/domain/matcher.ts src/domain/evaluator.ts src/domain/matcher.test.ts src/domain/evaluator.test.ts
git commit -m "feat: add experiment matching and expectation evaluation"
```

---

### Task 4: Local Tutor Agent

**Files:**
- Create: `src/domain/tutor.ts`
- Create: `src/domain/tutor.test.ts`

- [ ] **Step 1: Write tutor tests**

Create `src/domain/tutor.test.ts`:

```ts
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
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/domain/tutor.test.ts
```

Expected: FAIL because `src/domain/tutor.ts` does not exist.

- [ ] **Step 3: Implement tutor generator**

Create `src/domain/tutor.ts`:

```ts
import type { Experiment, ExpectationEvaluation, TutorFeedback } from "./types";

function correctionFor(evaluation: ExpectationEvaluation): string {
  if (evaluation.status === "misconception") {
    if (evaluation.misconceptionHits.includes("酸碱反应都会产生气泡")) {
      return "这里要修正一个常见判断：不是所有酸碱反应都会产生气泡。盐酸与氢氧化钠中和的关键证据通常是指示剂颜色变化和放热。";
    }

    return `你的预测触碰到了常见误区：${evaluation.misconceptionHits.join("、")}。先回到实验现象，再根据证据推理结论。`;
  }

  if (evaluation.status === "accurate") {
    return "你的预测抓住了这个实验的关键现象，可以继续把现象和反应原理联系起来。";
  }

  if (evaluation.status === "partial") {
    return `你的预测已经命中 ${evaluation.matchedObservations.join("、")}，还需要补充 ${evaluation.missingObservations.join("、")}。`;
  }

  return "你还没有写出明确预测。可以先想一想是否会出现气泡、颜色变化、沉淀、放热或复燃等证据。";
}

export function generateTutorFeedback(
  experiment: Experiment,
  evaluation: ExpectationEvaluation
): TutorFeedback {
  return {
    headline: `${experiment.title}：实验智能体反馈`,
    correction: correctionFor(evaluation),
    observationSummary: experiment.observations
      .map((observation) => `${observation.label}：${observation.detail}`)
      .join("；"),
    equation: experiment.equation,
    principle: experiment.principle,
    conclusion: experiment.conclusion,
    safety: experiment.safetyNotes.join(" "),
    followUpQuestion: experiment.followUpQuestions[0]
  };
}
```

- [ ] **Step 4: Run tutor tests**

Run:

```bash
npm test -- src/domain/tutor.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit tutor agent**

```bash
git add src/domain/tutor.ts src/domain/tutor.test.ts
git commit -m "feat: add local chemistry tutor agent"
```

---

### Task 4.5: Student Learning Reflection

**Files:**
- Create: `src/domain/reflection.ts`
- Create: `src/domain/reflection.test.ts`
- Modify: `src/domain/types.ts`

- [ ] **Step 1: Write reflection tests**

Create `src/domain/reflection.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { experiments } from "./experiments";
import { evaluateExpectation } from "./evaluator";
import { generateLearningReflection } from "./reflection";

describe("generateLearningReflection", () => {
  it("encourages evidence-based observation for accurate predictions", () => {
    const experiment = experiments.find((item) => item.id === "co2-preparation")!;
    const evaluation = evaluateExpectation(experiment, "有气泡，石灰水变浑浊");
    const reflection = generateLearningReflection(experiment, evaluation);

    expect(reflection.insight).toContain("证据");
    expect(reflection.skillTags).toContain("气体检验");
  });

  it("turns misconception into a next-step learning suggestion", () => {
    const experiment = experiments.find((item) => item.id === "acid-base-neutralization")!;
    const evaluation = evaluateExpectation(experiment, "会产生气泡");
    const reflection = generateLearningReflection(experiment, evaluation);

    expect(reflection.nextStep).toContain("先观察");
    expect(reflection.skillTags).toContain("误区修正");
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
npm test -- src/domain/reflection.test.ts
```

Expected: FAIL because `src/domain/reflection.ts` does not exist.

- [ ] **Step 3: Ensure reflection types exist**

If Task 2 has not already added these types to `src/domain/types.ts`, append them after `TutorFeedback`:

```ts
export interface LearningReflection {
  insight: string;
  nextStep: string;
  skillTags: string[];
}

export interface ProjectFeedback {
  id: string;
  clarity: "清楚" | "一般" | "需要改进";
  suggestion: string;
}
```

- [ ] **Step 4: Implement reflection generator**

Create `src/domain/reflection.ts`:

```ts
import type { Experiment, ExpectationEvaluation, LearningReflection } from "./types";

function tagsFor(experiment: Experiment, evaluation: ExpectationEvaluation): string[] {
  const tags = new Set<string>();

  for (const observation of experiment.observations) {
    if (observation.kind === "gas") tags.add("气体现象");
    if (observation.kind === "precipitate") tags.add("沉淀证据");
    if (observation.kind === "color") tags.add("颜色变化");
    if (observation.kind === "flame") tags.add("气体检验");
    if (observation.kind === "solid") tags.add("金属活动性");
    if (observation.kind === "heat") tags.add("能量变化");
  }

  if (evaluation.status === "misconception") {
    tags.add("误区修正");
  }

  if (evaluation.status === "accurate") {
    tags.add("证据推理");
  }

  return Array.from(tags);
}

export function generateLearningReflection(
  experiment: Experiment,
  evaluation: ExpectationEvaluation
): LearningReflection {
  if (evaluation.status === "misconception") {
    return {
      insight: `这次实验提醒你：实验结论要由可观察证据支持，不能只凭反应物名称猜现象。`,
      nextStep: `下次实验先观察气泡、颜色、沉淀、温度或复燃等证据，再写化学结论。`,
      skillTags: tagsFor(experiment, evaluation)
    };
  }

  if (evaluation.status === "accurate") {
    return {
      insight: `你已经能把实验现象作为证据来支持结论，这是高中和大学化学实验都需要的能力。`,
      nextStep: `下次可以进一步比较“现象描述”和“原理解释”的区别，让实验记录更规范。`,
      skillTags: tagsFor(experiment, evaluation)
    };
  }

  if (evaluation.status === "partial") {
    return {
      insight: `你抓住了一部分证据，但完整实验记录还需要补齐其他关键现象。`,
      nextStep: `下次实验记录时按“我看到了什么、说明了什么、还需要什么证据”三步来写。`,
      skillTags: tagsFor(experiment, evaluation)
    };
  }

  return {
    insight: `先做预测再观察，是训练科学思维的第一步。`,
    nextStep: `下次先写一个可被实验验证的预测，再用实验现象修正自己的判断。`,
    skillTags: tagsFor(experiment, evaluation)
  };
}
```

- [ ] **Step 5: Run reflection tests**

Run:

```bash
npm test -- src/domain/reflection.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit reflection helper**

```bash
git add src/domain/types.ts src/domain/reflection.ts src/domain/reflection.test.ts
git commit -m "feat: add student learning reflection loop"
```

---

### Task 5: Student-Facing UI Components

**Files:**
- Create: `src/components/ExperimentSelector.tsx`
- Create: `src/components/StudentInputPanel.tsx`
- Create: `src/components/ExperimentStage.tsx`
- Create: `src/components/TutorPanel.tsx`
- Create: `src/components/LabNotebook.tsx`
- Create: `src/components/ProjectFeedbackPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Create experiment selector**

Create `src/components/ExperimentSelector.tsx`:

```tsx
import type { Experiment } from "../domain/types";

interface ExperimentSelectorProps {
  experiments: Experiment[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ExperimentSelector({ experiments, selectedId, onSelect }: ExperimentSelectorProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">实验库</p>
        <h2>选择课堂实验</h2>
      </div>
      <div className="experiment-grid">
        {experiments.map((experiment) => (
          <button
            className={experiment.id === selectedId ? "experiment-card active" : "experiment-card"}
            key={experiment.id}
            type="button"
            onClick={() => onSelect(experiment.id)}
          >
            <span>{experiment.title}</span>
            <small>{experiment.subtitle}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create input panel**

Create `src/components/StudentInputPanel.tsx`:

```tsx
interface StudentInputPanelProps {
  reactionInput: string;
  expectation: string;
  onReactionInputChange: (value: string) => void;
  onExpectationChange: (value: string) => void;
  onRun: () => void;
}

export function StudentInputPanel({
  reactionInput,
  expectation,
  onReactionInputChange,
  onExpectationChange,
  onRun
}: StudentInputPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">学生输入</p>
        <h2>描述实验与预测现象</h2>
      </div>
      <label className="field">
        <span>实验或反应描述</span>
        <input
          value={reactionInput}
          onChange={(event) => onReactionInputChange(event.target.value)}
          placeholder="例如：碳酸钙和稀盐酸反应后通入澄清石灰水"
        />
      </label>
      <label className="field">
        <span>我预测会看到</span>
        <textarea
          value={expectation}
          onChange={(event) => onExpectationChange(event.target.value)}
          placeholder="例如：会产生气泡，澄清石灰水变浑浊"
          rows={4}
        />
      </label>
      <button className="primary-button" type="button" onClick={onRun}>
        生成实验反馈
      </button>
    </section>
  );
}
```

- [ ] **Step 3: Create experiment stage**

Create `src/components/ExperimentStage.tsx`:

```tsx
import type { Experiment } from "../domain/types";

interface ExperimentStageProps {
  experiment: Experiment;
}

export function ExperimentStage({ experiment }: ExperimentStageProps) {
  return (
    <section className="panel stage-panel">
      <div className="panel-heading">
        <p className="eyebrow">实验现象</p>
        <h2>{experiment.title}</h2>
      </div>
      <div className="lab-visual" style={{ "--accent": experiment.visual.accent } as React.CSSProperties}>
        <div className="tube">
          <div className="liquid before" style={{ background: experiment.visual.liquidBefore }} />
          <div className="bubble one" />
          <div className="bubble two" />
          <div className="bubble three" />
        </div>
        <div className="arrow">-></div>
        <div className="tube">
          <div className="liquid after" style={{ background: experiment.visual.liquidAfter }} />
          <span className="tube-label">{experiment.visual.beakerLabel}</span>
        </div>
      </div>
      <ol className="step-list">
        {experiment.steps.map((step) => (
          <li key={step.title}>
            <strong>{step.title}</strong>
            <span>{step.detail}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 4: Create tutor panel and notebook**

Create `src/components/TutorPanel.tsx`:

```tsx
import type { ExpectationEvaluation, TutorFeedback } from "../domain/types";

interface TutorPanelProps {
  evaluation: ExpectationEvaluation;
  feedback: TutorFeedback;
}

export function TutorPanel({ evaluation, feedback }: TutorPanelProps) {
  return (
    <section className="panel tutor-panel">
      <div className="panel-heading">
        <p className={`status-pill ${evaluation.status}`}>{evaluation.status}</p>
        <h2>{feedback.headline}</h2>
      </div>
      <article className="feedback-block">
        <h3>智能纠错</h3>
        <p>{feedback.correction}</p>
      </article>
      <article className="feedback-block">
        <h3>实验现象</h3>
        <p>{feedback.observationSummary}</p>
      </article>
      <article className="feedback-block">
        <h3>方程式与原理</h3>
        <p className="equation">{feedback.equation}</p>
        <p>{feedback.principle}</p>
      </article>
      <article className="feedback-block">
        <h3>结论与安全提醒</h3>
        <p>{feedback.conclusion}</p>
        <p>{feedback.safety}</p>
      </article>
      <article className="follow-up">
        <h3>课堂追问</h3>
        <p>{feedback.followUpQuestion}</p>
      </article>
    </section>
  );
}
```

Create `src/components/LabNotebook.tsx`:

```tsx
interface NotebookEntry {
  id: string;
  experimentTitle: string;
  expectation: string;
  status: string;
  insight: string;
  nextStep: string;
  skillTags: string[];
}

interface LabNotebookProps {
  entries: NotebookEntry[];
}

export function LabNotebook({ entries }: LabNotebookProps) {
  return (
    <section className="panel notebook-panel">
      <div className="panel-heading">
        <p className="eyebrow">学习轨迹</p>
        <h2>本次实验记录</h2>
      </div>
      {entries.length === 0 ? (
        <p className="muted">生成一次实验反馈后，这里会记录学生预测与智能体判断。</p>
      ) : (
        <ul className="notebook-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.experimentTitle}</strong>
              <span>{entry.expectation || "未填写预测"}</span>
              <small>{entry.status}</small>
              <p>{entry.insight}</p>
              <p>{entry.nextStep}</p>
              <div className="tag-row">
                {entry.skillTags.map((tag) => (
                  <em key={tag}>{tag}</em>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

Create `src/components/ProjectFeedbackPanel.tsx`:

```tsx
import { useState } from "react";
import type { ProjectFeedback } from "../domain/types";

interface ProjectFeedbackPanelProps {
  feedbacks: ProjectFeedback[];
  onSubmit: (feedback: Omit<ProjectFeedback, "id">) => void;
}

export function ProjectFeedbackPanel({ feedbacks, onSubmit }: ProjectFeedbackPanelProps) {
  const [clarity, setClarity] = useState<ProjectFeedback["clarity"]>("清楚");
  const [suggestion, setSuggestion] = useState("");

  function submitFeedback() {
    onSubmit({ clarity, suggestion: suggestion.trim() || "希望继续扩展更多课堂实验。" });
    setSuggestion("");
  }

  return (
    <section className="panel project-feedback-panel">
      <div className="panel-heading">
        <p className="eyebrow">项目迭代</p>
        <h2>课堂反馈入口</h2>
      </div>
      <label className="field">
        <span>这次解释是否清楚</span>
        <select value={clarity} onChange={(event) => setClarity(event.target.value as ProjectFeedback["clarity"])}>
          <option value="清楚">清楚</option>
          <option value="一般">一般</option>
          <option value="需要改进">需要改进</option>
        </select>
      </label>
      <label className="field">
        <span>希望下一版优化</span>
        <textarea
          value={suggestion}
          onChange={(event) => setSuggestion(event.target.value)}
          placeholder="例如：加入燃烧实验，或把现象动画做得更明显"
          rows={3}
        />
      </label>
      <button className="secondary-button" type="button" onClick={submitFeedback}>
        记录反馈
      </button>
      <div className="iteration-note">
        <strong>迭代机制</strong>
        <p>根据课堂反馈更新实验库、常见误区、解释模板和后续模型接入策略。</p>
      </div>
      {feedbacks.length > 0 && (
        <ul className="feedback-list">
          {feedbacks.map((feedback) => (
            <li key={feedback.id}>
              <strong>{feedback.clarity}</strong>
              <span>{feedback.suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 5: Wire components in App**

Replace `src/App.tsx`:

```tsx
import { useMemo, useState } from "react";
import { ExperimentSelector } from "./components/ExperimentSelector";
import { ExperimentStage } from "./components/ExperimentStage";
import { LabNotebook } from "./components/LabNotebook";
import { ProjectFeedbackPanel } from "./components/ProjectFeedbackPanel";
import { StudentInputPanel } from "./components/StudentInputPanel";
import { TutorPanel } from "./components/TutorPanel";
import { evaluateExpectation } from "./domain/evaluator";
import { experiments } from "./domain/experiments";
import { findExperimentByInput, getExperimentById } from "./domain/matcher";
import { generateLearningReflection } from "./domain/reflection";
import { generateTutorFeedback } from "./domain/tutor";
import type { ProjectFeedback } from "./domain/types";

interface NotebookEntry {
  id: string;
  experimentTitle: string;
  expectation: string;
  status: string;
  insight: string;
  nextStep: string;
  skillTags: string[];
}

export default function App() {
  const [selectedId, setSelectedId] = useState(experiments[0].id);
  const [reactionInput, setReactionInput] = useState("");
  const [expectation, setExpectation] = useState("");
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [projectFeedbacks, setProjectFeedbacks] = useState<ProjectFeedback[]>([]);

  const selectedExperiment = getExperimentById(selectedId) ?? experiments[0];
  const matchedExperiment = findExperimentByInput(reactionInput) ?? selectedExperiment;
  const evaluation = useMemo(
    () => evaluateExpectation(matchedExperiment, expectation),
    [matchedExperiment, expectation]
  );
  const feedback = useMemo(
    () => generateTutorFeedback(matchedExperiment, evaluation),
    [matchedExperiment, evaluation]
  );
  const reflection = useMemo(
    () => generateLearningReflection(matchedExperiment, evaluation),
    [matchedExperiment, evaluation]
  );

  function runFeedback() {
    setSelectedId(matchedExperiment.id);
    setEntries((current) => [
      {
        id: `${Date.now()}`,
        experimentTitle: matchedExperiment.title,
        expectation,
        status: evaluation.status,
        insight: reflection.insight,
        nextStep: reflection.nextStep,
        skillTags: reflection.skillTags
      },
      ...current
    ].slice(0, 5));
  }

  function submitProjectFeedback(feedback: Omit<ProjectFeedback, "id">) {
    setProjectFeedbacks((current) => [
      { ...feedback, id: `${Date.now()}` },
      ...current
    ].slice(0, 3));
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">ChemPilot</p>
        <h1>智能化学实验数字平台</h1>
        <p>应用化学视角下的中学课堂实验 AI 智能体：先预测，再观察，再解释。</p>
      </header>
      <div className="workspace-grid">
        <div className="left-column">
          <ExperimentSelector experiments={experiments} selectedId={selectedId} onSelect={setSelectedId} />
          <StudentInputPanel
            reactionInput={reactionInput}
            expectation={expectation}
            onReactionInputChange={setReactionInput}
            onExpectationChange={setExpectation}
            onRun={runFeedback}
          />
        </div>
        <ExperimentStage experiment={matchedExperiment} />
        <div className="right-column">
          <TutorPanel evaluation={evaluation} feedback={feedback} />
          <LabNotebook entries={entries} />
          <ProjectFeedbackPanel feedbacks={projectFeedbacks} onSubmit={submitProjectFeedback} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Replace global styles**

Replace `src/styles.css` with responsive, non-overlapping styles. Include stable dimensions for cards, controls, and the lab visual:

```css
:root {
  font-family: Inter, "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
  color: #17211f;
  background: #f3f6f4;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
textarea {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 24px;
}

.app-header {
  max-width: 1360px;
  margin: 0 auto 20px;
}

.app-header h1 {
  margin: 0;
  font-size: 34px;
  line-height: 1.16;
  letter-spacing: 0;
}

.app-header p:last-child {
  max-width: 720px;
  margin: 10px 0 0;
  color: #52615d;
}

.eyebrow {
  margin: 0 0 8px;
  color: #236f63;
  font-weight: 700;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(420px, 1fr) minmax(320px, 420px);
  gap: 16px;
  max-width: 1360px;
  margin: 0 auto;
  align-items: start;
}

.left-column,
.right-column {
  display: grid;
  gap: 16px;
}

.panel {
  background: #ffffff;
  border: 1px solid #dce5e0;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 10px 24px rgba(39, 55, 49, 0.07);
}

.panel-heading h2 {
  margin: 0 0 12px;
  font-size: 18px;
  line-height: 1.25;
  letter-spacing: 0;
}

.experiment-grid {
  display: grid;
  gap: 8px;
}

.experiment-card {
  width: 100%;
  min-height: 76px;
  padding: 12px;
  border: 1px solid #d6e1dc;
  border-radius: 8px;
  background: #f9fbfa;
  text-align: left;
  cursor: pointer;
}

.experiment-card.active {
  border-color: #2f8f83;
  background: #eaf6f3;
}

.experiment-card span,
.experiment-card small {
  display: block;
}

.experiment-card span {
  font-weight: 700;
  margin-bottom: 4px;
}

.experiment-card small {
  color: #5d6b67;
  line-height: 1.4;
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
}

.field span {
  font-weight: 700;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #cbd8d2;
  border-radius: 8px;
  padding: 10px 12px;
  color: #17211f;
  background: #ffffff;
}

textarea {
  resize: vertical;
  min-height: 108px;
}

.primary-button {
  width: 100%;
  min-height: 44px;
  border: 0;
  border-radius: 8px;
  color: white;
  background: #236f63;
  font-weight: 700;
  cursor: pointer;
}

.secondary-button {
  width: 100%;
  min-height: 42px;
  border: 1px solid #236f63;
  border-radius: 8px;
  color: #236f63;
  background: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.stage-panel {
  min-height: 620px;
}

.lab-visual {
  min-height: 260px;
  display: grid;
  grid-template-columns: 1fr 56px 1fr;
  align-items: end;
  gap: 12px;
  padding: 20px;
  border-radius: 8px;
  background: linear-gradient(180deg, #eef5f3, #ffffff);
  border: 1px solid #dce5e0;
}

.tube {
  position: relative;
  width: min(160px, 100%);
  height: 220px;
  margin: 0 auto;
  border: 4px solid #90a29c;
  border-top: 0;
  border-radius: 0 0 42px 42px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
}

.liquid {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 54%;
}

.bubble {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  background: rgba(255, 255, 255, 0.8);
}

.bubble.one { left: 34%; bottom: 30%; }
.bubble.two { left: 52%; bottom: 45%; }
.bubble.three { left: 42%; bottom: 62%; }

.tube-label {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 12px;
  text-align: center;
  font-weight: 700;
}

.arrow {
  align-self: center;
  text-align: center;
  font-weight: 800;
  color: #236f63;
}

.step-list {
  margin: 16px 0 0;
  padding-left: 20px;
}

.step-list li {
  margin-bottom: 10px;
}

.step-list strong,
.step-list span {
  display: block;
}

.step-list span,
.feedback-block p,
.follow-up p,
.muted {
  color: #52615d;
  line-height: 1.65;
}

.status-pill {
  display: inline-block;
  margin: 0 0 8px;
  padding: 4px 8px;
  border-radius: 999px;
  color: #ffffff;
  background: #64736e;
  font-size: 12px;
  font-weight: 700;
}

.status-pill.accurate { background: #24765e; }
.status-pill.partial { background: #8a6a1f; }
.status-pill.misconception { background: #a94442; }
.status-pill.empty { background: #64736e; }

.feedback-block {
  border-top: 1px solid #edf2ef;
  padding-top: 12px;
  margin-top: 12px;
}

.feedback-block h3,
.follow-up h3 {
  margin: 0 0 6px;
  font-size: 15px;
}

.equation {
  font-family: "SFMono-Regular", Consolas, monospace;
  color: #17211f;
}

.follow-up {
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f2f7f5;
  border: 1px solid #dce5e0;
}

.notebook-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.notebook-list li {
  display: grid;
  gap: 4px;
  padding: 10px;
  border-radius: 8px;
  background: #f9fbfa;
}

.notebook-list span,
.notebook-list small,
.notebook-list p {
  color: #52615d;
}

.notebook-list p {
  margin: 2px 0 0;
  line-height: 1.55;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.tag-row em {
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eaf6f3;
  color: #236f63;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
}

.iteration-note {
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f9fbfa;
  border: 1px solid #dce5e0;
}

.iteration-note p {
  margin: 6px 0 0;
  color: #52615d;
  line-height: 1.55;
}

.feedback-list {
  list-style: none;
  display: grid;
  gap: 8px;
  margin: 12px 0 0;
  padding: 0;
}

.feedback-list li {
  display: grid;
  gap: 4px;
  padding: 10px;
  border-radius: 8px;
  background: #f2f7f5;
}

.feedback-list span {
  color: #52615d;
  line-height: 1.5;
}

@media (max-width: 1100px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .stage-panel {
    min-height: auto;
  }
}

@media (max-width: 640px) {
  .app-shell {
    padding: 16px;
  }

  .app-header h1 {
    font-size: 26px;
  }

  .lab-visual {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .arrow {
    transform: rotate(90deg);
  }
}
```

- [ ] **Step 7: Run build and tests**

Run:

```bash
npm run build
npm test
```

Expected: both commands pass.

- [ ] **Step 8: Commit UI**

```bash
git add src/App.tsx src/styles.css src/components
git commit -m "feat: build student experiment interface"
```

---

### Task 6: End-to-End Manual QA and Browser Verification

**Files:**
- Modify only if QA finds defects: `src/App.tsx`, `src/styles.css`, or focused component files.

- [ ] **Step 1: Start local dev server**

Run:

```bash
npm run dev
```

Expected: Vite prints a local URL, usually `http://localhost:5173/`.

- [ ] **Step 2: Verify the four required experiment paths manually**

In the browser, run these checks:

1. Select “二氧化碳的制取与检验”; enter `会产生气泡，澄清石灰水变浑浊`; click `生成实验反馈`; confirm status is `accurate`.
2. Select “盐酸与氢氧化钠中和”; enter `我觉得会产生气泡`; click `生成实验反馈`; confirm feedback says `不是所有酸碱反应都会产生气泡`.
3. Select “铁与硫酸铜反应”; enter `铁表面会出现红色物质，蓝色变浅`; confirm equation contains `Fe + CuSO4`.
4. Select “过氧化氢制取氧气”; enter `会冒泡，带火星木条复燃`; confirm safety note mentions `过氧化氢`.
5. Confirm the lab notebook entry includes a learning insight, next-step suggestion, and skill tags.
6. Submit project feedback with clarity `需要改进` and suggestion `加入燃烧实验`; confirm it appears in the project iteration panel.

- [ ] **Step 3: Verify free-text matching**

Type these descriptions into the experiment input field and confirm the central stage switches to the correct experiment:

```text
碳酸钙和稀盐酸反应后通入澄清石灰水
盐酸和氢氧化钠混合会不会产生气泡
铁钉放入硫酸铜溶液
双氧水加入二氧化锰后用带火星木条检验
```

- [ ] **Step 4: Verify responsive layout**

Check desktop width around 1440px and mobile width around 390px:

- No button text overflows.
- Lab visual remains visible.
- Panels stack cleanly on mobile.
- Header and cards do not overlap.

- [ ] **Step 5: Fix defects if any**

If layout defects appear, edit the smallest affected CSS selector in `src/styles.css`. After any fix, rerun:

```bash
npm run build
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit QA fixes**

If changes were needed:

```bash
git add src/App.tsx src/styles.css src/components
git commit -m "fix: polish ChemPilot prototype QA"
```

If no changes were needed, do not create an empty commit.

---

### Task 7: Documentation for Running and Competition Mapping

**Files:**
- Create: `README.md`

- [ ] **Step 1: Create README**

Create `README.md`:

```md
# ChemPilot 智能化学实验数字平台

ChemPilot 是面向中学化学课堂实验场景的学生端 AI 实验智能体原型。项目从应用化学专业背景出发，将中学化学实验中的现象观察、原理解释、错误纠正、实验结论和安全提醒整合为一条可演示、可复现的学习闭环。

## 第一版功能

- 支持 4 个中学课堂代表实验：
  - 二氧化碳的制取与检验
  - 盐酸与氢氧化钠中和
  - 铁与硫酸铜反应
  - 过氧化氢制取氧气
- 支持学生输入实验描述和预期现象。
- 使用化学规则库判断实验类型和标准现象。
- 使用本地智能体生成纠错、方程式、原理、结论、安全提醒和课堂追问。
- 每次实验后生成学习心得、下一次实验建议和实验能力标签。
- 提供课堂反馈入口，展示项目如何持续更新实验库、误区库和解释策略。
- 可在无外部 AI API 的情况下完成核心演示。

## 运行方式

```bash
npm install
npm run dev
```

浏览器打开 Vite 输出的本地地址，通常是：

```text
http://localhost:5173/
```

## 测试与构建

```bash
npm test
npm run build
```

## 大赛材料对应

- 作品简介：AI 支持中学化学实验观察、解释和纠错。
- 设计思想：以应用化学知识库约束 AI 输出，避免大模型幻觉。
- AI 技术运用：文本处理、诊断评估、创意生成、自动化反馈。
- 可复现说明：选择实验、输入预期、生成反馈、查看方程式和结论。
- 育人价值：引导学生从应试记忆转向实验观察、证据推理、规范表达和安全意识。
- 自我迭代：根据学生和教师反馈持续更新规则库、实验库、解释模板和模型接入方式。

## 后续拓展

- 教师端任务发布与学情统计。
- 学生实验记录长期保存。
- 接入真实大语言模型增强解释表达。
- AI 生成实验演示视频或动画。
- 根据新课标、教材版本和课堂反馈扩展实验内容。
```

- [ ] **Step 2: Verify README commands**

Run:

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 3: Commit README**

```bash
git add README.md
git commit -m "docs: add ChemPilot run guide"
```

---

### Task 8: Final Verification

**Files:**
- No planned file edits.

- [ ] **Step 1: Run full verification**

Run:

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 2: Check git status**

Run:

```bash
git status --short --branch
```

Expected: no unstaged implementation changes. Existing untracked competition source files under `项目要求/` may remain untracked unless the user asks to add them.

- [ ] **Step 3: Start dev server for user**

Run:

```bash
npm run dev
```

Expected: Vite local URL is available for user testing.

- [ ] **Step 4: Final response**

Report:

- local URL
- tests run
- build status
- remaining untracked files, if any
- next suggested competition-material step
- confirmation that student learning iteration and project feedback iteration are included

---

## Self-Review

Spec coverage:

- Student-side main loop: Tasks 2, 3, 4, and 5.
- Four chemistry experiments: Task 2.
- Rule-library constrained AI explanation: Tasks 3 and 4.
- Student learning iteration: Task 4.5 and Task 5.
- Project self-iteration feedback: Task 5 and Task 7.
- Experiment selection and free-text input: Task 5.
- Phenomenon display and learning record: Task 5.
- Reproducible local operation without external services: Tasks 1, 2, 4, 7, and 8.
- Competition mapping documentation: Task 7.

Scope check:

- The plan does not implement teacher login, class management, backend database, remote LLM API, AI video generation, or 3D/VR. These remain documented future extensions.

Type consistency:

- `Experiment`, `ExpectationEvaluation`, and `TutorFeedback` are defined in Task 2 and reused consistently in Tasks 3-5.
- `status` values are limited to `accurate`, `partial`, `misconception`, and `empty`.
