interface NotebookEntry {
  id: string;
  experimentTitle: string;
  expectation: string;
  status: string;
  insight: string;
  nextStep: string;
  skillTags: string[];
}

interface LabNotebookProps {
  entries: NotebookEntry[];
}

export function LabNotebook({ entries }: LabNotebookProps) {
  return (
    <section className="panel notebook-panel">
      <div className="panel-heading">
        <p className="eyebrow">学习轨迹</p>
        <h2>本次实验记录</h2>
      </div>
      {entries.length === 0 ? (
        <p className="muted">生成一次实验反馈后，这里会记录学生预测与智能体判断。</p>
      ) : (
        <ul className="notebook-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.experimentTitle}</strong>
              <span>{entry.expectation || "未填写预测"}</span>
              <small>{entry.status}</small>
              <p>{entry.insight}</p>
              <p>{entry.nextStep}</p>
              <div className="tag-row">
                {entry.skillTags.map((tag) => (
                  <em key={tag}>{tag}</em>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
