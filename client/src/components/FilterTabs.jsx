const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

/**
 * FilterTabs — switches between All / Active / Completed views
 */
export default function FilterTabs({ activeFilter, onChange, counts }) {
  return (
    <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
      {TABS.map((tab) => {
        const isActive = activeFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              isActive
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
            ].join(' ')}
          >
            {tab.label}
            {counts?.[tab.id] !== undefined && (
              <span
                className={[
                  'text-xs px-1.5 py-0.5 rounded-full font-semibold',
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
                ].join(' ')}
              >
                {counts[tab.id]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
