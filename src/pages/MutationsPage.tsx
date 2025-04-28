import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosApi } from '../api/apiClient';
import ComparisonBlock from '../components/ComparisonBlock';
import CodeBlock from '../components/CodeBlock';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const newTodo = {
  title: 'Learn TanStack Query',
  completed: false,
  userId: 1,
};

// Traditional mutation component
const TraditionalMutation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdTodo, setCreatedTodo] = useState<Todo | null>(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);
      
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create todo');
      }
      
      const data = await response.json();
      setCreatedTodo(data);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Traditional Mutation:</h3>
      
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="btn btn-primary btn-md"
      >
        {isLoading ? 'Creating...' : 'Create Todo'}
      </button>
      
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive">
          Error: {error.message}
        </div>
      )}
      
      {success && createdTodo && (
        <div className="p-3 rounded-md bg-success/10 text-success">
          <p>Successfully created todo!</p>
          <pre className="mt-2 p-2 bg-muted rounded-md text-xs">
            {JSON.stringify(createdTodo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// TanStack Query mutation component
const QueryMutation: React.FC = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: todosApi.createTodo,
    onSuccess: () => {
      // Invalidate and refetch the todos list query
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">TanStack Query Mutation:</h3>
      
      <button
        onClick={() => mutation.mutate(newTodo)}
        disabled={mutation.isPending}
        className="btn btn-primary btn-md"
      >
        {mutation.isPending ? 'Creating...' : 'Create Todo'}
      </button>
      
      {mutation.isError && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive">
          Error: {mutation.error.message}
        </div>
      )}
      
      {mutation.isSuccess && (
        <div className="p-3 rounded-md bg-success/10 text-success">
          <p>Successfully created todo!</p>
          <pre className="mt-2 p-2 bg-muted rounded-md text-xs">
            {JSON.stringify(mutation.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const basicMutationCode = `// Basic mutation
const mutation = useMutation({
  mutationFn: (newTodo) => {
    return fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo),
    }).then(res => res.json())
  },
})

// Use the mutation
mutation.mutate({ title: 'Do laundry' })`;

const mutationWithCallbacksCode = `// Mutation with callbacks
const mutation = useMutation({
  mutationFn: createTodo,
  onMutate: (variables) => {
    // Called before the mutation function
    console.log('About to create:', variables)
    
    // Return context that will be passed to onError/onSettled
    return { id: Date.now() }
  },
  onError: (error, variables, context) => {
    // Called if the mutation fails
    console.error('Failed to create todo:', error)
  },
  onSuccess: (data, variables, context) => {
    // Called if the mutation succeeds
    console.log('Successfully created todo:', data)
  },
  onSettled: (data, error, variables, context) => {
    // Called after the mutation completes (success or error)
    console.log('Mutation complete')
  },
})`;

const invalidateAfterMutationCode = `// Invalidate queries after mutation
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})`;

const optimisticUpdateCode = `// Optimistic update
const queryClient = useQueryClient()

const mutation = useMutation({
  mutationFn: updateTodo,
  // When mutate is called:
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos', newTodo.id] })
    
    // Snapshot previous value
    const previousTodo = queryClient.getQueryData(['todos', newTodo.id])
    
    // Optimistically update to the new value
    queryClient.setQueryData(['todos', newTodo.id], newTodo)
    
    // Return context with the previous value
    return { previousTodo }
  },
  // If mutation fails, use context returned from onMutate to roll back
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(
      ['todos', newTodo.id],
      context.previousTodo
    )
  },
  // Always refetch after error or success:
  onSettled: (newTodo) => {
    queryClient.invalidateQueries({ queryKey: ['todos', newTodo.id] })
  },
})`;

const traditionalCode = `import { useState } from 'react'

function CreateTodoForm() {
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create todo')
      }
      
      await response.json()
      setSuccess(true)
      setTitle('')
      
      // Need to manually refetch todos list
      // fetchTodosList()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Todo'}
      </button>
      {error && <div>Error: {error}</div>}
      {success && <div>Todo created successfully!</div>}
    </form>
  )
}`;

const queryCode = `import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateTodoForm() {
  const [title, setTitle] = useState('')
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      }).then(res => {
        if (!res.ok) throw new Error('Failed to create todo')
        return res.json()
      })
    },
    onSuccess: () => {
      // Auto-refetch todos list 
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      setTitle('')
    },
  })
  
  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate({ title, completed: false })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={mutation.isPending}
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Todo'}
      </button>
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
      {mutation.isSuccess && <div>Todo created successfully!</div>}
    </form>
  )
}`;

const MutationsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Data Mutations with useMutation</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Learn how to handle data changes, form submissions, and API updates with the useMutation hook
      </p>

      <ComparisonBlock
        title="Creating Data"
        description="Compare the traditional approach with TanStack Query's useMutation hook for creating data."
        traditionalCode={traditionalCode}
        queryCode={queryCode}
        benefits={[
          "Simplified state management - no manual loading/error states",
          "Built-in mutation lifecycle methods",
          "Automatic integration with the query cache",
          "Support for optimistic updates",
          "Automatic retry logic for failed mutations"
        ]}
      />

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Live Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="p-6">
              <TraditionalMutation />
            </div>
          </div>
          <div className="card">
            <div className="p-6">
              <QueryMutation />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Basic Mutation Syntax</h2>
        <CodeBlock code={basicMutationCode} />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Mutation with Callbacks</h2>
        <p className="mb-4 text-muted-foreground">
          useMutation provides several lifecycle callbacks for handling different stages of the mutation.
        </p>
        <CodeBlock code={mutationWithCallbacksCode} />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Invalidating Queries After Mutation</h2>
        <p className="mb-4 text-muted-foreground">
          One of the most common patterns is to invalidate and refetch queries after a mutation completes successfully.
        </p>
        <CodeBlock code={invalidateAfterMutationCode} />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Optimistic Updates</h2>
        <p className="mb-4 text-muted-foreground">
          Optimistic updates can improve perceived performance by updating the UI before the server responds.
        </p>
        <CodeBlock code={optimisticUpdateCode} />
      </div>

      <div className="card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>useMutation handles create, update, and delete operations</li>
          <li>Callbacks (onMutate, onSuccess, onError, onSettled) give you control over the mutation lifecycle</li>
          <li>Use QueryClient to integrate mutations with your cached queries</li>
          <li>Optimistic updates provide a better user experience by showing changes immediately</li>
          <li>Always handle rollbacks in case optimistic updates fail</li>
        </ul>
      </div>
    </div>
  );
};

export default MutationsPage;