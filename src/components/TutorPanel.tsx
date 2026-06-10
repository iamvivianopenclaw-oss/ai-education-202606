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
