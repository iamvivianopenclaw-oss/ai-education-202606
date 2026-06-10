import { Check, RotateCcw } from "lucide-react";
import type { MemoryCard, ReviewStatus } from "../domain/types";

interface ReviewPanelProps {
  cards: MemoryCard[];
  onStatusChange: (cardId: string, status: ReviewStatus) => void;
}

export function ReviewPanel({ cards, onStatusChange }: ReviewPanelProps) {
  const reviewCards = cards.slice(0, 4);

  return (
    <section className="panel review-panel">
      <div className="panel-heading">
        <p className="eyebrow">间隔复习</p>
        <h2>今日复习队列</h2>
      </div>
      {reviewCards.length === 0 ? (
        <p className="muted">生成记忆卡片后，复习任务会按“待复习、未掌握、已掌握”的顺序出现在这里。</p>
      ) : (
        <ul className="review-list">
          {reviewCards.map((card) => (
            <li key={card.id}>
              <div className="review-card-main">
                <strong>{card.experimentTitle}</strong>
                <span>{card.mnemonic}</span>
                <small>状态：{statusLabels[card.status]}</small>
              </div>
              <div className="review-actions">
                <button type="button" className="review-button mastered" onClick={() => onStatusChange(card.id, "mastered")}>
                  <Check size={16} aria-hidden="true" />
                  记住了
                </button>
                <button type="button" className="review-button due" onClick={() => onStatusChange(card.id, "due")}>
                  <RotateCcw size={16} aria-hidden="true" />
                  还不熟
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const statusLabels: Record<ReviewStatus, string> = {
  new: "新卡",
  due: "待复习",
  mastered: "已掌握",
};
