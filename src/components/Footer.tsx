// ./components/Footer.tsx
import React from 'react';
import { Github, Instagram, Heart, Mail, MapPin } from 'lucide-react'; 

interface FooterProps {
  darkMode: boolean;
  onNavigate: (page: string) => void; // Tambahkan prop navigasi
}

const Footer: React.FC<FooterProps> = ({ darkMode, onNavigate }) => {
  const textColor = darkMode ? 'text-gray-400' : 'text-gray-500';
  const headingColor = darkMode ? 'text-white' : 'text-gray-800';
  const linkColor = darkMode ? 'text-blue-300 hover:text-blue-500' : 'text-blue-600 hover:text-blue-800';
  const iconColor = darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-700';
  const instagramColor = 'text-pink-500 hover:text-pink-400';

  const menuItems = [
    { name: 'Beranda', page: 'home' },
    { name: 'Materi', page: 'materi' },
    { name: 'Proyek', page: 'project' },
    // { name: 'Lomba', page: 'lomba' },
    { name: 'Kuis', page: 'quiz' },
  ];

  return (
    <footer 
      className={`
        relative z-10 
        mt-16 py-10 px-4 sm:px-6 lg:px-8 
        border-t transition-colors duration-200
        ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
      `}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Kolom 1: Logo & Deskripsi Klub */}
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <span 
              className={`text-2xl font-extrabold transition-colors duration-200 ${
                darkMode ? 'text-blue-400' : 'text-blue-700'
              }`}
            >
              IT CLUB Programming
            </span>
            <p className={`text-sm font-medium ${headingColor}`}>
              SMK Negeri 69 Jakarta
            </p>
          </div>
          <p className={`text-sm ${textColor}`}>
            Wadah bagi siswa/i yang ingin mendalami dunia pemrograman dan teknologi.
          </p>
          
          {/* Ikon Sosial Media */}
          <div className="flex space-x-4 mt-4">
            <a href="https://www.instagram.com/itc.smkn69jkt?igsh=MXFwMWE4cjNrMnhwcg==" aria-label="Instagram" className={`${instagramColor} transition-colors`}>
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Kolom 2: Navigasi Cepat */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${headingColor}`}>
            Akses Cepat
          </h3>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.page}>
                <button
                  onClick={() => onNavigate(item.page)}
                  className={`text-sm ${textColor} hover:${linkColor} transition-colors text-left`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Kolom 3: Sumber Daya Lain */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${headingColor}`}>
            Sumber Daya
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className={textColor + ` hover:${linkColor}`}>FAQ & Bantuan</a></li>
            <li><a href="#" className={textColor + ` hover:${linkColor}`}>Materi Tambahan</a></li>
            <li><a href="#" className={textColor + ` hover:${linkColor}`}>Galeri Proyek</a></li>
          </ul>
        </div>
        
        {/* Kolom 4: Kontak */}
        <div>
          <h3 className={`text-lg font-semibold mb-4 ${headingColor}`}>
            Hubungi Kami
          </h3>
          <ul className="space-y-3 text-sm">
            <li className={`flex items-start ${textColor}`}>
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <span>Jl. KRT. Radjiman Widyodiningrat, Rawa Badung, No 32 RT 007/RW 007, Kel. Jatinegara, Kec. Cakung, Kota Jakarta Timur, 13930</span>
            </li>
            {/* <li className={`flex items-start ${textColor}`}>
                <Mail className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                <a href="mailto:itclub@smkn69jkt.sch.id" className={linkColor}>itclub@smkn69jkt.sch.id</a>
            </li> */}
          </ul>
        </div>

      </div>

      {/* Baris Bawah (Copyright) */}
      <div className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-700 text-center">
        <p className={`text-xs ${textColor} flex items-center justify-center`}>
          &copy; {new Date().getFullYear()} IT CLUB Programming. Dibuat dengan 
          <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" />
          oleh pengurus IT CLUB.
        </p>
      </div>
    </footer>
  );
};

export default Footer;