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
