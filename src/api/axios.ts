import axios from 'axios';

const axiosInstance = axios.create({
  maxRedirects: 0,
  baseURL: 'https://movy-backend.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
    'No-Redirect': 'true'
  },
});

export default axiosInstance;