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
  const evaluation = useMemo(() => evaluateExpectation(matchedExperiment, expectation), [matchedExperiment, expectation]);
  const feedback = useMemo(() => generateTutorFeedback(matchedExperiment, evaluation), [matchedExperiment, evaluation]);
  const reflection = useMemo(
    () => generateLearningReflection(matchedExperiment, evaluation),
    [matchedExperiment, evaluation]
  );

  function runFeedback() {
    setSelectedId(matchedExperiment.id);
    setEntries((current) =>
      [
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
      ].slice(0, 5)
    );
  }

  function submitProjectFeedback(feedbackInput: Omit<ProjectFeedback, "id">) {
    setProjectFeedbacks((current) => [{ ...feedbackInput, id: `${Date.now()}` }, ...current].slice(0, 3));
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
