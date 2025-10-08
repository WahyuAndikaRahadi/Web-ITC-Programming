import { Moon, Sun, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Navbar = ({ currentPage, onNavigate, darkMode, toggleDarkMode }: NavbarProps) => {
  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Materi', id: 'materi' },
    { name: 'Project', id: 'project' },
    { name: 'Lomba', id: 'lomba' },
    { name: 'Quiz', id: 'quiz' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-b backdrop-blur-sm bg-opacity-90`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <Code2 className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <span
              className={`ml-2 text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              ITC Programming
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-all ${
              darkMode
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="md:hidden flex items-center space-x-2 pb-3 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-all ${
                currentPage === item.id
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
