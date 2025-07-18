import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogGrid from '../components/blog/BlogGrid';
import BlogSidebar from '../components/blog/BlogSidebar';
import { incrementViewCount } from '../firebase';

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for dynamic background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleReadMore = async (postId: string) => {
    // Increment view count when user clicks to read more
    await incrementViewCount(postId);
    navigate(`/blog/${postId}`);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePostClick = async (postId: string) => {
    await incrementViewCount(postId);
    navigate(`/blog/${postId}`);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen">
      {/* Dynamic Hero Section */}
      <div 
        className={`relative transition-all duration-1000 ${
          scrolled ? 'h-32' : 'h-96'
        }`}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        {/* Hero Content */}
        <div 
          className={`relative z-10 flex items-center justify-center h-full transition-all duration-1000 ${
            scrolled ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="text-center text-white animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Blog</h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
              Artículos y recursos sobre salud integrativa
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Filter */}
          {selectedCategory && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Filtrando por:</span>
                    <span className="px-3 py-1 bg-pink-400 text-white rounded-full text-sm font-semibold">
                      {selectedCategory}
                    </span>
                  </div>
                  <button
                    onClick={clearCategoryFilter}
                    className="text-gray-500 hover:text-gray-700 text-sm underline"
                  >
                    Mostrar todas
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Blog Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-800">
                <BlogGrid
                  selectedCategory={selectedCategory}
                  onReadMore={handleReadMore}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="animate-in fade-in slide-in-from-right-6 duration-1000">
                <BlogSidebar
                  onCategoryClick={handleCategoryClick}
                  onPostClick={handlePostClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;