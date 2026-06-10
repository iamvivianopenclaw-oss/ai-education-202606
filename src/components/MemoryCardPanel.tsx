import { useEffect, useState } from "react";
import type { MemoryCard } from "../domain/types";

interface MemoryCardPanelProps {
  card?: MemoryCard;
}

type RevealKey = "recall" | "judgment" | "shortAnswer";

const initialRevealState: Record<RevealKey, boolean> = {
  recall: false,
  judgment: false,
  shortAnswer: false,
};

export function MemoryCardPanel({ card }: MemoryCardPanelProps) {
  const [revealed, setRevealed] = useState(initialRevealState);

  useEffect(() => {
    setRevealed(initialRevealState);
  }, [card?.id]);

  function toggleReveal(key: RevealKey) {
    setRevealed((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <section className="panel memory-card-panel">
      <div className="panel-heading">
        <p className="eyebrow">记忆卡片</p>
        <h2>实验证据复盘</h2>
      </div>
      {!card ? (
        <p className="muted">生成一次实验反馈后，这里会自动整理关键现象、方程式和复习提示。</p>
      ) : (
        <article className="memory-card">
          <header>
            <strong>{card.experimentTitle}</strong>
            <span>{card.mnemonic}</span>
          </header>

          <div className="memory-section">
            <h3>关键现象</h3>
            <ul className="phenomena-list">
              {card.keyPhenomena.map((phenomenon) => (
                <li key={phenomenon}>{phenomenon}</li>
              ))}
            </ul>
          </div>

          <div className="memory-section">
            <h3>方程式</h3>
            <p className="equation">{card.equation}</p>
          </div>

          <div className="reveal-grid">
            <RevealBlock
              title="回忆提示"
              prompt={card.recallPrompts[0]?.question ?? "回忆这个实验的关键证据链。"}
              answer={card.recallPrompts.map((prompt) => `${prompt.question} ${prompt.answer}`).join("；")}
              revealed={revealed.recall}
              onToggle={() => toggleReveal("recall")}
            />
            <RevealBlock
              title="误区判断"
              prompt={card.misconceptionPrompt.statement}
              answer={`${card.misconceptionPrompt.isCorrect ? "正确" : "不正确"}：${card.misconceptionPrompt.explanation}`}
              revealed={revealed.judgment}
              onToggle={() => toggleReveal("judgment")}
            />
            <RevealBlock
              title="简答练习"
              prompt={card.shortAnswerPrompt.question}
              answer={card.shortAnswerPrompt.answer}
              revealed={revealed.shortAnswer}
              onToggle={() => toggleReveal("shortAnswer")}
            />
          </div>
        </article>
      )}
    </section>
  );
}

interface RevealBlockProps {
  title: string;
  prompt: string;
  answer: string;
  revealed: boolean;
  onToggle: () => void;
}

function RevealBlock({ title, prompt, answer, revealed, onToggle }: RevealBlockProps) {
  return (
    <article className="reveal-block">
      <h3>{title}</h3>
      <p>{prompt}</p>
      {revealed ? <strong>{answer}</strong> : <span className="answer-placeholder">先想 10 秒再揭晓</span>}
      <button type="button" className="secondary-button compact-button" onClick={onToggle}>
        {revealed ? "收起答案" : "揭晓答案"}
      </button>
    </article>
  );
}
