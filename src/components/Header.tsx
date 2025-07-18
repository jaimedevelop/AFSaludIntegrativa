// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Search, ChevronDown, Settings } from 'lucide-react';
import { onAuthStateChange, isAdmin } from '../firebase';
import AdminLoginModal from './admin/AdminLoginModal';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [language, setLanguage] = useState('es');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/', label: 'Inicio', labelEn: 'Home' },
    { path: '/blog', label: 'Blog', labelEn: 'Blog' },
    { path: '/enfoque', label: 'Mi Enfoque', labelEn: 'My Approach' },
    { path: '/contacto', label: 'Contacto', labelEn: 'Contact' },
  ];

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Only apply scroll effect on home page
      if (isHomePage) {
        // Check if user has scrolled past the hero section (adjust threshold as needed)
        const scrollThreshold = window.innerHeight * 0.8; // 80% of viewport height
        setIsScrolled(window.scrollY > scrollThreshold);
      } else {
        setIsScrolled(true); // Always show header on other pages
      }
    };

    // Set initial state
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  const handleAdminAccess = (e: React.MouseEvent) => {
    if (e.detail === 3) { // Triple click
      if (user && isAdmin(user)) {
        navigate('/admin');
      } else {
        setShowLoginModal(true);
      }
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate('/admin');
  };

  // Dynamic header classes based on scroll state and page
  const headerClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
    ${isScrolled || !isHomePage 
      ? 'bg-white shadow-sm border-b border-gray-100 translate-y-0' 
      : 'bg-transparent translate-y-0'
    }
  `;

  // Dynamic text colors based on scroll state
  const textColorClass = isScrolled || !isHomePage ? 'text-gray-900' : 'text-white';
  const linkColorClass = isScrolled || !isHomePage ? 'text-gray-700' : 'text-white';
  const iconColorClass = isScrolled || !isHomePage ? 'text-gray-600' : 'text-white';

  return (
    <>
      <header className={headerClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className={`text-2xl font-bold transition-colors duration-300 ${textColorClass} ${
                  isScrolled || !isHomePage 
                    ? 'hover:text-pink-600' 
                    : 'hover:text-pink-200'
                }`}
              >
                AF Salud Integrativa
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <a
                href="https://www.facebook.com/af.salud.ingrativa"
                className={`transition-colors duration-300 transform hover:scale-110 ${iconColorClass} ${
                  isScrolled || !isHomePage 
                    ? 'hover:text-blue-700' 
                    : 'hover:text-blue-300'
                }`}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/af.salud.integrativa/"
                className={`transition-colors duration-300 transform hover:scale-110 ${iconColorClass} ${
                  isScrolled || !isHomePage 
                    ? 'hover:text-pink-600' 
                    : 'hover:text-pink-200'
                }`}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>

            {/* Navigation with Bookmark Tabs */}
            <nav className="hidden md:flex items-center space-x-2 relative">
              {navigationItems.map((item) => (
                <div key={item.path} className="relative group">
                  {/* Bookmark Tab - Only show when header is scrolled */}
                  {(isScrolled || !isHomePage) && (
                    <div 
                      className={`absolute -top-16 left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-out ${
                        location.pathname === item.path
                          ? 'translate-y-0 opacity-100'
                          : 'translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'
                      }`}
                    >
                      <div 
                        className={`relative px-6 py-3 rounded-t-lg shadow-md transition-colors duration-300 ${
                          location.pathname === item.path
                            ? 'bg-pink-200'
                            : 'bg-purple-300 group-hover:bg-purple-400'
                        }`}
                      >
                        <span className="text-white font-medium text-sm whitespace-nowrap">
                          {language === 'es' ? item.label : item.labelEn}
                        </span>
                        {/* Bookmark Point */}
                        <div 
                          className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 transition-colors duration-300 ${
                            location.pathname === item.path
                              ? 'border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-pink-200'
                              : 'border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-purple-300 group-hover:border-t-purple-400'
                          }`}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Navigation Link */}
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? (isScrolled || !isHomePage ? 'text-pink-500' : 'text-pink-200')
                        : `${linkColorClass} ${
                            isScrolled || !isHomePage 
                              ? 'hover:text-purple-700' 
                              : 'hover:text-purple-200'
                          }`
                    }`}
                  >
                    {language === 'es' ? item.label : item.labelEn}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Language Selector and Search */}
            <div className="flex items-center space-x-4">
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleLanguageDropdown}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isScrolled || !isHomePage 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <span className="text-lg">
                    {language === 'es' ? '🇪🇸' : '🇺🇸'}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`transform transition-transform duration-300 ${
                      isLanguageDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => changeLanguage('es')}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200"
                    >
                      <span className="text-lg">🇪🇸</span>
                      <span>Español</span>
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition-colors duration-200"
                    >
                      <span className="text-lg">🇺🇸</span>
                      <span>English</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Search */}
              <div className="relative">
                <button
                  onClick={toggleSearch}
                  className={`p-2 rounded-md transition-all duration-300 transform hover:scale-110 ${
                    isScrolled || !isHomePage
                      ? 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                      : 'text-white hover:text-pink-200 hover:bg-white hover:bg-opacity-20'
                  }`}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
                
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <input
                      type="text"
                      placeholder={language === 'es' ? 'Buscar...' : 'Search...'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Hidden Admin Button */}
              <div className="relative">
                <button
                  onClick={handleAdminAccess}
                  className={`p-2 rounded-md transition-all duration-300 opacity-0 hover:opacity-20 ${
                    isScrolled || !isHomePage
                      ? 'text-gray-400 hover:text-gray-600'
                      : 'text-white hover:text-gray-300'
                  }`}
                  aria-label="Admin Access"
                  title="Triple click for admin access"
                >
                  <Settings size={16} />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className={`transition-colors duration-300 ${
                isScrolled || !isHomePage ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-300'
              }`}>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;