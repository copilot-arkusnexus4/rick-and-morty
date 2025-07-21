import React from 'react';
import Login from './views/Login/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './views/Home/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;