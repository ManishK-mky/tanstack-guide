import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { todosApi, postsApi } from '../api/apiClient';
import CodeBlock from '../components/CodeBlock';

const DevToolsPage: React.FC = () => {
  // Load some queries to populate DevTools
  useQuery({ queryKey: ['todos'], queryFn: todosApi.getTodos });
  useQuery({ queryKey: ['posts'], queryFn: postsApi.getPosts });
  
  const setupCode = `// 1. Install DevTools
npm install @tanstack/react-query-devtools

// 2. Import and add to your app
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}`;

  const customPositionCode = `// Custom positioning
<ReactQueryDevtools 
  initialIsOpen={false} 
  buttonPosition="bottom-right"
  position="bottom"
/>`;

  const productionUsageCode = `// For production usage with code splitting
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

function App() {
  const [queryClient] = useState(() => new QueryClient())
  const [showDevtools, setShowDevtools] = useState(false)

  React.useEffect(() => {
    // Only load in development
    if (process.env.NODE_ENV === 'development') {
      const loadDevTools = async () => {
        const { ReactQueryDevtools } = await import('@tanstack/react-query-devtools')
        setShowDevtools(true)
      }
      loadDevTools()
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {showDevtools && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}`;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">TanStack Query DevTools</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Learn how to use the DevTools for debugging and inspecting your queries
      </p>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Setting Up DevTools</h2>
        <p className="mb-4 text-muted-foreground">
          The DevTools are included as a separate package and are easy to add to your application.
        </p>
        <CodeBlock code={setupCode} title="DevTools Setup" />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Customizing DevTools</h2>
        <p className="mb-4 text-muted-foreground">
          You can customize the appearance and behavior of the DevTools with various props.
        </p>
        <CodeBlock code={customPositionCode} title="Custom DevTools Config" />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Using in Production</h2>
        <p className="mb-4 text-muted-foreground">
          For production, it's best to only include the DevTools in development builds to avoid shipping unnecessary code.
        </p>
        <CodeBlock code={productionUsageCode} title="Production Usage" />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">DevTools Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M2 12c0-3.37 2.72-6.49 7-7.96"/><path d="M22 12c0 4.418-4.477 8-10 8s-10-3.582-10-8"/></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Query Explorer</h3>
            <p className="text-muted-foreground">
              Explore all queries in your application, their status, and refresh them manually.
            </p>
          </div>

          <div className="card p-6">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 18a6 6 0 0 0 0-12v12z"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Query Status</h3>
            <p className="text-muted-foreground">
              See the status of each query - fresh, stale, fetching, paused, inactive, or in error state.
            </p>
          </div>

          <div className="card p-6">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Data Inspection</h3>
            <p className="text-muted-foreground">
              Inspect the data returned by each query, helpful for debugging and understanding API responses.
            </p>
          </div>

          <div className="card p-6">
            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10 text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Manual Actions</h3>
            <p className="text-muted-foreground">
              Manually refetch, invalidate, reset, or remove queries to test different states of your app.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Active DevTools</h2>
        <div className="card p-6 bg-muted/30">
          <div className="mb-4 text-center">
            <p className="text-muted-foreground">
              The DevTools are active on this page! Look for the floating TanStack Query logo button in the bottom-right corner of the page.
            </p>
          </div>
          <div className="aspect-video border rounded-lg p-6 flex items-center justify-center bg-muted/30">
            <div className="text-center">
              <div className="inline-block animate-pulse bg-primary/10 text-primary p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
              </div>
              <p className="text-lg font-medium mb-2">Click the TanStack Query DevTools Button</p>
              <p className="text-muted-foreground">
                In the bottom-right corner to open the DevTools panel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>DevTools help visualize the state of all queries and mutations in your app</li>
          <li>You can see which queries are active, stale, or in error state</li>
          <li>Manually trigger refetching, invalidation, or reset queries for testing</li>
          <li>Inspect query data and errors to debug issues</li>
          <li>Use conditional imports to only include DevTools in development builds</li>
        </ul>
      </div>
    </div>
  );
};

export default DevToolsPage;