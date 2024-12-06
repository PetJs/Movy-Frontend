import axios from 'axios';

const axiosInstance = axios.create({
  maxRedirects: 0,
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
    'No-Redirect': 'true'
  },
});

export default axiosInstance;