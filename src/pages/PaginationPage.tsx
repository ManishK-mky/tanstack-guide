import React, { useState } from 'react';
import { 
  useQuery, 
  useInfiniteQuery,
  useQueryClient
} from '@tanstack/react-query';
import { postsApi } from '../api/apiClient';
import CodeBlock from '../components/CodeBlock';
import { ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const PaginationPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const queryClient = useQueryClient();

  // Regular pagination query
  const {
    data: paginatedData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ['posts', page, pageSize],
    queryFn: () => postsApi.getPostsByPage(page, pageSize),
    keepPreviousData: true, // Keep previous data while fetching new page
  });

  // Infinite query
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: infiniteStatus,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => postsApi.getPostsByPage(pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
  });

  // Prefetch next page
  const prefetchNextPage = () => {
    if (paginatedData?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ['posts', page + 1, pageSize],
        queryFn: () => postsApi.getPostsByPage(page + 1, pageSize),
      });
    }
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Pagination & Infinite Scroll</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Learn how to implement pagination and infinite scrolling with TanStack Query
      </p>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Standard Pagination</h2>
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Posts</h3>
            {isFetching && !isLoading && (
              <span className="text-sm text-primary">Loading...</span>
            )}
          </div>

          {isLoading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : isError ? (
            <div className="py-8 text-center text-destructive">Error: {error.message}</div>
          ) : (
            <>
              <ul className="space-y-4 mb-6">
                {paginatedData?.data.map((post: Post) => (
                  <li key={post.id} className="p-4 border rounded-md bg-background">
                    <h4 className="font-medium mb-2 line-clamp-1">{post.title}</h4>
                    <p className="text-muted-foreground text-sm line-clamp-2">{post.body}</p>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <span className="text-sm text-muted-foreground">
                  Page {page}
                </span>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!paginatedData?.hasMore}
                  onMouseEnter={prefetchNextPage}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
        
        <CodeBlock 
          code={`import { useQuery, useQueryClient } from '@tanstack/react-query'

function PostList() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()
  
  // Query with pagination params
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['posts', page], // Page included in query key
    queryFn: () => fetchPosts(page),
    keepPreviousData: true, // Show old data while loading new
  })
  
  // Prefetch the next page
  useEffect(() => {
    if (data?.hasNextPage) {
      queryClient.prefetchQuery({
        queryKey: ['posts', page + 1],
        queryFn: () => fetchPosts(page + 1),
      })
    }
  }, [data, page, queryClient])
  
  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data.posts.map(post => (
            <PostItem key={post.id} post={post} />
          ))}
          
          <div>
            <button
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1}
            >
              Previous Page
            </button>
            
            <span>Page {page}</span>
            
            <button
              onClick={() => setPage(old => old + 1)}
              disabled={!data.hasNextPage}
            >
              Next Page
            </button>
          </div>
          
          {/* Show loading indicator while fetching next page */}
          {isFetching && <div>Loading...</div>}
        </>
      )}
    </div>
  )
}`} 
          title="Standard Pagination Pattern"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Infinite Scroll</h2>
        <div className="card p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Infinite Posts</h3>
            {isFetchingNextPage && (
              <span className="text-sm text-primary">Loading more...</span>
            )}
          </div>

          {infiniteStatus === 'pending' ? (
            <div className="py-8 text-center">Loading...</div>
          ) : infiniteStatus === 'error' ? (
            <div className="py-8 text-center text-destructive">Error loading data</div>
          ) : (
            <>
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto p-2">
                {infiniteData?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.data.map((post: Post) => (
                      <div key={post.id} className="p-4 border rounded-md bg-background">
                        <h4 className="font-medium mb-2 line-clamp-1">{post.title}</h4>
                        <p className="text-muted-foreground text-sm line-clamp-2">{post.body}</p>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>

              <div className="text-center">
                <button
                  className="btn btn-primary"
                  onClick={() => fetchNextPage()}
                  disabled={!hasNextPage || isFetchingNextPage}
                >
                  {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                    ? 'Load More'
                    : 'No more posts'}
                  {hasNextPage && <ArrowDown size={16} className="ml-2" />}
                </button>
              </div>
            </>
          )}
        </div>
        
        <CodeBlock 
          code={`import { useInfiniteQuery } from '@tanstack/react-query'

function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNextPage ? allPages.length + 1 : undefined
    },
  })
  
  return (
    <div>
      {status === 'pending' ? (
        <div>Loading...</div>
      ) : status === 'error' ? (
        <div>Error loading data</div>
      ) : (
        <>
          {/* Render all pages */}
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.posts.map(post => (
                <PostItem key={post.id} post={post} />
              ))}
            </React.Fragment>
          ))}
          
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Load More'
              : 'No more posts'}
          </button>
        </>
      )}
    </div>
  )
}`} 
          title="Infinite Query Pattern"
        />
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Intersection Observer for Automatic Loading</h2>
        <CodeBlock 
          code={`import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

function InfinitePostsWithObserver() {
  // Create an observer to detect when user scrolls to bottom
  const { ref, inView } = useInView()
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNextPage ? allPages.length + 1 : undefined
    },
  })
  
  // Load next page when user scrolls to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage])
  
  return (
    <div>
      {status === 'pending' ? (
        <div>Loading...</div>
      ) : status === 'error' ? (
        <div>Error loading data</div>
      ) : (
        <div className="posts-container">
          {data.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.posts.map(post => (
                <PostItem key={post.id} post={post} />
              ))}
            </React.Fragment>
          ))}
          
          {/* Loading indicator at bottom - observer watches this */}
          <div ref={ref} className="loading-indicator">
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? '' : 'No more posts'}
          </div>
        </div>
      )}
    </div>
  )
}`} 
          title="IntersectionObserver for Auto-Loading"
        />
      </div>

      <div className="card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Include pagination variables in the queryKey to properly cache each page</li>
          <li>Use keepPreviousData to show previous data while loading the next page</li>
          <li>Prefetch the next page for a smoother UX</li>
          <li>Use useInfiniteQuery for infinite scroll with getNextPageParam to determine if there are more pages</li>
          <li>Combine with Intersection Observer API for automatic loading when scrolling</li>
          <li>Consider using a placeholder or skeleton UI while loading new pages</li>
        </ul>
      </div>
    </div>
  );
};

export default PaginationPage;