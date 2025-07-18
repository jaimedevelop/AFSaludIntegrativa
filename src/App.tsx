// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './pages/Inicio';
import Blog from './pages/Blog';
import BlogPost from './components/blog/BlogPost';
import Enfoque from './pages/Enfoque';
import Contacto from './pages/Contacto';
import AdminDashboard from './components/admin/AdminDashboard';
import PostEditor from './components/blog/PostEditor';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Admin Routes - No Header */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/editor" element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/editor/:postId" element={
            <ProtectedRoute>
              <PostEditor />
            </ProtectedRoute>
          } />
          
          {/* Public Routes - With Header */}
          <Route path="/" element={
            <>
              <Header />
              <Inicio />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Header />
              <Blog />
            </>
          } />
          <Route path="/blog/:postId" element={
            <>
              <Header />
              <BlogPost />
            </>
          } />
          <Route path="/enfoque" element={
            <>
              <Header />
              <Enfoque />
            </>
          } />
          <Route path="/contacto" element={
            <>
              <Header />
              <Contacto />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
