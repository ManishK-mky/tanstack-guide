import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { todosApi, apiClient } from '../api/apiClient';
import CodeBlock from '../components/CodeBlock';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// Force an error in the API call
const fetchWithError = async (): Promise<Todo[]> => {
  // This URL will 404
  const response = await apiClient.get('/non-existent-endpoint');
  return response.data;
};

const createWithError = async (todo: any): Promise<Todo> => {
  // This will also fail
  const response = await apiClient.post('/non-existent-endpoint', todo);
  return response.data;
};

const ErrorHandlingPage: React.FC = () => {
  const [queryErrorShown, setQueryErrorShown] = useState(false);
  const [mutationErrorShown, setMutationErrorShown] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Basic query - will succeed
  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.getTodos,
  });

  // Query with error handling
  const errorQuery = useQuery({
    queryKey: ['todos-error'],
    queryFn: fetchWithError,
    enabled: queryErrorShown,
    retry: retryCount,
    onError: (error) => {
      console.error('Query error:', error);
    },
  });

  // Mutation with error handling
  const mutation = useMutation({
    mutationFn: createWithError,
    onError: (error) => {
      console.error('Mutation error:', error);
    },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Error and Loading State Management</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Learn how to handle loading and error states during fetching and mutations
      </p>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Loading States</h2>
        <div className="card p-6 mb-4">
          <h3 className="text-lg font-medium mb-4">Available Loading Indicators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Query Loading States</h4>
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>isLoading</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    todosQuery.isLoading ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {todosQuery.isLoading ? 'true' : 'false'}
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>isFetching</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    todosQuery.isFetching ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {todosQuery.isFetching ? 'true' : 'false'}
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>isInitialLoading</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    todosQuery.isInitialLoading ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {todosQuery.isInitialLoading ? 'true' : 'false'}
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Mutation Loading States</h4>
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>isPending</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mutation.isPending ? 'bg-primary/20 text-primary' : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {mutation.isPending ? 'true' : 'false'}
                  </span>
                </li>
                <li className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <span>isSuccess</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    mutation.isSuccess ? 'bg-success/20 text-success' : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {mutation.isSuccess ? 'true' : 'false'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
          
        <CodeBlock 
          code={`// In a component
function TodosList() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })

  if (isLoading) return <LoadingSpinner />

  // Show stale data and loading indicator for subsequent refetches
  return (
    <div>
      {data.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
      {isFetching && <div>Refreshing...</div>}
    </div>
  )
}`} 
          title="Using Loading States"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Error Handling in Queries</h2>
        <div className="card p-6 mb-4">
          <div className="mb-4">
            <div className="flex gap-4 items-center mb-4">
              <button 
                className="btn btn-primary"
                onClick={() => setQueryErrorShown(!queryErrorShown)}
              >
                {queryErrorShown ? 'Hide' : 'Show'} Error Query
              </button>
              
              <div className="flex items-center gap-2">
                <span>Retries:</span>
                <select 
                  value={retryCount} 
                  onChange={(e) => setRetryCount(Number(e.target.value))}
                  className="px-2 py-1 border rounded-md bg-background"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
            
            {queryErrorShown && (
              <div className="p-3 border rounded-md bg-background">
                <div className="mb-2">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 ${
                    errorQuery.isError ? 'text-destructive' : 
                    errorQuery.isLoading ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {errorQuery.isError ? 'Error' : 
                     errorQuery.isLoading ? 'Loading' : 'Idle'}
                  </span>
                </div>
                
                {errorQuery.isError && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md">
                    Error: {errorQuery.error.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <CodeBlock 
          code={`// Basic error handling
const { data, error, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

if (isError) {
  return <div>Error: {error.message}</div>
}

// Custom error handling
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  onError: (error) => {
    console.error('Query failed:', error)
    // Show toast notification
    toast.error(\`Failed to fetch: \${error.message}\`)
  },
  retry: 3, // Retry 3 times before showing error
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
})`} 
          title="Error Handling in Queries"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Error Handling in Mutations</h2>
        <div className="card p-6 mb-4">
          <div className="mb-4">
            <button 
              className="btn btn-primary mb-4"
              onClick={() => {
                setMutationErrorShown(true);
                mutation.mutate({ title: 'Test Todo', completed: false, userId: 1 });
              }}
              disabled={mutation.isPending}
            >
              Run Error Mutation
            </button>
            
            {mutationErrorShown && (
              <div className="p-3 border rounded-md bg-background">
                <div className="mb-2">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 ${
                    mutation.isError ? 'text-destructive' : 
                    mutation.isPending ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {mutation.isError ? 'Error' : 
                     mutation.isPending ? 'Loading' : 'Idle'}
                  </span>
                </div>
                
                {mutation.isError && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md">
                    Error: {mutation.error.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <CodeBlock 
          code={`// Basic mutation error handling
const mutation = useMutation({
  mutationFn: createTodo,
  onError: (error) => {
    console.error('Mutation failed:', error)
  },
})

// Using error in the UI
function CreateTodoForm() {
  const mutation = useMutation({
    mutationFn: createTodo,
  })
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      mutation.mutate({ title: 'New Todo' })
    }}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Todo'}
      </button>
      
      {mutation.isError && (
        <div>Error: {mutation.error.message}</div>
      )}
    </form>
  )
}`} 
          title="Error Handling in Mutations"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Global Error Handling</h2>
        <CodeBlock 
          code={`// In your app setup
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Global error handler
      console.error(
        \`Something went wrong: \${error.message}, Query: \${query.queryKey}\`
      )
      
      // Show a toast notification
      toast.error(
        \`Something went wrong: \${error.message}\`
      )
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // Global mutation error handler
      toast.error(
        \`Mutation failed: \${error.message}\`
      )
    },
  }),
})`} 
          title="Global Error Handlers"
        />
      </div>

      <div className="card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Use isLoading, isFetching, and isPending to show appropriate loading states</li>
          <li>Handle errors at the component level with isError and error properties</li>
          <li>Use onError callbacks for custom error handling</li>
          <li>Configure retry behavior to automatically retry failed requests</li>
          <li>Implement global error handling with QueryCache and MutationCache</li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorHandlingPage;