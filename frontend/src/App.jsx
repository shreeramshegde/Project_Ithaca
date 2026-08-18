import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import Victory from './pages/Victory';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/register" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/play" />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/play" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/victory" element={<ProtectedRoute><Victory /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
