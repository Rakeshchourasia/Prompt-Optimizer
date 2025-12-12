import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: null,
    workspace: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, workspace, accessToken, refreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        set({ user, workspace, isAuthenticated: true });
        return response.data;
    },

    register: async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        const { user, workspace, accessToken, refreshToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        set({ user, workspace, isAuthenticated: true });
        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            await api.post('/auth/logout', { refreshToken });
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, workspace: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            set({ isLoading: false });
            return;
        }

        try {
            const response = await api.get('/auth/me');
            const { user } = response.data.data;
            set({ user, workspace: user.currentWorkspace, isAuthenticated: true, isLoading: false });
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({ user: null, workspace: null, isAuthenticated: false, isLoading: false });
        }
    },

    setWorkspace: (workspace) => set({ workspace }),
}));

export default useAuthStore;
