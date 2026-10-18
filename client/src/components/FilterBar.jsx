const FILTER_LABELS = { all: 'All', active: 'Active', completed: 'Completed' };

export default function FilterBar({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}) {
  return (
    <footer className="filter-bar">
      <span className="count">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <div className="filters">
        {Object.entries(FILTER_LABELS).map(([key, label]) => (
          <button
            key={key}
            className={filter === key ? 'active' : ''}
            onClick={() => onFilterChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <button className="clear" onClick={onClearCompleted} disabled={completedCount === 0}>
        Clear completed
      </button>
    </footer>
  );
}
