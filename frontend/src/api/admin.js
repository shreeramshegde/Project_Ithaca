import { request } from './client.js';

function encodeBasicAuth(username, password) {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

export function getLeaderboard(auth) {
  return request('/api/admin/leaderboard', {
    headers: {
      Authorization: encodeBasicAuth(auth.username, auth.password),
    },
  });
}

export function adjustYears(auth, payload) {
  return request('/api/admin/adjust-years', {
    method: 'POST',
    headers: {
      Authorization: encodeBasicAuth(auth.username, auth.password),
    },
    body: JSON.stringify(payload),
  });
}

export function freezeGame(auth) {
  return request('/api/admin/freeze', {
    method: 'GET',
    headers: {
      Authorization: encodeBasicAuth(auth.username, auth.password),
    },
  });
}

export function unfreezeGame(auth) {
  return request('/api/admin/unfreeze', {
    method: 'GET',
    headers: {
      Authorization: encodeBasicAuth(auth.username, auth.password),
    },
  });
}

export function getFreezeStatus(auth) {
  return request('/api/admin/freeze-status', {
    method: 'GET',
    headers: {
      Authorization: encodeBasicAuth(auth.username, auth.password),
    },
  });
}
