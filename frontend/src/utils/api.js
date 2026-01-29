import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // Fail after 5 seconds if server is down
});

// Helper to safely run API calls
const safeRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.warn("API Request Failed:", error.message);
    return null; // Return null so the app doesn't crash
  }
};

// 1. Get List 
export const fetchRestaurants = (params) => {
  return safeRequest(api.get('/getRestaurent', { params }));
};

// 2. Get Trends
export const fetchTrends = (id, params) => {
  return safeRequest(api.get(`/${id}/trends`, { params }));
};

// 3. Get Top 3
export const fetchTopRestaurants = (params) => {
  return safeRequest(api.get('/top', { params }));
};