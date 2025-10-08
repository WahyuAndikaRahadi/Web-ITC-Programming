import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Materi from './pages/Materi';
import Project from './pages/Project';
import Lomba from './pages/Lomba';
import Quiz from './pages/Quiz';

type Page = 'home' | 'materi' | 'project' | 'lomba' | 'quiz';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('itc-theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('itc-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('itc-theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {currentPage === 'home' && <Home darkMode={darkMode} onNavigate={handleNavigate} />}
      {currentPage === 'materi' && <Materi darkMode={darkMode} />}
      {currentPage === 'project' && <Project darkMode={darkMode} />}
      {currentPage === 'lomba' && <Lomba darkMode={darkMode} />}
      {currentPage === 'quiz' && <Quiz darkMode={darkMode} />}
    </div>
  );
}

export default App;
