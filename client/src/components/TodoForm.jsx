import { useState } from 'react';

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

/**
 * TodoForm — collapsible add-todo form
 */
export default function TodoForm({ onSubmit, isLoading }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === 'title' || field === 'dueDate') setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!form.dueDate) {
      setError('Due date is required');
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: new Date(`${form.dueDate}T12:00:00.000Z`).toISOString(),
    };

    onSubmit(payload, {
      onSuccess: () => {
        setForm(defaultForm);
        setIsExpanded(false);
      },
      onError: (err) => {
        setError(err.message);
      },
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300">
      {/* Collapsed trigger */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left group"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
            <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-sm text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            Add a new todo...
          </span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Title */}
          <div>
            <input
              autoFocus
              type="text"
              placeholder="What needs to be done? *"
              value={form.title}
              onChange={handleChange('title')}
              className={[
                'w-full px-4 py-3 text-sm rounded-xl border bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all',
                error
                  ? 'border-red-400 dark:border-red-500'
                  : 'border-slate-200 dark:border-slate-700',
              ].join(' ')}
            />
            {error && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
            )}
          </div>

          {/* Description */}
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={handleChange('description')}
            rows={2}
            className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
          />

          {/* Priority + Due Date */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={handleChange('priority')}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                {PRIORITY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.dueDate}
                onChange={handleChange('dueDate')}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Todo'
              )}
            </button>
            <button
              type="button"
              onClick={() => { setIsExpanded(false); setForm(defaultForm); setError(''); }}
              className="px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
