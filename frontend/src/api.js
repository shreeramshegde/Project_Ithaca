import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Update for production
});

// Add a request interceptor to inject the JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerTeam = (data) => api.post('/auth/register', data).then(res => res.data);
export const getGameState = () => api.get('/game/state').then(res => res.data);
export const getQuestions = () => api.get('/game/questions').then(res => res.data);
export const submitPreRound = (data) => api.post('/game/submit-pre-round', data).then(res => res.data);
export const submitAnswer = (data) => api.post('/game/submit-answer', data).then(res => res.data);
export const useHint = (question_id) => api.post('/game/use-hint', { question_id }).then(res => res.data);
export const useReward = (data) => api.post('/game/use-reward', data).then(res => res.data);
export const nextIsland = () => api.post('/game/next-island').then(res => res.data);

export default api;
