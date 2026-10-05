import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { todosApi } from '../api/todos';

const TODOS_KEY = 'todos';

/**
 * Custom hook that encapsulates all server-state logic for todos.
 * Uses TanStack Query v5.
 *
 * @param {{ status: string, search: string, sort: string }} filters
 */
export function useTodos(filters = {}) {
  const queryClient = useQueryClient();

  // ── Query ────────────────────────────────────────────────────────────────
  const query = useQuery({
    queryKey: [TODOS_KEY, filters],
    queryFn: () => todosApi.getAll(filters),
    staleTime: 1000 * 30, // 30 seconds
  });

  // ── Create ───────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload) => todosApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });

  // ── Update ───────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => todosApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });

  // ── Toggle (optimistic) ───────────────────────────────────────────────────
  const toggleMutation = useMutation({
    mutationFn: (id) => todosApi.toggle(id),

    // Optimistically flip the completed flag
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_KEY] });

      const previousData = queryClient.getQueriesData({ queryKey: [TODOS_KEY] });

      queryClient.setQueriesData({ queryKey: [TODOS_KEY] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((todo) =>
            todo._id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        };
      });

      return { previousData };
    },

    // Rollback on error
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });

  // ── Delete (optimistic) ────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id) => todosApi.remove(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: [TODOS_KEY] });

      const previousData = queryClient.getQueriesData({ queryKey: [TODOS_KEY] });

      queryClient.setQueriesData({ queryKey: [TODOS_KEY] }, (old) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.filter((todo) => todo._id !== id),
          count: (old.count || 0) - 1,
        };
      });

      return { previousData };
    },

    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });

  // ── Delete Completed ──────────────────────────────────────────────────────
  const deleteCompletedMutation = useMutation({
    mutationFn: () => todosApi.removeCompleted(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODOS_KEY] });
    },
  });

  return {
    // Data
    todos: query.data?.data ?? [],
    count: query.data?.count ?? 0,

    // Status
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,

    // Mutations
    createTodo: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    updateTodo: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    toggleTodo: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,

    deleteTodo: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,

    deleteCompleted: deleteCompletedMutation.mutate,
    isDeletingCompleted: deleteCompletedMutation.isPending,
  };
}
