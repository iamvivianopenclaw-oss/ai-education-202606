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
