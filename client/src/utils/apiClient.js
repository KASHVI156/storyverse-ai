import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function createApi(tokenProvider = () => localStorage.getItem('token')) {
  const instance = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

  // IMPORTANT: read token at request-time so auth context state timing/rerenders
  // can’t cause “Missing token” from the backend.
  instance.interceptors.request.use((config) => {
    const token = typeof tokenProvider === 'function' ? tokenProvider() : tokenProvider;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return instance;
}


export const publicApi = axios.create({ baseURL: API_BASE_URL, withCredentials: true });


