interface StudentInputPanelProps {
  reactionInput: string;
  expectation: string;
  onReactionInputChange: (value: string) => void;
  onExpectationChange: (value: string) => void;
  onRun: () => void;
}

export function StudentInputPanel({
  reactionInput,
  expectation,
  onReactionInputChange,
  onExpectationChange,
  onRun
}: StudentInputPanelProps) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">学生输入</p>
        <h2>描述实验与预测现象</h2>
      </div>
      <label className="field">
        <span>实验或反应描述</span>
        <input
          value={reactionInput}
          onChange={(event) => onReactionInputChange(event.target.value)}
          placeholder="例如：碳酸钙和稀盐酸反应后通入澄清石灰水"
        />
      </label>
      <label className="field">
        <span>我预测会看到</span>
        <textarea
          value={expectation}
          onChange={(event) => onExpectationChange(event.target.value)}
          placeholder="例如：会产生气泡，澄清石灰水变浑浊"
          rows={4}
        />
      </label>
      <button className="primary-button" type="button" onClick={onRun}>
        生成实验反馈
      </button>
    </section>
  );
}
