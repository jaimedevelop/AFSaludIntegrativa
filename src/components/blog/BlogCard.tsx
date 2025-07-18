// src/components/BlogCard.tsx
import React from 'react';
import { Heart, Share2, Eye, Calendar } from 'lucide-react';
import { incrementLikeCount, timestampToDate } from '../../firebase';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    featuredImage: string;
    publishDate: any;
    viewCount: number;
    likeCount: number;
    tags: string[];
  };
  onReadMore: (postId: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
  const [likes, setLikes] = React.useState(post.likeCount);
  const [isLiking, setIsLiking] = React.useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiking) return;
    
    setIsLiking(true);
    const result = await incrementLikeCount(post.id);
    if (result.success) {
      setLikes(prev => prev + 1);
    }
    setIsLiking(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href + `/${post.id}`,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href + `/${post.id}`);
    }
  };

  const formatDate = (timestamp: any) => {
    const date = timestampToDate(timestamp);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      {/* Featured Image */}
      <div className="relative overflow-hidden">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Category Tag */}
        <div className="absolute top-3 left-3">
          <span className="inline-block px-3 py-1 bg-pink-400 text-white text-xs font-semibold rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          {formatDate(post.publishDate)}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-400 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {/* Engagement */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center text-gray-500 hover:text-pink-400 transition-colors"
            >
              <Share2 className="w-4 h-4 mr-1" />
              <span className="text-sm">Share</span>
            </button>
            
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="flex items-center text-gray-500 hover:text-pink-400 transition-colors"
            >
              <Heart className={`w-4 h-4 mr-1 ${isLiking ? 'animate-pulse' : ''}`} />
              <span className="text-sm">{likes}</span>
            </button>
            
            <div className="flex items-center text-gray-500">
              <Eye className="w-4 h-4 mr-1" />
              <span className="text-sm">{post.viewCount}</span>
            </div>
          </div>

          {/* Read More Button */}
          <button
            onClick={() => onReadMore(post.id)}
            className="px-4 py-2 bg-pink-400 text-white text-sm font-semibold rounded-md hover:bg-pink-500 transition-colors"
          >
            READ MORE
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;