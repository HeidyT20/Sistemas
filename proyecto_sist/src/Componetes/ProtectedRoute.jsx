import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const auth = localStorage.getItem('auth');
  if (!auth) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;