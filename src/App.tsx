import { useEffect, useMemo, useState } from "react";
import { ExperimentSelector } from "./components/ExperimentSelector";
import { ExperimentStage } from "./components/ExperimentStage";
import { LabNotebook } from "./components/LabNotebook";
import { MemoryCardPanel } from "./components/MemoryCardPanel";
import { ProjectFeedbackPanel } from "./components/ProjectFeedbackPanel";
import { ReviewPanel } from "./components/ReviewPanel";
import { StudentInputPanel } from "./components/StudentInputPanel";
import { TutorPanel } from "./components/TutorPanel";
import { evaluateExpectation } from "./domain/evaluator";
import { experiments } from "./domain/experiments";
import { findExperimentByInput, getExperimentById } from "./domain/matcher";
import { createMemoryCard, getReviewQueue, updateReviewStatus } from "./domain/memory";
import { generateLearningReflection } from "./domain/reflection";
import { loadMemoryCards, saveMemoryCards } from "./domain/reviewStorage";
import { generateTutorFeedback } from "./domain/tutor";
import type { ExpectationEvaluation, MemoryCard, ProjectFeedback, ReviewStatus } from "./domain/types";
import { createVisualTimeline } from "./domain/visualTimeline";

interface NotebookEntry {
  id: string;
  experimentTitle: string;
  expectation: string;
  status: string;
  insight: string;
  nextStep: string;
  skillTags: string[];
}

interface ProjectFeedbackEntry extends ProjectFeedback {
  experimentTitle: string;
  status: ExpectationEvaluation["status"];
}

export default function App() {
  const [selectedId, setSelectedId] = useState(experiments[0].id);
  const [reactionInput, setReactionInput] = useState("");
  const [expectation, setExpectation] = useState("");
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [projectFeedbacks, setProjectFeedbacks] = useState<ProjectFeedbackEntry[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMemoryCard, setCurrentMemoryCard] = useState<MemoryCard | undefined>();
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [hasLoadedMemoryCards, setHasLoadedMemoryCards] = useState(false);

  const selectedExperiment = getExperimentById(selectedId) ?? experiments[0];
  const matchedExperiment = findExperimentByInput(reactionInput) ?? selectedExperiment;
  const timeline = useMemo(() => createVisualTimeline(matchedExperiment), [matchedExperiment]);
  const evaluation = useMemo(() => evaluateExpectation(matchedExperiment, expectation), [matchedExperiment, expectation]);
  const feedback = useMemo(() => generateTutorFeedback(matchedExperiment, evaluation), [matchedExperiment, evaluation]);
  const reflection = useMemo(
    () => generateLearningReflection(matchedExperiment, evaluation),
    [matchedExperiment, evaluation]
  );
  const reviewQueue = useMemo(() => getReviewQueue(memoryCards), [memoryCards]);

  useEffect(() => {
    setActiveStepIndex(0);
    setIsPlaying(false);
  }, [matchedExperiment.id]);

  useEffect(() => {
    if (!isPlaying) return;

    if (activeStepIndex >= timeline.length - 1) {
      setIsPlaying(false);
      return;
    }

    const advanceTimer = window.setTimeout(() => {
      setActiveStepIndex((current) => Math.min(current + 1, timeline.length - 1));
    }, 1400);

    return () => window.clearTimeout(advanceTimer);
  }, [activeStepIndex, isPlaying, timeline.length]);

  useEffect(() => {
    const storage = typeof window === "undefined" ? undefined : window.localStorage;
    setMemoryCards(loadMemoryCards(storage));
    setHasLoadedMemoryCards(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedMemoryCards) return;

    const storage = typeof window === "undefined" ? undefined : window.localStorage;
    saveMemoryCards(storage, memoryCards);
  }, [hasLoadedMemoryCards, memoryCards]);

  function handleExperimentSelect(id: string) {
    setSelectedId(id);
    setReactionInput("");
  }

  function handleReactionInputChange(value: string) {
    setReactionInput(value);

    const inputMatchedExperiment = findExperimentByInput(value);
    if (inputMatchedExperiment) {
      setSelectedId(inputMatchedExperiment.id);
    }
  }

  function handleTogglePlay() {
    setIsPlaying((current) => {
      if (!current && activeStepIndex >= timeline.length - 1) {
        setActiveStepIndex(0);
      }

      return !current;
    });
  }

  function handleReplay() {
    setActiveStepIndex(0);
    setIsPlaying(true);
  }

  function runFeedback() {
    const memoryCard = createMemoryCard(matchedExperiment, feedback, evaluation, `${Date.now()}`);

    setSelectedId(matchedExperiment.id);
    setCurrentMemoryCard(memoryCard);
    setMemoryCards((current) => [
      memoryCard,
      ...current.filter((card) => card.experimentId !== matchedExperiment.id)
    ]);
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

  function handleReviewStatusChange(cardId: string, status: ReviewStatus) {
    const reviewedAt = Date.now();

    setMemoryCards((current) =>
      current.map((card) => (card.id === cardId ? updateReviewStatus(card, status, reviewedAt) : card))
    );
    setCurrentMemoryCard((current) => (current?.id === cardId ? updateReviewStatus(current, status, reviewedAt) : current));
  }

  function submitProjectFeedback(feedbackInput: Omit<ProjectFeedback, "id">) {
    setProjectFeedbacks((current) =>
      [
        {
          ...feedbackInput,
          id: `${Date.now()}`,
          experimentTitle: matchedExperiment.title,
          status: evaluation.status
        },
        ...current
      ].slice(0, 3)
    );
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
          <ExperimentSelector experiments={experiments} selectedId={selectedId} onSelect={handleExperimentSelect} />
          <StudentInputPanel
            reactionInput={reactionInput}
            expectation={expectation}
            onReactionInputChange={handleReactionInputChange}
            onExpectationChange={setExpectation}
            onRun={runFeedback}
          />
        </div>
        <ExperimentStage
          experiment={matchedExperiment}
          timeline={timeline}
          activeStepIndex={activeStepIndex}
          isPlaying={isPlaying}
          onStepSelect={setActiveStepIndex}
          onTogglePlay={handleTogglePlay}
          onReplay={handleReplay}
        />
        <div className="right-column">
          <TutorPanel evaluation={evaluation} feedback={feedback} />
          <MemoryCardPanel card={currentMemoryCard} />
          <ReviewPanel cards={reviewQueue} onStatusChange={handleReviewStatusChange} />
          <LabNotebook entries={entries} />
          <ProjectFeedbackPanel feedbacks={projectFeedbacks} onSubmit={submitProjectFeedback} />
        </div>
      </div>
    </main>
  );
}
