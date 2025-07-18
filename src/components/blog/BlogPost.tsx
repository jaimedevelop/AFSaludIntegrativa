// src/components/BlogPost.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Eye, 
  Heart, 
  Share2, 
  Tag,
  Clock
} from 'lucide-react';
import { 
  getBlogPost, 
  incrementLikeCount, 
  getRecentBlogPosts,
  timestampToDate 
} from '../../firebase';
import BlogSidebar from './BlogSidebar';

const BlogPost: React.FC = () => {
  console.log('BlogPost component rendering...');
  const { postId } = useParams();
  console.log('URL params postId:', postId);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likes, setLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    console.log('BlogPost component mounted with postId:', postId);
    if (postId) {
      fetchPost();
    } else {
      console.error('No postId found in URL params');
      setError('No post ID provided');
      setLoading(false);
    }
  }, [postId]);

  const fetchPost = async () => {
    console.log('Fetching post with ID:', postId);
    setLoading(true);
    try {
      const result = await getBlogPost(postId);
      console.log('Post fetch result:', result);
      if (result.error) {
        console.error('Error fetching post:', result.error);
        setError(result.error);
      } else {
        console.log('Post loaded successfully:', result.post);
        setPost(result.post);
        setLikes(result.post.likeCount || 0);
      }
    } catch (err) {
      console.error('Exception while fetching post:', err);
      setError('Error loading blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiking || !post) return;
    
    setIsLiking(true);
    const result = await incrementLikeCount(post.id);
    if (result.success) {
      setLikes(prev => prev + 1);
    }
    setIsLiking(false);
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/blog?category=${category}`);
  };

  const handlePostClick = (postId: string) => {
    navigate(`/blog/${postId}`);
  };

  const formatDate = (timestamp: any) => {
    const date = timestampToDate(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: any) => {
    const date = timestampToDate(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Post no encontrado'}
            </h1>
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center space-x-2 mx-auto px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Blog</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Back Button */}
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Blog</span>
            </button>

            {/* Post Header */}
            <header className="mb-8">
              {/* Category */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-pink-400 text-white text-sm font-semibold rounded-full">
                  {post.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(post.publishDate)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>{post.viewCount || 0} visualizaciones</span>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center space-x-2 mb-6">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                        onClick={() => handleCategoryClick(tag)}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Actions */}
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Compartir</span>
                </button>
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isLiking ? 'animate-pulse' : ''}`} />
                  <span>{likes} Me gusta</span>
                </button>
              </div>
            </header>

            {/* Featured Image */}
            {post.featuredImage && (
              <div className="mb-8">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-xl text-gray-700 leading-relaxed mb-8 pb-8 border-b border-gray-200 italic">
                  {post.excerpt}
                </div>
              )}

              {/* Main Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-pink-600 prose-strong:text-gray-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Mandatory Reading Badge */}
            {post.isMandatoryReading && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-2">
                  <span className="text-pink-600 font-semibold">📚 Lectura Obligatoria</span>
                </div>
                <p className="text-pink-700 text-sm mt-1">
                  Este artículo ha sido marcado como lectura esencial.
                </p>
              </div>
            )}

            {/* Comments Section Placeholder */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Comentarios</h3>
              <div className="text-center text-gray-500 py-12">
                <p className="text-lg mb-2">¡Nos encantaría escuchar tu opinión!</p>
                <p className="text-sm">
                  La sección de comentarios estará disponible próximamente.
                </p>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <BlogSidebar
                onCategoryClick={handleCategoryClick}
                onPostClick={handlePostClick}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;