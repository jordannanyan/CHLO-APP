import axios from "axios";

const BASE_URL = 'http://localhost:3001';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {return Promise.reject(error);
    }
);