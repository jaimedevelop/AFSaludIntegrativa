// src/components/BlogGrid.tsx
import React, { useState, useEffect } from 'react';
import BlogCard from './BlogCard';
import { getAllBlogPosts, getPostsByCategory } from '../../firebase';

interface BlogGridProps {
  selectedCategory?: string;
  onReadMore: (postId: string) => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({ selectedCategory, onReadMore }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching posts...', { selectedCategory });
        
        let result;
        if (selectedCategory) {
          result = await getPostsByCategory(selectedCategory);
        } else {
          result = await getAllBlogPosts();
        }

        console.log('Posts result:', result);

        if (result.error) {
          console.error('Error from Firebase:', result.error);
          setError(result.error);
        } else {
          console.log('Posts fetched successfully:', result.posts);
          setPosts(result.posts);
        }
      } catch (err) {
        console.error('Exception while fetching posts:', err);
        setError('Error loading blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-lg font-medium">Error al cargar las entradas</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">
            {selectedCategory ? `No hay entradas en "${selectedCategory}"` : 'No hay entradas disponibles'}
          </p>
          <p className="text-sm text-gray-600">
            {selectedCategory ? 'Intenta con otra categoría' : 'Las entradas aparecerán aquí cuando estén disponibles'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedCategory && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Categoría: {selectedCategory}
          </h2>
          <p className="text-gray-600">{posts.length} entradas encontradas</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <BlogCard
            key={post.id}
            post={post}
            onReadMore={onReadMore}
          />
        ))}
      </div>
    </div>
  );
};

export default BlogGrid;