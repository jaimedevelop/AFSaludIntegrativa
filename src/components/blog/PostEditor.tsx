// src/components/PostEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Calendar,
  Tag as TagIcon,
  ArrowLeft,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  createBlogPost, 
  updateBlogPost, 
  getBlogPost,
  uploadImage, 
  getAllCategories 
} from '../../firebase';

const PostEditor: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isMandatoryReading, setIsMandatoryReading] = useState(false);
  const [publishDate, setPublishDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!postId);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveRef = useRef<NodeJS.Timeout>();

  // Load post data if editing
  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  // Load available categories
  useEffect(() => {
    const loadCategories = async () => {
      const result = await getAllCategories();
      if (result.categories) {
        setAvailableCategories(result.categories);
      }
    };
    loadCategories();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (postId) { // Only auto-save for existing posts
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      
      autoSaveRef.current = setTimeout(() => {
        handleAutoSave();
      }, 30000); // Auto-save every 30 seconds

      return () => {
        if (autoSaveRef.current) {
          clearTimeout(autoSaveRef.current);
        }
      };
    }
  }, [title, excerpt, content, tags, category, featuredImage, postId]);

  const loadPost = async () => {
    try {
      const result = await getBlogPost(postId);
      if (result.error) {
        setError(result.error);
        navigate('/admin');
      } else {
        const postData = result.post;
        setPost(postData);
        setTitle(postData.title || '');
        setExcerpt(postData.excerpt || '');
        setContent(postData.content || '');
        setFeaturedImage(postData.featuredImage || '');
        setTags(postData.tags || []);
        setCategory(postData.category || '');
        setIsPublished(postData.isPublished || false);
        setIsMandatoryReading(postData.isMandatoryReading || false);
        if (postData.publishDate) {
          const date = postData.publishDate.toDate();
          setPublishDate(date.toISOString().slice(0, 16));
        }
      }
    } catch (error) {
      setError('Error loading post');
      console.error('Error loading post:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAutoSave = async () => {
    if (!postId || !title.trim()) return;
    
    try {
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content,
        featuredImage,
        tags,
        category,
        isPublished,
        isMandatoryReading,
      };

      await updateBlogPost(postId, postData);
      setSuccess('Guardado automáticamente');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen debe ser menor a 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadImage(file, 'blog-images');
      if (result.error) {
        setError(result.error);
      } else {
        setFeaturedImage(result.url);
        setSuccess('Imagen subida exitosamente');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      setError('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (publish = false) => {
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    if (!content.trim()) {
      setError('El contenido es requerido');
      return;
    }

    if (!category.trim()) {
      setError('La categoría es requerida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim() || content.substring(0, 150) + '...',
        content,
        featuredImage,
        tags,
        category: category.trim(),
        isPublished: publish,
        isMandatoryReading,
        publishDate: new Date(publishDate),
      };

      let result;
      if (postId) {
        result = await updateBlogPost(postId, postData);
      } else {
        result = await createBlogPost(postData);
      }

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(publish ? 'Post publicado exitosamente' : 'Post guardado como borrador');
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      }
    } catch (error) {
      setError('Error al guardar el post');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'blockquote', 'code-block'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {postId ? 'Editar Entrada' : 'Nueva Entrada'}
                </h1>
                {success && (
                  <div className="flex items-center space-x-1 text-green-600 text-sm">
                    <Clock className="w-3 h-3" />
                    <span>{success}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleSave(false)}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-md transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Guardando...' : 'Guardar Borrador'}</span>
              </button>
              
              <button
                onClick={() => handleSave(true)}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-pink-400 text-white hover:bg-pink-500 disabled:opacity-50 rounded-md transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{loading ? 'Publicando...' : 'Publicar'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Título de la entrada..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold border-none outline-none focus:ring-0 p-0 bg-transparent placeholder-gray-400"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen (opcional)
              </label>
              <textarea
                placeholder="Breve descripción de la entrada..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Principal
              </label>
              
              {featuredImage ? (
                <div className="relative">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <button
                    onClick={() => setFeaturedImage('')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-64 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:border-pink-400 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {uploading ? 'Subiendo imagen...' : 'Haz clic para subir una imagen'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF hasta 5MB</p>
                  </div>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido
              </label>
              <div className="bg-white rounded-md border border-gray-300">
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  placeholder="Escribe el contenido de tu entrada..."
                  style={{ height: '400px' }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h3>
              
              {/* Publish Date */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Publicación
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mandatory Reading */}
              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isMandatoryReading}
                    onChange={(e) => setIsMandatoryReading(e.target.checked)}
                    className="rounded border-gray-300 text-pink-400 focus:ring-pink-400"
                  />
                  <span className="text-sm text-gray-700">Lectura Obligatoria</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categoría</h3>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Escribir o seleccionar categoría..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  list="categories"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                />
                <datalist id="categories">
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Etiquetas</h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Agregar etiqueta..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="px-3 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <TagIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;