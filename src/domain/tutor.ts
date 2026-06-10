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
