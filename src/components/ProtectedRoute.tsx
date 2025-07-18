// src/components/ProtectedRoute.tsx
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChange, isAdmin } from '../firebase';
import AdminLoginModal from './admin/AdminLoginModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      
      if (!user || !isAdmin(user)) {
        setShowLoginModal(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return (
      <>
        <Navigate to="/" replace />
        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={handleLoginClose}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;