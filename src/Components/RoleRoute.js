import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  
  if (user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default RoleRoute;
