import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Signup } from './pages/Auth/Signup';
import { JobListing } from './pages/Jobs/JobListing';
import { JobDetail } from './pages/Jobs/JobDetail';
import { PostJob } from './pages/Jobs/PostJob';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ApplicationsList } from './pages/Dashboard/ApplicationsList';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute requiredRole="employer">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:jobId"
            element={
              <ProtectedRoute requiredRole="employer">
                <ApplicationsList />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
