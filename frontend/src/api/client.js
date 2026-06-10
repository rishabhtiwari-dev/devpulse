import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const fetchUser = (username) => api.get(`/github/user/${username}`);
export const fetchRepos = (username) => api.get(`/github/repos/${username}`);
export const fetchLanguages = (username) => api.get(`/github/languages/${username}`);
export const fetchActivity = (username) => api.get(`/github/activity/${username}`);
export const fetchInsights = (payload) => api.post('/insights/analyze', payload);
