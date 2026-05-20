import axios from 'axios';

// Create a configured Axios instance
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach JWT Token
apiClient.interceptors.request.use(
    (config) => {
        const storageItem = localStorage.getItem('auth-storage');
        if (storageItem) {
            const { state } = JSON.parse(storageItem);
            if (state?.token && config.headers) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network error or CORS issue
            console.error('Network/CORS Error:', error);
            // You could display a global toast here if you integrated a toast service
        } else {
            if (error.response.status === 401) {
                // TODO: Handle unauthorized (e.g., redirect to login, clear storage)
                console.error('Unauthorized access - Redirecting to login...');
            }
            if (error.response.status === 403) {
                // TODO: Handle forbidden
                console.error('Forbidden - Access denied.');
            }
        }

        // Enhance the error message for network errors
        const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
        error.message = errorMessage;

        return Promise.reject(error);
    }
);
