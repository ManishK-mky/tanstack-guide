import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { todosApi } from '../api/apiClient';
import CodeBlock from '../components/CodeBlock';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const CacheManagementPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  // Fetch todos
  const { data: todos, isLoading, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.getTodos,
  });

  // Fetch a single todo when selected
  const {
    data: selectedTodo,
    isLoading: isLoadingTodo,
  } = useQuery({
    queryKey: ['todo', selectedTodoId],
    queryFn: () => todosApi.getTodoById(selectedTodoId!),
    enabled: !!selectedTodoId, // Only run query when we have a selectedTodoId
  });

  // Toggle todo completion status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => 
      todosApi.updateTodo(id, { completed }),
    // When mutate is called:
    onMutate: async ({ id, completed }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      await queryClient.cancelQueries({ queryKey: ['todo', id] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos']);
      const previousTodo = queryClient.getQueryData<Todo>(['todo', id]);

      // Optimistically update to the new value
      if (previousTodos) {
        queryClient.setQueryData(['todos'], previousTodos.map(todo => 
          todo.id === id ? { ...todo, completed } : todo
        ));
      }

      if (previousTodo) {
        queryClient.setQueryData(['todo', id], { ...previousTodo, completed });
      }

      // Return a context with the previous value
      return { previousTodos, previousTodo };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, { id }, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos);
      }
      if (context?.previousTodo) {
        queryClient.setQueryData(['todo', id], context.previousTodo);
      }
    },
    // Always refetch after error or success:
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
    },
  });

  const handleToggleTodo = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const invalidateTodosCache = () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  };

  const hardRefetchTodos = () => {
    refetch();
  };

  const setTodoDirectly = () => {
    // Direct cache manipulation
    if (todos && todos.length > 0) {
      const firstTodo = { ...todos[0], title: `Updated at ${new Date().toLocaleTimeString()}` };
      
      // Update in todos list
      queryClient.setQueryData(['todos'], (oldData: Todo[] | undefined) => 
        oldData ? oldData.map(t => t.id === firstTodo.id ? firstTodo : t) : []
      );
      
      // Update in single todo cache if it's the selected one
      if (selectedTodoId === firstTodo.id) {
        queryClient.setQueryData(['todo', firstTodo.id], firstTodo);
      }
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading todos...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Cache Management</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Learn how to invalidate, update, and manipulate the query cache directly
      </p>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Cache Management Actions</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          <button 
            className="btn btn-primary"
            onClick={invalidateTodosCache}
          >
            Invalidate Cache
          </button>
          <button 
            className="btn btn-secondary"
            onClick={hardRefetchTodos}
          >
            Hard Refetch
          </button>
          <button 
            className="btn btn-outline"
            onClick={setTodoDirectly}
          >
            Set Cache Directly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">Todos List (click to select)</h2>
          <div className="card">
            <div className="p-4">
              <ul className="space-y-2">
                {todos?.map((todo: Todo) => (
                  <li 
                    key={todo.id} 
                    className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors flex items-center justify-between ${
                      selectedTodoId === todo.id ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedTodoId(todo.id)}
                  >
                    <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
                      {todo.title}
                    </span>
                    <button
                      className={`px-3 py-1 text-xs rounded-full ${
                        todo.completed 
                          ? 'bg-success/20 text-success' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTodo(todo.id, todo.completed);
                      }}
                    >
                      {todo.completed ? 'Completed' : 'Pending'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Selected Todo Details</h2>
          <div className="card">
            <div className="p-4 min-h-[200px]">
              {!selectedTodoId ? (
                <div className="text-center text-muted-foreground p-8">
                  Select a todo from the list
                </div>
              ) : isLoadingTodo ? (
                <div className="text-center p-8">Loading...</div>
              ) : selectedTodo ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-muted-foreground">ID:</span> 
                    <span className="ml-2 font-mono">{selectedTodo.id}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Title:</span>
                    <div className="mt-1 p-2 bg-muted rounded-md">{selectedTodo.title}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="mt-1">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          selectedTodo.completed 
                            ? 'bg-success/20 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {selectedTodo.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="ml-2">{selectedTodo.userId}</span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm w-full mt-4"
                    onClick={() => handleToggleTodo(selectedTodo.id, selectedTodo.completed)}
                  >
                    Mark as {selectedTodo.completed ? 'Pending' : 'Completed'}
                  </button>
                </div>
              ) : (
                <div className="text-center text-destructive p-8">
                  Todo not found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Invalidating Queries</h2>
        <p className="mb-4 text-muted-foreground">
          The most common way to update cached data is to invalidate queries, which marks them as stale and triggers a refetch.
        </p>
        <CodeBlock 
          code={`// Invalidate a specific query
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Invalidate a specific todo
queryClient.invalidateQueries({ queryKey: ['todo', 1] })

// Invalidate all queries that start with 'todo'
queryClient.invalidateQueries({ queryKey: ['todo'] })

// Invalidate exact queries without affecting others
queryClient.invalidateQueries({ 
  queryKey: ['todos'], 
  exact: true 
})

// Advanced with filters
queryClient.invalidateQueries({
  predicate: (query) => 
    query.queryKey[0] === 'todos' && 
    query.state.dataUpdateCount < 5
})`} 
          title="Invalidating Queries"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Direct Cache Updates</h2>
        <p className="mb-4 text-muted-foreground">
          Sometimes you want to update the cached data without making an API request. This is useful for optimistic updates.
        </p>
        <CodeBlock 
          code={`// Set cache data directly
queryClient.setQueryData(['todos'], todos)

// Update a specific todo in a list
queryClient.setQueryData(['todos'], (old) => 
  old.map(todo => 
    todo.id === 3 
      ? { ...todo, completed: true } 
      : todo
  )
)

// Set cache for a specific todo
queryClient.setQueryData(['todo', 3], {
  id: 3,
  title: 'Updated Todo',
  completed: true,
  userId: 1
})`} 
          title="Direct Cache Updates"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Optimistic Updates</h2>
        <p className="mb-4 text-muted-foreground">
          Optimistic updates let you update the UI immediately before the server responds, then roll back if the request fails.
        </p>
        <CodeBlock 
          code={`const mutation = useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Optimistically update to the new value
    queryClient.setQueryData(['todos'], old => 
      old.map(todo => 
        todo.id === newTodo.id ? newTodo : todo
      )
    )
    
    // Return context with the previous value
    return { previousTodos }
  },
  // If mutation fails, use context from onMutate to roll back
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos)
  },
  // Always refetch after error or success:
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})`} 
          title="Optimistic Updates Pattern"
        />
      </div>

      <div className="card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Use invalidateQueries to mark queries as stale and trigger refetches</li>
          <li>Use setQueryData for direct cache manipulation without API calls</li>
          <li>Implement optimistic updates to improve perceived performance</li>
          <li>Always handle rollbacks for failed optimistic updates</li>
          <li>Remember that cached data is shared across components</li>
        </ul>
      </div>
    </div>
  );
};

export default CacheManagementPage;