import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleRoute = ({ children, allowedRole }) => {
  const { isAdmin, isSubscriber } = useAuth();
  
  // Check if user has the required role
  const hasRequiredRole = 
    (allowedRole === 'ADMIN' && isAdmin) || 
    (allowedRole === 'SUBSCRIBER' && isSubscriber);
  
  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default RoleRoute;
