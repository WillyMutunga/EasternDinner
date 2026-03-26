import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
console.log('Current API URL:', API_URL);


const api = axios.create({
    baseURL: API_URL
});

export default api;
export { API_URL };
