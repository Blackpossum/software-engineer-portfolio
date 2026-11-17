export function CaseList({ items }: { items: string[] }) {
  return (
    <ul className="case-list">
      {items.map((item) => (
        <li className="case-li" key={item}>
          <span className="case-bullet" />
          <span className="case-li-text">{item}</span>
        </li>
      ))}
    </ul>
  );
}
