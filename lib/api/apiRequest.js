// lib/api/apiRequest.js

import { refreshToken } from './tokenRefresh';

async function sendRequest(method, url, body = null, token = null) {
  const headers = {};
  // console.log("TOKEN =>", token);
  // console.log("URL =>", url);
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    credentials: 'include',
  };

  if (body) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  return fetch(url, options);
}

export default async function apiRequest(
  method,
  url,
  body = null,
  token = null,
) {
  try {
    let response = await sendRequest(method, url, body, token);
    // console.log('url', url);
    // Only refresh if access token expired
    if (response.status === 401 && token) {
      const newToken = await refreshToken();
      // console.log("New Token =>", newToken);

      if (!newToken) {
        return {
          success: false,
          status: 401,
          error: 'Session expired',
        };
      }

      // Retry original request
      response = await sendRequest(method, url, body, newToken);
    }

    let data = {};

    try {
      data = await response.json();
    } catch {}

    return {
      success: response.ok,
      status: response.status,
      data,
      error: data.message || 'Request failed',
    };
  } catch (err) {
    return {
      success: false,
      status: 0,
      error: err.message,
    };
  }
}
