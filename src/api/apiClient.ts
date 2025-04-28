import axios from 'axios';

// Create a basic axios instance
export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Example API functions for todos
export const todosApi = {
  getTodos: async () => {
    const response = await apiClient.get('/todos?_limit=5');
    return response.data;
  },
  
  getTodoById: async (id: number) => {
    const response = await apiClient.get(`/todos/${id}`);
    return response.data;
  },
  
  getTodosByPage: async (page: number, limit: number = 10) => {
    const response = await apiClient.get(`/todos?_page=${page}&_limit=${limit}`);
    return {
      data: response.data,
      totalCount: parseInt(response.headers['x-total-count'] || '0'),
      hasMore: response.data.length === limit,
    };
  },
  
  createTodo: async (todo: { title: string; completed: boolean; userId: number }) => {
    const response = await apiClient.post('/todos', todo);
    return response.data;
  },
  
  updateTodo: async (id: number, updates: Partial<{ title: string; completed: boolean }>) => {
    const response = await apiClient.patch(`/todos/${id}`, updates);
    return response.data;
  },
  
  deleteTodo: async (id: number) => {
    await apiClient.delete(`/todos/${id}`);
    return id;
  },
};

// Example API functions for posts
export const postsApi = {
  getPosts: async () => {
    const response = await apiClient.get('/posts?_limit=5');
    return response.data;
  },
  
  getPostById: async (id: number) => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },
  
  getPostsByPage: async (page: number, limit: number = 10) => {
    const response = await apiClient.get(`/posts?_page=${page}&_limit=${limit}`);
    return {
      data: response.data,
      totalCount: parseInt(response.headers['x-total-count'] || '0'),
      hasMore: response.data.length === limit,
    };
  },
  
  getPostComments: async (postId: number) => {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
  },
  
  createPost: async (post: { title: string; body: string; userId: number }) => {
    const response = await apiClient.post('/posts', post);
    return response.data;
  },
};