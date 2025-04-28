import React from 'react';
import { Link } from 'react-router-dom';
import { Database, MousePointerClick, Server, AlertOctagon, RefreshCw, BookOpen } from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

const installCode = `npm install @tanstack/react-query`;
const setupCode = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  )
}`;

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          TanStack Query v6 Guide
        </h1>
        <p className="text-xl text-muted-foreground">
          A practical guide to TanStack Query's most used features
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Installation & Setup</h2>
        <CodeBlock code={installCode} language="bash" title="Install TanStack Query" />
        <CodeBlock code={setupCode} title="Basic Setup" />
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Core Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/basic-query" className="card hover:border-primary/50 transition-colors">
            <div className="p-6 flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <Database size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg">Basic Fetching</h3>
                <p className="text-muted-foreground mt-1">
                  Learn how to fetch data with useQuery and replace traditional fetch patterns
                </p>
              </div>
            </div>
          </Link>

          <Link to="/mutations" className="card hover:border-primary/50 transition-colors">
            <div className="p-6 flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <MousePointerClick size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg">Data Mutations</h3>
                <p className="text-muted-foreground mt-1">
                  Handle form submissions and data updates with useMutation
                </p>
              </div>
            </div>
          </Link>

          <Link to="/cache" className="card hover:border-primary/50 transition-colors">
            <div className="p-6 flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <Server size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg">Cache Management</h3>
                <p className="text-muted-foreground mt-1">
                  Learn to invalidate queries and update cache directly
                </p>
              </div>
            </div>
          </Link>

          <Link to="/error-handling" className="card hover:border-primary/50 transition-colors">
            <div className="p-6 flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <AlertOctagon size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg">Error Handling</h3>
                <p className="text-muted-foreground mt-1">
                  Handle loading and error states during fetching and mutations
                </p>
              </div>
            </div>
          </Link>

          <Link to="/pagination" className="card hover:border-primary/50 transition-colors">
            <div className="p-6 flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <RefreshCw size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg">Pagination & Infinite</h3>
                <p className="text-muted-foreground mt-1">
                  Implement pagination and infinite scroll with useInfiniteQuery
                </p>
              </div>
            </div>
          </Link>

          <Link to="/devtools" className="card hover:border-primary/50 transition-colors">
            <div className="p-6 flex items-start space-x-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-medium text-lg">DevTools</h3>
                <p className="text-muted-foreground mt-1">
                  Debug and inspect queries with the React Query DevTools
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-2xl font-semibold mb-4">Why TanStack Query?</h2>
        <p className="mb-4">
          TanStack Query (formerly React Query) solves one of the biggest challenges in React applications: 
          fetching, caching, synchronizing, and updating server state.
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Automatic caching and background refetching</li>
          <li>Deduplication of identical requests</li>
          <li>Optimistic UI updates</li>
          <li>Prefetching data before it's needed</li>
          <li>Handling loading and error states automatically</li>
          <li>Automatic retry on error with exponential back-off</li>
        </ul>
        <p>
          This guide covers the essential features with real-world examples to help you quickly implement 
          TanStack Query in your projects.
        </p>
      </div>
    </div>
  );
};

export default HomePage;