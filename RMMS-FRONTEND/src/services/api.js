// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach Authorization Token to every outgoing request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or wherever your token is stored
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;