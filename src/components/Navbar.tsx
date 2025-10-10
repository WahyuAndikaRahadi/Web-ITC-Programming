// Navbar.tsx (Dengan Animasi Klik whileTap Smooth)
import { Moon, Sun, Code2, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ currentPage, onNavigate, darkMode, toggleDarkMode }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Materi', id: 'materi' },
    { name: 'Project', id: 'project' },
    { name: 'Quiz', id: 'quiz' },
  ];

  const primaryColor = 'blue-500';

  const handleNavigationAndClose = (page: string) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };
  
  // Varian untuk animasi menu dropdown
  const menuVariants = {
    hidden: { 
      height: 0, 
      opacity: 0,
      transition: { 
        duration: 0.3,
        when: "afterChildren",
      } 
    },
    visible: { 
      height: "auto", 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.05
      } 
    },
  };
  
  // Varian untuk animasi setiap item di menu dropdown
  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Hilangkan WebkitTapHighlightColor di sini, karena kita akan menggunakan whileTap
  // Menghilangkan highlight di Dark Mode Toggle dan Hamburger tetap penting
  const tapHighlightStyle = { 
    WebkitTapHighlightColor: 'transparent',
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`sticky top-0 z-50 ${
        darkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
      } border-b backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand (tetap sama) */}
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavigationAndClose('home')}
          >
            <Code2 className={`w-8 h-8 ${darkMode ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-blue-600 group-hover:text-blue-500'} transition-colors`} />
            <span
              className={`ml-2 text-2xl font-extrabold tracking-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              ITC <span className={`text-${primaryColor}`}>Programming</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* 1. NAVIGASI DESKTOP (tetap sama) */}
            <div className="hidden md:flex items-center relative rounded-full p-1 border border-transparent">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  // Menambahkan whileTap untuk Desktop Nav Items agar smooth saat ditekan
                  as={motion.button} 
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full z-10 transition-colors duration-200 ${
                    currentPage === item.id
                      ? darkMode
                        ? 'text-white'
                        : 'text-gray-900'
                      : darkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Active Indicator (Magic Pill) - Desktop (tetap sama) */}
              {navItems.map((item) => 
                item.id === currentPage && (
                  <motion.div
                    key={item.id + '-indicator'}
                    layoutId="navbar-pill"
                    className={`absolute h-full rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                    style={{
                      padding: '4px 0',
                      left: 0,
                      top: 0,
                      zIndex: 0,
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )
              )}
            </div>
              
            {/* 2. Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileTap={{ scale: 0.9 }} // Animasi klik/tap yang lebih responsif
              className={`p-3 rounded-full transition-all duration-300 ease-in-out ${
                darkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } shadow-md hover:shadow-lg flex items-center justify-center`}
              aria-label="Toggle Dark Mode"
              style={tapHighlightStyle}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? "sun" : "moon"}
                  initial={{ y: -20, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 20, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
            
            {/* 3. Hamburger Menu Toggle - HANYA TAMPIL DI MOBILE */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }} // Animasi klik/tap yang lebih responsif
              className={`p-3 rounded-full transition-all duration-200 ease-in-out md:hidden ${
                darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } shadow-md hover:shadow-lg flex items-center justify-center`}
              aria-label="Toggle Menu"
              style={tapHighlightStyle}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={isMenuOpen ? "x-icon" : "menu-icon"}
                  initial={{ rotate: isMenuOpen ? -45 : 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: isMenuOpen ? 45 : -45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
          
        </div>
      </div>
      
      {/* Menu Dropdown - FOKUS PERBAIKAN DI SINI */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={`md:hidden px-4 sm:px-6 lg:px-8 pb-4 border-t ${
              darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
            }`}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            style={{ overflow: 'hidden' }}
          >
            {navItems.map((item) => (
              <motion.button // Menggunakan motion.button
                key={item.id}
                onClick={() => handleNavigationAndClose(item.id)}
                whileTap={{ scale: 0.98 }} // ANMASI KLIK SMOOTH di sini
                className={`w-full text-left my-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 
                  ${currentPage === item.id
                    ? // STATUS AKTIF: Warna biru padat
                      darkMode
                      ? `bg-blue-600 text-white`
                      : `bg-blue-500 text-white`
                    : // STATUS NON-AKTIF: Hanya warna teks dan hover
                      darkMode
                      ? 'text-gray-300 hover:bg-gray-800'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                variants={itemVariants}
                style={tapHighlightStyle} // Tetap pertahankan untuk mencegah highlight bawaan
              >
                {item.name}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;