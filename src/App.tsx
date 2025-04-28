import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BasicQueryPage from './pages/BasicQueryPage';
import MutationsPage from './pages/MutationsPage';
import CacheManagementPage from './pages/CacheManagementPage';
import ErrorHandlingPage from './pages/ErrorHandlingPage';
import PaginationPage from './pages/PaginationPage';
import DevToolsPage from './pages/DevToolsPage';
import { ThemeProvider } from './context/ThemeContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/basic-query" element={<BasicQueryPage />} />
              <Route path="/mutations" element={<MutationsPage />} />
              <Route path="/cache" element={<CacheManagementPage />} />
              <Route path="/error-handling" element={<ErrorHandlingPage />} />
              <Route path="/pagination" element={<PaginationPage />} />
              <Route path="/devtools" element={<DevToolsPage />} />
            </Routes>
          </Layout>
        </Router>
        <ReactQueryDevtools buttonPosition="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;