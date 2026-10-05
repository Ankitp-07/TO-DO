import TodoItem from './TodoItem';
import EmptyState from './EmptyState';
import SkeletonList from './SkeletonList';

/**
 * TodoList — renders the list of todos, skeleton states, or empty state
 */
export default function TodoList({
  todos,
  isLoading,
  filter,
  hasSearch,
  onToggle,
  onDelete,
  onUpdate,
}) {
  if (isLoading) {
    return <SkeletonList count={4} />;
  }

  if (!todos || todos.length === 0) {
    return <EmptyState filter={filter} hasSearch={hasSearch} />;
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
