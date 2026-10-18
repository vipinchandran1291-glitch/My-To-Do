import TodoItem from './TodoItem.jsx';

const EMPTY_MESSAGES = {
  all: 'No tasks yet. Add one above!',
  active: 'Nothing left to do 🎉',
  completed: 'No completed tasks yet.',
};

export default function TodoList({ todos, filter, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return <p className="empty">{EMPTY_MESSAGES[filter]}</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </ul>
  );
}
