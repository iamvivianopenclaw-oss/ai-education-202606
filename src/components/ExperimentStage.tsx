import type { CSSProperties } from "react";
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
      <div className="lab-visual" style={{ "--accent": experiment.visual.accent } as CSSProperties}>
        <div className="tube">
          <div className="liquid before" style={{ background: experiment.visual.liquidBefore }} />
          <div className="bubble one" />
          <div className="bubble two" />
          <div className="bubble three" />
        </div>
        <div className="arrow">-&gt;</div>
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
