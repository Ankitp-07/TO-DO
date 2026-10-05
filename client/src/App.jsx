import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTodos } from './hooks/useTodos';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import SearchBar from './components/SearchBar';

const SORT_OPTIONS = [
  { value: 'createdAt_desc', label: 'Newest first' },
  { value: 'createdAt_asc', label: 'Oldest first' },
  { value: 'dueDate_asc', label: 'Due date' },
  { value: 'priority_desc', label: 'Priority' },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [filter, setFilter] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('createdAt_desc');

  // Persist dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Debounce search — 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const {
    todos,
    isLoading,
    isFetching,
    error,
    refetch,
    createTodo,
    isCreating,
    updateTodo,
    toggleTodo,
    deleteTodo,
    deleteCompleted,
    isDeletingCompleted,
  } = useTodos({
    status: filter,
    search: debouncedSearch,
    sort,
  });

  // Counts for filter tabs — derived from ALL todos (filter=all) fetched separately
  // To keep it simple: compute from current todos + track separately if needed.
  // For accurate counts, we fetch counts from all three states.
  const { todos: allTodos } = useTodos({ status: 'all', sort });
  const counts = useMemo(() => {
    const all = allTodos.length;
    const completed = allTodos.filter((t) => t.completed).length;
    const active = all - completed;
    return { all, active, completed };
  }, [allTodos]);

  const hasCompletedTodos = counts.completed > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Ambient orb decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              My Todos
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {counts.active} task{counts.active !== 1 ? 's' : ''} remaining
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode((d) => !d)}
              title="Toggle dark mode"
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        {/* ─── Add Todo Form ───────────────────────────────────────────────── */}
        <div className="mb-6">
          <TodoForm onSubmit={createTodo} isLoading={isCreating} />
        </div>

        {/* ─── Card ────────────────────────────────────────────────────────── */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/80 dark:border-slate-700/80 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 p-5 sm:p-6 space-y-5">
          {/* Filter Tabs */}
          <FilterTabs activeFilter={filter} onChange={setFilter} counts={counts} />

          {/* Search + Clear completed */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <SearchBar value={searchInput} onChange={setSearchInput} />
            </div>
            {hasCompletedTodos && (
              <button
                onClick={() => deleteCompleted()}
                disabled={isDeletingCompleted}
                className="flex-shrink-0 text-xs px-3 py-2.5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all disabled:opacity-50"
              >
                {isDeletingCompleted ? 'Clearing...' : 'Clear completed'}
              </button>
            )}
          </div>

          {/* Subtle fetch indicator */}
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-xs text-indigo-500 dark:text-indigo-400">
              <div className="w-3 h-3 rounded-full border-2 border-indigo-300 dark:border-indigo-700 animate-spin border-t-indigo-500 dark:border-t-indigo-400" />
              Syncing...
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.924-.834-2.694 0L3.072 16.5C2.302 18.333 3.264 19 4.806 19z" />
                </svg>
                {error.message}
              </div>
              <button
                onClick={() => refetch()}
                className="text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Todo List */}
          <TodoList
            todos={todos}
            isLoading={isLoading}
            filter={filter}
            hasSearch={!!debouncedSearch}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />

          {/* Footer count */}
          {todos.length > 0 && (
            <p className="text-xs text-center text-slate-400 dark:text-slate-600 pt-2">
              Showing {todos.length} todo{todos.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
