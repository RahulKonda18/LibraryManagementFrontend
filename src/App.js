
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { Home } from './Components/Home';
import { Login, SignUp } from './Components/Auth/index';
import { AdminBooks, AdminSubscribers, RemoveSubscribers, FineCollections } from './Components/Admin/index';
import { Wallet, BorrowHistory } from './Components/Subscriber';
import RoleRoute from './Components/RoleRoute';
import UserInfo from './Components/Debug/UserInfo';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <UserInfo />
          <Header />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin/books" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminBooks />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/subscribers" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <AdminSubscribers />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/remove-subscribers" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <RemoveSubscribers />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/fines" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="ADMIN">
                    <FineCollections />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />
            
            {/* Subscriber Routes */}
            <Route 
              path="/wallet" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="SUBSCRIBER">
                    <Wallet />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/borrow-history" 
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRole="SUBSCRIBER">
                    <BorrowHistory />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
