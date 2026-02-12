import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// Create axios instance — cookies are sent automatically via withCredentials
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Response interceptor — automatic token refresh via cookie
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as any;

        // If 401 and we haven't retried yet, attempt silent refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // The refresh_token cookie is sent automatically
                await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                // Retry the original request — new access_token cookie is set
                return apiClient(originalRequest);
            } catch {
                // Refresh failed — reset Zustand state
                // NE PAS rediriger — ProtectedRoute gère la navigation
                import('@/stores/authStore').then(({ useAuthStore }) => {
                    useAuthStore.getState().resetStore();
                });
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    },
);

export default apiClient;
