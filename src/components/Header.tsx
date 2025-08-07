import React from 'react';
import ReactDOM from 'react-dom';
import { Sparkles, Menu, X, Globe, Music, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AuthModal } from './AuthModal';
import { UsageTracker } from '../utils/usageTracker';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAtmosphereMode, setIsAtmosphereMode] = React.useState<boolean>(false);
  const [showAtmosphereTooltip, setShowAtmosphereTooltip] = React.useState<boolean>(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const handleAuthAction = async () => {
    if (user) {
      await signOut();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = async () => {
    // Refresh usage data after successful authentication
    try {
      const { data: { user: currentUser } } = await import('../supabaseClient').then(m => m.supabase.auth.getUser());
      if (currentUser) {
        await UsageTracker.migrateAnonymousUsage(currentUser.id);
      }
    } catch (error) {
      console.error('Error during auth success:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Эффект для управления фоновой музыкой
  React.useEffect(() => {
    if (isAtmosphereMode) {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://ygpenhsaqtaoxmjaruad.supabase.co/storage/v1/object/public/audio//background_ambient.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3; // Тихий фоновый звук
      }
      
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
        } catch (error) {
          console.warn('Не удалось воспроизвести аудио (возможно, заблокировано браузером):', error);
        }
      };
      
      playAudio();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    // Очистка при размонтировании компонента
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, [isAtmosphereMode]);

  return (
    <>
      <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="w-full sm:w-auto flex justify-center sm:justify-start">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
              <img src="http://blog.lunarum.app/wp-content/uploads/2025/08/lunarum-logo-big.png" alt="Lunarum" className="w-[180px] h-[168px]" />
            </a>
          </div>

          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {/* Right side controls */}
              <div className="hidden sm:flex items-center space-x-8">
                {/* Atmosphere Toggle */}
                <div className="flex items-center space-x-2">
                  <Music className={`w-4 h-4 transition-colors duration-300 ${isAtmosphereMode ? 'text-orange-400' : 'text-slate-400'}`} />
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowAtmosphereTooltip(true)}
                      onMouseLeave={() => setShowAtmosphereTooltip(false)}
                      className="text-slate-400 hover:text-slate-300 transition-colors duration-200"
                    >
                      <HelpCircle className="w-3 h-3" />
                    </button>
                    {showAtmosphereTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-200 whitespace-nowrap shadow-lg z-50">
                        {t('interactive.atmosphereModeTooltip')}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAtmosphereMode(!isAtmosphereMode)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
                      isAtmosphereMode ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                        isAtmosphereMode ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Language Toggle */}
                <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-1">
                <Globe className="w-4 h-4 text-slate-400 ml-2" />
                <button
                  onClick={() => setLanguage('ru')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    language === 'ru'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  RU
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                    language === 'en'
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  ENG
                </button>
              </div>
              </div>

              <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
                <a href="https://blog.lunarum.app/" className="relative group font-semibold text-slate-200 hover:text-emerald-300 transition-colors duration-200">
                  <span>{t('nav.articles')}</span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
                </a>
                <a href="#about" className="relative group font-semibold text-slate-200 hover:text-blue-300 transition-colors duration-200">
                  <span>{t('nav.about')}</span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
                </a>
                <a href="#support" className="relative group font-medium">
                  <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                    {t('nav.support')}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
                </a>
                <button
                  onClick={handleAuthAction}
                  className="px-4 lg:px-6 py-2 text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg text-sm lg:text-base flex items-center space-x-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 shadow-pink-500/25"
                >
                  <span>{user ? t('logout') : t('login')}</span>
                </button>
              </nav>

              <button
                onClick={toggleMobileMenu}
                className="absolute top-6 right-4 lg:hidden text-slate-300 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
          </div>
          </div>

          {/* Mobile Nav */}
          <nav className="w-full lg:hidden flex items-center justify-center space-x-6 mt-4 text-sm pb-4 border-b border-slate-800/50">
              <a href="https://blog.lunarum.app/" className="relative group font-semibold text-slate-200 hover:text-emerald-300 transition-colors duration-200">
                  <span>{t('nav.articles')}</span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-400 scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
              </a>
              <a href="#about" className="relative group font-semibold text-slate-200 hover:text-blue-300 transition-colors duration-200">
                  <span>{t('nav.about')}</span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
              </a>
              <a href="#support" className="relative group font-medium">
                  <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_200%]">
                    {t('nav.support')}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 scale-x-100 transition-transform origin-left duration-300 ease-out"></span>
              </a>
          </nav>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && ReactDOM.createPortal(
          <div className="fixed top-0 left-0 right-0 bottom-0 lg:hidden z-[9999] pt-20">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative bg-slate-900/95 backdrop-blur-md border-t border-white/10 shadow-lg">
              <nav className="px-4 py-6 space-y-4">
                {/* Mobile Language Toggle */}
                <div className="space-y-6 mb-4">
                  {/* Mobile Atmosphere Toggle */}
                  <div className="flex items-center justify-center space-x-3">
                    <Music className={`w-4 h-4 transition-colors duration-300 ${isAtmosphereMode ? 'text-orange-400' : 'text-slate-400'}`} />
                    <span className="text-sm text-slate-300">{t('interactive.atmosphereMode')}</span>
                    <button
                      type="button"
                      onClick={() => setIsAtmosphereMode(!isAtmosphereMode)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-400/50 ${
                        isAtmosphereMode ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                          isAtmosphereMode ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {/* Mobile Language Toggle */}
                  <div className="flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-1">
                  <Globe className="w-4 h-4 text-slate-400 ml-2" />
                  <button
                    onClick={() => {
                      setLanguage('ru');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      language === 'ru'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    RU
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                      language === 'en'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    ENG
                  </button>
                </div>
                </div>
                
                <button 
                  onClick={() => {
                    handleAuthAction();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg text-base flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 shadow-pink-500/25 mt-4"
                >
                  <span>{user ? t('logout') : t('login')}</span>
                </button>
              </nav>
            </div>
          </div>
        , document.getElementById('modal-root')!)}
      </header>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};