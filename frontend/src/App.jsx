import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PromptsPage from './pages/PromptsPage';
import CollectionsPage from './pages/CollectionsPage';
import WorkflowsPage from './pages/WorkflowsPage';
import SharedPrompt from './pages/SharedPrompt';

// Layout
import MainLayout from './components/layout/MainLayout';

function App() {
    const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
            }}>
                <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px' }} />
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/shared/:token" element={<SharedPrompt />} />

            {/* Protected Routes */}
            <Route
                path="/*"
                element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="prompts" element={<PromptsPage />} />
                <Route path="collections" element={<CollectionsPage />} />
                <Route path="workflows" element={<WorkflowsPage />} />
                <Route index element={<Navigate to="/dashboard" />} />
            </Route>
        </Routes>
    );
}

export default App;
