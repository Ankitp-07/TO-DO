/**
 * EmptyState — shown when the todo list has no items to display
 */
export default function EmptyState({ filter, hasSearch }) {
  const getMessage = () => {
    if (hasSearch) {
      return {
        emoji: '🔍',
        title: 'No results found',
        subtitle: 'Try a different search term',
      };
    }
    if (filter === 'active') {
      return {
        emoji: '🎉',
        title: 'No active todos!',
        subtitle: "Everything's done — you're crushing it.",
      };
    }
    if (filter === 'completed') {
      return {
        emoji: '📋',
        title: 'Nothing completed yet',
        subtitle: 'Complete a todo and it will show up here.',
      };
    }
    return {
      emoji: '✨',
      title: 'Your list is empty',
      subtitle: 'Add your first todo above to get started.',
    };
  };

  const { emoji, title, subtitle } = getMessage();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center select-none">
      <div className="text-5xl mb-4 animate-bounce">{emoji}</div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-500">{subtitle}</p>
    </div>
  );
}
