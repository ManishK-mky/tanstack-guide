import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { todosApi } from '../api/apiClient';
import ComparisonBlock from '../components/ComparisonBlock';
import CodeBlock from '../components/CodeBlock';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

// Traditional fetch component using useState and useEffect
const TraditionalFetch: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-destructive">Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Traditional Fetch Results:</h3>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="p-3 border rounded-md bg-background">
            <span className={todo.completed ? "line-through text-success" : ""}>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// TanStack Query fetch component
const QueryFetch: React.FC = () => {
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.getTodos,
  });

  if (isLoading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-destructive">Error: {error.message}</div>;

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">TanStack Query Results:</h3>
      <ul className="space-y-2">
        {todos.map((todo: Todo) => (
          <li key={todo.id} className="p-3 border rounded-md bg-background flex items-center">
            <span className={`flex-1 ${todo.completed ? "line-through text-success" : ""}`}>
              {todo.title}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-muted">ID: {todo.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const basicQueryCode = `// Basic query example
const { data, isLoading, error } = useQuery({
  queryKey: ['todos'],
  queryFn: () => fetch('/api/todos').then(res => res.json()),
})`;

const parametersCode = `// Query with parameters
const { data: todo } = useQuery({
  queryKey: ['todo', todoId], // Include parameters in queryKey
  queryFn: () => fetchTodoById(todoId),
  enabled: !!todoId, // Only run when todoId exists
})`;

const queryOptionsCode = `// Common query options
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 1000 * 60 * 5, // 5 minutes - how long data is considered fresh
  gcTime: 1000 * 60 * 10,   // 10 minutes - how long to keep inactive data in cache
  refetchOnWindowFocus: true, // Refetch when window regains focus
  refetchOnMount: true,     // Refetch when component mounts
  refetchOnReconnect: true, // Refetch when browser regains connection
  retry: 3,                 // Retry failed requests 3 times
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
})`;

const traditionalCode = `import { useState, useEffect } from 'react'

function TodosList() {
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/todos')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setTodos(data)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTodos()
  }, [])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}`;

const queryCode = `import { useQuery } from '@tanstack/react-query'

function TodosList() {
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}`;

const BasicQueryPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Basic Data Fetching with useQuery</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Learn how to fetch data with useQuery and say goodbye to useEffect fetch boilerplate
      </p>

      <ComparisonBlock
        title="Fetching Data"
        description="Compare the traditional useState/useEffect approach with TanStack Query's useQuery hook for fetching data."
        traditionalCode={traditionalCode}
        queryCode={queryCode}
        benefits={[
          "Automatic loading and error states",
          "Built-in caching - no duplicate requests",
          "Automatic background refetching",
          "Automatic garbage collection",
          "No need for cleanup functions",
          "Fewer lines of code with better separation of concerns"
        ]}
      />

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Live Example</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="p-6">
              <TraditionalFetch />
            </div>
          </div>
          <div className="card">
            <div className="p-6">
              <QueryFetch />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Basic Query Syntax</h2>
        <CodeBlock code={basicQueryCode} />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Queries with Parameters</h2>
        <p className="mb-4 text-muted-foreground">
          When your queries depend on variables, include them in the queryKey array to ensure proper caching.
        </p>
        <CodeBlock code={parametersCode} />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Common Query Options</h2>
        <p className="mb-4 text-muted-foreground">
          TanStack Query provides many options to customize query behavior.
        </p>
        <CodeBlock code={queryOptionsCode} />
      </div>

      <div className="card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>useQuery replaces useState + useEffect for data fetching</li>
          <li>The queryKey uniquely identifies your query and is used for caching</li>
          <li>Always include dependencies in the queryKey array</li>
          <li>TanStack Query provides status indicators (isLoading, isError) out of the box</li>
          <li>Data is automatically cached and can be shared between components</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicQueryPage;