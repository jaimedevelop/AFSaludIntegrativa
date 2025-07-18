// src/components/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  Tag,
  Heart,
  BarChart3,
  LogOut,
  Home
} from 'lucide-react';
import {  
  deleteBlogPost, 
  updateBlogPost,
  signOutUser,
  timestampToDate 
} from '../../firebase';
import { getAllBlogPostsAdmin } from '../../firebase/database';

const AdminDashboard: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, published, draft, scheduled
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Use admin function to get ALL posts including unpublished
      const result = await getAllBlogPostsAdmin();
      if (result.error) {
        console.error('Error fetching posts:', result.error);
      } else {
        setPosts(result.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/admin/editor');
  };

  const handleEditPost = (post: any) => {
    navigate(`/admin/editor/${post.id}`);
  };

  const handleDelete = async (postId: string, title: string) => {
    if (window.confirm(`¿Estás segura de que quieres eliminar "${title}"?`)) {
      const result = await deleteBlogPost(postId);
      if (result.success) {
        setPosts(posts.filter(post => post.id !== postId));
      } else {
        alert('Error al eliminar el post: ' + result.error);
      }
    }
  };

  const handleTogglePublish = async (post: any) => {
    const updatedData = { isPublished: !post.isPublished };
    const result = await updateBlogPost(post.id, updatedData);
    
    if (result.success) {
      setPosts(posts.map(p => 
        p.id === post.id 
          ? { ...p, isPublished: !p.isPublished }
          : p
      ));
    } else {
      alert('Error al actualizar el post: ' + result.error);
    }
  };

  const handleLogout = async () => {
    const result = await signOutUser();
    if (result.success) {
      navigate('/');
    }
  };

  const getPostStatus = (post: any) => {
    const now = new Date();
    const publishDate = timestampToDate(post.publishDate);
    
    if (!post.isPublished) return 'draft';
    if (publishDate > now) return 'scheduled';
    return 'published';
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return getPostStatus(post) === filter;
  });

  const getStatusBadge = (post: any) => {
    const status = getPostStatus(post);
    const colors = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      published: 'Publicado',
      draft: 'Borrador',
      scheduled: 'Programado'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (timestamp: any) => {
    const date = timestampToDate(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-white rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-white rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona tus entradas del blog</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Ver Sitio</span>
              </button>
              <button
                onClick={handleCreatePost}
                className="flex items-center space-x-2 px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Entrada</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Entradas</p>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-pink-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Publicadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {posts.filter(p => getPostStatus(p) === 'published').length}
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Borradores</p>
                <p className="text-2xl font-bold text-gray-600">
                  {posts.filter(p => getPostStatus(p) === 'draft').length}
                </p>
              </div>
              <Edit3 className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-pink-600">
                  {posts.reduce((sum, post) => sum + (post.likeCount || 0), 0)}
                </p>
              </div>
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'published', label: 'Publicadas' },
            { key: 'draft', label: 'Borradores' },
            { key: 'scheduled', label: 'Programadas' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === key
                  ? 'bg-pink-400 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <Edit3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No hay entradas' : `No hay entradas ${filter === 'published' ? 'publicadas' : filter === 'draft' ? 'en borrador' : 'programadas'}`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' ? 'Crea tu primera entrada para comenzar' : 'Cambia el filtro para ver otras entradas'}
            </p>
            {filter === 'all' && (
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors"
              >
                Crear Primera Entrada
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Featured Image */}
                <div className="h-48 bg-gray-200 relative">
                  {post.featuredImage ? (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(post)}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishDate)}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex items-center space-x-1 mb-3">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.viewCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{post.likeCount || 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`flex items-center justify-center px-3 py-2 rounded-md transition-colors ${
                        post.isPublished
                          ? 'text-orange-700 bg-orange-100 hover:bg-orange-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      className="flex items-center justify-center px-3 py-2 text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;