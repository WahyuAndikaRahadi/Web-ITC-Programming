// ./components/Footer.tsx
import React from 'react';
import { Instagram, Heart, MapPin } from 'lucide-react'; 

// 1. Definisikan Interface Props
interface FooterProps {
    // Kita butuh prop ini agar navigasi tidak menyebabkan full page refresh
    onNavigate: (page: string) => void; 
}

// Hapus prop darkMode karena sudah diatasi oleh Tailwind CSS dark:
const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    
    // Path menu items harus cocok dengan type Page di App.tsx
    const menuItems = [
        { name: 'Beranda', page: 'home' }, // Kembali ke 'page' untuk setCurrentPage
        { name: 'Materi', page: 'materi' },
        { name: 'Proyek', page: 'project' },
        { name: 'Kuis', page: 'quiz' },
    ];

    // Style yang menggunakan dark: class
    const linkStyle = "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors";

    return (
        <footer 
            className="relative z-10 mt-16 py-10 px-4 sm:px-6 lg:px-8 border-t bg-white border-gray-200 dark:bg-gray-900/50 dark:border-gray-700 transition-colors duration-200"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                
                {/* Kolom 1: Logo & Deskripsi Klub */}
                <div className="col-span-2 md:col-span-1">
                    <div className="mb-4">
                        <span 
                            className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 transition-colors duration-200"
                        >
                            IT CLUB Programming
                        </span>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            SMK Negeri 69 Jakarta
                        </p>
                    </div>
                    <p className={`text-sm ${linkStyle}`}>
                        Wadah bagi siswa/i yang ingin mendalami dunia pemrograman dan teknologi.
                    </p>
                    
                    {/* Ikon Sosial Media */}
                    <div className="flex space-x-4 mt-4">
                        <a 
                            href="https://www.instagram.com/itc.smkn69jkt?igsh=MXFwMWE4cjNrMnhwcg==" 
                            aria-label="Instagram" 
                            className="text-pink-500 hover:text-pink-400 transition-colors"
                            target="_blank" rel="noopener noreferrer" 
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                {/* Kolom 2: Navigasi Cepat */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Akses Cepat
                    </h3>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.page}>
                                {/* 🟢 GANTI KE <button> dan onClick */}
                                <button 
                                    onClick={() => onNavigate(item.page)}
                                    // Tambahkan type="button" untuk mencegah submit form yang tidak disengaja
                                    type="button" 
                                    className={`text-sm ${linkStyle} block text-left w-full`} 
                                >
                                    {item.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Kolom 3: Sumber Daya Lain */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Sumber Daya
                    </h3>
                    <ul className="space-y-2 text-sm">
                        {/* Biarkan <a> karena ini bukan navigasi internal SPA */}
                        <li><a href="#" className={linkStyle}>FAQ & Bantuan</a></li>
                        <li><a href="#" className={linkStyle}>Materi Tambahan</a></li>
                        <li><a href="#" className={linkStyle}>Galeri Proyek</a></li>
                    </ul>
                </div>
                
                {/* Kolom 4: Kontak */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Hubungi Kami
                    </h3>
                    <ul className="space-y-3 text-sm">
                        <li className={`flex items-start ${linkStyle}`}>
                            <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0" />
                            <span>Jl. KRT. Radjiman Widyodiningrat, Rawa Badung, No 32 RT 007/RW 007, Kel. Jatinegara, Kec. Cakung, Kota Jakarta Timur, 13930</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Baris Bawah (Copyright) */}
            <div className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-700 text-center">
                <p className={`text-xs ${linkStyle} flex items-center justify-center`}>
                    &copy; {new Date().getFullYear()} IT CLUB Programming. Dibuat dengan 
                    <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" />
                    oleh pengurus IT CLUB.
                </p>
            </div>
        </footer>
    );
};

export default Footer;