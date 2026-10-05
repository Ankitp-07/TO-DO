import { useState } from 'react';

const PRIORITY_CONFIG = {
  low: {
    label: 'Low',
    classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium',
    classes: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  high: {
    label: 'High',
    classes: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date();
}

// Convert date string to "YYYY-MM-DD" for HTML date input
function toInputDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * TodoItem — a single todo row with toggle, edit, and delete
 */
export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [editDueDate, setEditDueDate] = useState(toInputDate(todo.dueDate));
  const [editError, setEditError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const priority = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium;
  const overdue = isOverdue(todo.dueDate, todo.completed);

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setEditPriority(todo.priority || 'medium');
    setEditDueDate(toInputDate(todo.dueDate));
    setEditError('');
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError('Title is required');
      return;
    }
    if (!editDueDate) {
      setEditError('Due date is required');
      return;
    }

    setIsSaving(true);
    setEditError('');
    try {
      const payload = {
        title: editTitle.trim(),
        description: editDesc.trim(),
        priority: editPriority,
        dueDate: new Date(`${editDueDate}T12:00:00.000Z`).toISOString(),
      };

      await onUpdate({ id: todo._id, payload });
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message || 'Failed to update todo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setEditPriority(todo.priority || 'medium');
    setEditDueDate(toInputDate(todo.dueDate));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-indigo-400/80 dark:border-indigo-500/80 shadow-lg p-5 space-y-4 transition-all">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/60">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Task
          </span>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            title="Cancel editing"
          >
            <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Title input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            autoFocus
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Description input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Add details (optional)"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
          />
        </div>

        {/* Priority & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={editDueDate}
              onChange={(e) => {
                setEditDueDate(e.target.value);
                if (editError) setEditError('');
              }}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Validation Error Message */}
        {editError && (
          <p className="text-xs text-red-500 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/40">
            {editError}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={isSaving || !editTitle.trim() || !editDueDate}
            className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        'group bg-white dark:bg-slate-800 rounded-2xl border p-4 flex items-start gap-4 transition-all duration-200 hover:shadow-md',
        todo.completed
          ? 'border-slate-100 dark:border-slate-700 opacity-60'
          : 'border-slate-200 dark:border-slate-700',
      ].join(' ')}
    >
      {/* Toggle checkbox */}
      <button
        onClick={() => onToggle(todo._id)}
        className={[
          'mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200',
          todo.completed
            ? 'bg-indigo-600 border-indigo-600'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400',
        ].join(' ')}
        title={todo.completed ? 'Mark as active' : 'Mark as complete'}
      >
        {todo.completed && (
          <svg className="w-3 h-3 text-white" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            'text-sm font-medium leading-snug break-words',
            todo.completed
              ? 'line-through text-slate-400 dark:text-slate-500'
              : 'text-slate-800 dark:text-slate-200',
          ].join(' ')}
        >
          {todo.title}
        </p>

        {todo.description && (
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500 break-words line-clamp-2">
            {todo.description}
          </p>
        )}

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Priority badge */}
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${priority.classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>

          {/* Due date */}
          {todo.dueDate && (
            <span
              className={[
                'text-xs px-2 py-0.5 rounded-full',
                overdue
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-semibold'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
              ].join(' ')}
            >
              {overdue ? '⚠ ' : '📅 '}{formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      {/* Actions — ALWAYS clearly visible */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={handleStartEdit}
          title="Edit Task (Title, Description, Priority, Due Date)"
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-xl transition-all border border-indigo-200/60 dark:border-indigo-800/60 shadow-xs cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(todo._id)}
          title="Delete Task"
          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
