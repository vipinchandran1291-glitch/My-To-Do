import { useEffect, useState } from 'react';
import { api } from './api.js';
import TodoInput from './components/TodoInput.jsx';
import TodoList from './components/TodoList.jsx';
import FilterBar from './components/FilterBar.jsx';

const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .list()
      .then(setTodos)
      .catch((err) => setError(`Could not load tasks: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  // Run an API call and surface any error in the banner.
  async function run(action) {
    setError('');
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  }

  const addTodo = (text) =>
    run(async () => {
      const todo = await api.create(text);
      setTodos((prev) => [todo, ...prev]);
    });

  const updateTodo = (id, changes) =>
    run(async () => {
      const updated = await api.update(id, changes);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    });

  const deleteTodo = (id) =>
    run(async () => {
      await api.remove(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    });

  const clearCompleted = () =>
    run(async () => {
      await api.clearCompleted();
      setTodos((prev) => prev.filter((t) => !t.completed));
    });

  const visibleTodos = todos.filter(FILTERS[filter]);
  const activeCount = todos.filter(FILTERS.active).length;
  const completedCount = todos.length - activeCount;

  return (
    <main className="app">
      <h1>To-Do</h1>

      <div className="card">
        <TodoInput onAdd={addTodo} />

        {error && (
          <div className="error" role="alert">
            {error}
            <button onClick={() => setError('')} aria-label="Dismiss error">×</button>
          </div>
        )}

        {loading ? (
          <p className="empty">Loading…</p>
        ) : (
          <TodoList
            todos={visibleTodos}
            filter={filter}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
          />
        )}

        {todos.length > 0 && (
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <p className="hint">Double-click a task to edit it.</p>
    </main>
  );
}
