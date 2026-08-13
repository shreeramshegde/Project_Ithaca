import { request } from './client.js';

function withToken(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function getGameState(token) {
  return request('/api/game/state', {
    headers: withToken(token),
  });
}

export function submitPreRound(token, payload) {
  return request('/api/game/submit-pre-round', {
    method: 'POST',
    headers: withToken(token),
    body: JSON.stringify(payload),
  });
}

export function submitAnswer(token, payload) {
  return request('/api/game/submit-answer', {
    method: 'POST',
    headers: withToken(token),
    body: JSON.stringify(payload),
  });
}

export function useHint(token) {
  return request('/api/game/use-hint', {
    method: 'POST',
    headers: withToken(token),
  });
}

export function useReward(token, payload) {
  return request('/api/game/use-reward', {
    method: 'POST',
    headers: withToken(token),
    body: JSON.stringify(payload),
  });
}
