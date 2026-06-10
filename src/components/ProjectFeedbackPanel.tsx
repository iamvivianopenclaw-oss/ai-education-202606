import { useState } from "react";
import type { ExpectationEvaluation, ProjectFeedback } from "../domain/types";

interface ProjectFeedbackEntry extends ProjectFeedback {
  experimentTitle: string;
  status: ExpectationEvaluation["status"];
}

interface ProjectFeedbackPanelProps {
  feedbacks: ProjectFeedbackEntry[];
  onSubmit: (feedback: Omit<ProjectFeedback, "id">) => void;
}

const STATUS_LABELS: Record<ExpectationEvaluation["status"], string> = {
  accurate: "预测准确",
  partial: "部分命中",
  misconception: "存在误区",
  empty: "未填写预测"
};

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
              <div className="feedback-context">
                <strong>{feedback.experimentTitle}</strong>
                <em>{STATUS_LABELS[feedback.status]}</em>
                <em>{feedback.clarity}</em>
              </div>
              <span>{feedback.suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
