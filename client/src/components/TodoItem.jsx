import { useState } from 'react';

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  function startEditing() {
    setDraft(todo.text);
    setEditing(true);
  }

  function saveEdit() {
    const trimmed = draft.trim();
    setEditing(false);
    if (!trimmed) {
      onDelete(todo.id);
    } else if (trimmed !== todo.text) {
      onUpdate(todo.id, { text: trimmed });
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') setEditing(false);
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onUpdate(todo.id, { completed: !todo.completed })}
        aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
      />

      {editing ? (
        <input
          className="edit"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          maxLength={500}
          autoFocus
          aria-label="Edit task"
        />
      ) : (
        <span className="text" onDoubleClick={startEditing} title="Double-click to edit">
          {todo.text}
        </span>
      )}

      <button className="delete" onClick={() => onDelete(todo.id)} aria-label="Delete task">
        ×
      </button>
    </li>
  );
}
