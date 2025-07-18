// src/components/BlogSidebar.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Tag } from 'lucide-react';
import { 
  getRecentBlogPosts, 
  getMandatoryReadingPosts, 
  getAllCategories,
  timestampToDate 
} from '../../firebase';

interface BlogSidebarProps {
  onCategoryClick: (category: string) => void;
  onPostClick: (postId: string) => void;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ onCategoryClick, onPostClick }) => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [mandatoryPosts, setMandatoryPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [recentResult, mandatoryResult, categoriesResult] = await Promise.all([
          getRecentBlogPosts(5),
          getMandatoryReadingPosts(),
          getAllCategories()
        ]);

        if (recentResult.error) {
          console.error('Error fetching recent posts:', recentResult.error);
        } else {
          setRecentPosts(recentResult.posts);
        }

        if (mandatoryResult.error) {
          console.error('Error fetching mandatory posts:', mandatoryResult.error);
        } else {
          setMandatoryPosts(mandatoryResult.posts);
        }

        if (categoriesResult.error) {
          console.error('Error fetching categories:', categoriesResult.error);
        } else {
          setCategories(categoriesResult.categories);
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  const formatDate = (timestamp: any) => {
    const date = timestampToDate(timestamp);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const SidebarSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 text-pink-400 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const PostItem = ({ post, showImage = false }) => (
    <div 
      className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
      onClick={() => onPostClick(post.id)}
    >
      {showImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          {post.title}
        </h4>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(post.publishDate)}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full max-w-sm space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Recent Entries */}
      <SidebarSection title="Entradas Recientes" icon={Calendar}>
        {recentPosts.length > 0 ? (
          <div className="space-y-1">
            {recentPosts.map(post => (
              <PostItem key={post.id} post={post} showImage={true} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay entradas recientes</p>
        )}
      </SidebarSection>

      {/* Mandatory Reading */}
      <SidebarSection title="Lectura Obligada" icon={BookOpen}>
        {mandatoryPosts.length > 0 ? (
          <div className="space-y-1">
            {mandatoryPosts.map(post => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay lecturas obligatorias</p>
        )}
      </SidebarSection>

      {/* Categories */}
      <SidebarSection title="Categorías" icon={Tag}>
        {categories.length > 0 ? (
          <div className="space-y-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onCategoryClick(category)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-pink-400 hover:bg-pink-50 rounded-md transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No hay categorías disponibles</p>
        )}
      </SidebarSection>
    </div>
  );
};

export default BlogSidebar;