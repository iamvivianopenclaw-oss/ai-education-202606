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

  if (
    experiment.observations.some((observation) => observation.kind === "gas") &&
    experiment.steps.some((step) => step.title.includes("检验") || step.detail.includes("检验"))
  ) {
    tags.add("气体检验");
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
    if (evaluation.matchedObservations.length === 0) {
      return {
        insight: `你的预测还没有连接到关键证据，实验结论需要先被可观察现象支持。`,
        nextStep: `下次先观察气体、颜色、沉淀、温度、火焰或固体变化等证据，再写出结论。`,
        skillTags: tagsFor(experiment, evaluation)
      };
    }

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
