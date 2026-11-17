type Props = {
  className?: string;
  leadFirst?: boolean;
  stats: Stat[];
};

type Stat = {
  countTo?: number;
  label: string;
  sub: string;
  suffix?: string;
  value: string;
};

export function StatsGrid({
  className = "stats-grid",
  leadFirst,
  stats,
}: Props) {
  return (
    <div className={className}>
      {stats.map((stat, index) => {
        const counter = countOf(stat);
        return (
          <div
            className={
              leadFirst && index === 0
                ? "stat-card stat-card-lead"
                : "stat-card"
            }
            key={stat.label}
          >
            <div
              className="stat-number"
              data-count={counter?.count}
              data-suffix={counter?.suffix}
            >
              {stat.value}
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

// "3+ yrs" counts up to 3 and keeps "+ yrs"; values like "1 of 5" or "1,081" stay static.
function countOf(stat: Stat) {
  if (stat.countTo !== undefined) {
    return { count: stat.countTo, suffix: stat.suffix ?? "" };
  }
  const match = /^(\d+)(\D*)$/.exec(stat.value);
  return match ? { count: Number(match[1]), suffix: match[2] } : null;
}
