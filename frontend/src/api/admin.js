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
