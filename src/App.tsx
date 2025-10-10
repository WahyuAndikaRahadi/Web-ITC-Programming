// App.tsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
// Import Footer
import Footer from './components/Footer'; 
import Home from './pages/Home';
import Materi from './pages/Materi';
import Project from './pages/Project';
import Lomba from './pages/Lomba';
import Quiz from './pages/Quiz';
// Import komponen Squares
import Squares from './components/Squares'; 

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

  // Tentukan warna berdasarkan mode
  const gridBorderColor = darkMode ? '#333' : '#ccc';
  const gridHoverFillColor = darkMode ? '#444' : '#eee';

  return (
    <div className={`relative min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* 1. Komponen Squares sebagai background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Squares 
          speed={0.5} 
          squareSize={40}
          direction='diagonal'
          // Integrasi Dark/Light Mode di sini
          borderColor={gridBorderColor}
          hoverFillColor={gridHoverFillColor}
        />
      </div>
      
      {/* Konten Utama dengan z-index yang lebih tinggi */}
      <div className="relative z-10">
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
        
        {/* 2. Integrasi Footer di sini */}
        <Footer darkMode={darkMode} />

      </div>
    </div>
  );
}

export default App;