import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserInfo = () => {
  const { user, isAuthenticated, token } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '250px'
    }}>
      <div><strong>Debug Info:</strong></div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User Role: {user?.role || 'None'}</div>
      <div>User ID: {user?.id || 'None'}</div>
      <div>Username: {user?.username || 'None'}</div>
      <div>Name: {user?.name || 'None'}</div>
      <div>Wallet: ₹{user?.walletBalance || 0}</div>
      <div>Token: {token ? 'Present' : 'None'}</div>
    </div>
  );
};

export default UserInfo;
