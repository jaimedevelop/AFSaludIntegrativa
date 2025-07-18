// src/components/AdminIntegration.tsx
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { onAuthStateChange, isAdmin } from '../../firebase';
import AdminLoginModal from './AdminLoginModal';
import AdminDashboard from './AdminDashboard';
import PostEditor from '../blog/PostEditor';

type AdminView = 'hidden' | 'dashboard' | 'editor';

const AdminIntegration: React.FC = () => {
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminView, setAdminView] = useState<AdminView>('hidden');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user && isAdmin(user)) {
        setUser(user);
        if (adminView === 'hidden') {
          setAdminView('dashboard');
        }
      } else {
        setUser(null);
        setAdminView('hidden');
        setEditingPost(null);
      }
    });

    return () => unsubscribe();
  }, [adminView]);

  const handleLoginSuccess = () => {
    setAdminView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAdminView('hidden');
    setEditingPost(null);
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setAdminView('editor');
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setAdminView('editor');
  };

  const handleSavePost = () => {
    setEditingPost(null);
    setAdminView('dashboard');
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setAdminView('dashboard');
  };

  // Hidden admin button (only show when not logged in)
  if (!user && adminView === 'hidden') {
    return (
      <>
        {/* Hidden Admin Button - Triple click to show */}
        <div
          className="fixed bottom-4 right-4 opacity-0 hover:opacity-20 transition-opacity duration-300"
          onClick={(e) => {
            if (e.detail === 3) { // Triple click
              setShowLoginModal(true);
            }
          }}
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Login Modal */}
        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  // Show admin dashboard
  if (user && adminView === 'dashboard') {
    return (
      <AdminDashboard
        onCreatePost={handleCreatePost}
        onEditPost={handleEditPost}
        onLogout={handleLogout}
      />
    );
  }

  // Show post editor
  if (user && adminView === 'editor') {
    return (
      <PostEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={handleCancelEdit}
      />
    );
  }

  return null;
};

export default AdminIntegration;