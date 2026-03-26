import axios from 'axios';

// Determine API URL based on environment
let API_URL;

if (import.meta.env.MODE === 'production') {
    // Production: use the correct Render backend URL
    API_URL = 'https://dinner-backend-1khi.onrender.com';
} else {
    // Development: use localhost
    API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
}

console.log('Current API URL:', API_URL);


const api = axios.create({
    baseURL: API_URL
});

export default api;
export { API_URL };
