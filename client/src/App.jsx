import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppShell } from './components/AppShell/AppShell.jsx';
import { AuthProvider, ThemeProvider, useAuth } from './state/index.jsx';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner.jsx';
import HomePage from './pages/HomePage.jsx';
import GenerateStoryPage from './pages/GenerateStoryPage.jsx';
import AdventureModePage from './pages/AdventureModePage.jsx';
import StoryHistoryPage from './pages/StoryHistoryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function RequireAuth({ children }) {
  const { token, authReady } = useAuth();

  if (!authReady) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <LoadingSpinner label="Checking your session..." />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generate" element={<RequireAuth><GenerateStoryPage /></RequireAuth>} />
            <Route path="/adventure" element={<RequireAuth><AdventureModePage /></RequireAuth>} />
            <Route path="/history" element={<RequireAuth><StoryHistoryPage /></RequireAuth>} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <ToastContainer position="bottom-right" />
        </AppShell>
      </ThemeProvider>
    </AuthProvider>
  );
}


