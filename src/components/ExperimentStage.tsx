import type { CSSProperties } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { Experiment, VisualTimelineStep } from "../domain/types";

interface ExperimentStageProps {
  experiment: Experiment;
  timeline: VisualTimelineStep[];
  activeStepIndex: number;
  isPlaying: boolean;
  onStepSelect: (index: number) => void;
  onTogglePlay: () => void;
  onReplay: () => void;
}

const bubbleCounts: Record<VisualTimelineStep["scene"]["bubbleIntensity"], number> = {
  none: 0,
  soft: 3,
  medium: 6,
  strong: 10,
};

const phaseLabels: Record<VisualTimelineStep["phase"], string> = {
  setup: "准备",
  reaction: "反应",
  observation: "观察",
  test: "检验",
  conclusion: "结论",
};

export function ExperimentStage({
  experiment,
  timeline,
  activeStepIndex,
  isPlaying,
  onStepSelect,
  onTogglePlay,
  onReplay,
}: ExperimentStageProps) {
  const activeStep = timeline[activeStepIndex] ?? timeline[0];
  const scene = activeStep.scene;
  const bubbles = Array.from({ length: bubbleCounts[scene.bubbleIntensity] }, (_, index) => index);
  const visualStyle = {
    "--accent": experiment.visual.accent,
    "--liquid": scene.liquidColor,
    "--secondary-liquid": scene.secondaryLiquidColor ?? experiment.visual.liquidAfter,
  } as CSSProperties;

  return (
    <section className="panel stage-panel">
      <div className="stage-header">
        <div className="panel-heading">
          <p className="eyebrow">可视化实验台</p>
          <h2>{experiment.title}</h2>
        </div>
        <div className="playback-controls" aria-label="实验播放控制">
          <button type="button" className="icon-button" onClick={onTogglePlay} aria-label={isPlaying ? "暂停" : "播放"}>
            {isPlaying ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </button>
          <button type="button" className="icon-button" onClick={onReplay} aria-label="重播">
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={`visual-stage ${scene.vessel}`} style={visualStyle}>
        <div className="apparatus-area">
          <div className={`apparatus ${scene.vessel} ${scene.temperature ?? "normal"}`}>
            <div className="vessel-shell">
              <div className={`liquid-fill ${scene.turbidity} ${scene.colorChange ?? "none"}`} />
              {scene.solid && scene.solid !== "none" ? <span className={`solid-sample ${scene.solid}`} /> : null}
              <div className="bubble-layer" aria-hidden="true">
                {bubbles.map((bubble) => (
                  <span key={bubble} className={`stage-bubble bubble-${bubble % 5}`} />
                ))}
              </div>
            </div>
            {scene.vessel === "gas-generator" ? (
              <>
                <div className="delivery-tube" aria-hidden="true" />
                <div className="test-vessel">
                  <div className={`liquid-fill secondary ${scene.turbidity}`} />
                  {scene.turbidity === "cloudy" ? <span className="cloudiness" /> : null}
                </div>
              </>
            ) : null}
            {scene.flame !== "none" ? <span className={`flame ${scene.flame}`} aria-label="带火星木条复燃" /> : null}
          </div>
        </div>

        <aside className="active-observation">
          <span>{phaseLabels[activeStep.phase]}</span>
          <h3>{activeStep.title}</h3>
          <p>{activeStep.instruction}</p>
          <strong>{activeStep.observationCue}</strong>
          <em>{activeStep.knowledgeTag}</em>
        </aside>
      </div>

      <div className="timeline-steps" aria-label="实验步骤时间线">
        {timeline.map((step, index) => (
          <button
            type="button"
            key={step.id}
            className={index === activeStepIndex ? "timeline-step active" : "timeline-step"}
            onClick={() => onStepSelect(index)}
            aria-current={index === activeStepIndex ? "step" : undefined}
          >
            <span>{index + 1}</span>
            <strong>{step.title}</strong>
            <small>{phaseLabels[step.phase]}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
