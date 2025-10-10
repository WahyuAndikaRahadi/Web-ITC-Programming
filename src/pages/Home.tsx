// Home.tsx (Versi Final dengan Glassmorphism dan Animasi Teks)
import { motion } from 'framer-motion';
import {
  BookOpen,
  FolderGit2,
  Trophy,
  Brain,
  ChevronRight,
  Bell,
} from 'lucide-react';
import Card from '../components/Card';
import updateData from '../data/update.json';
import TextType from '../components/TextType';
import SplitText from '../components/splitText';

interface HomeProps {
  darkMode: boolean;
  onNavigate: (page: string) => void;
}

const Home = ({ darkMode, onNavigate }: HomeProps) => {
  const features = [
    {
      icon: BookOpen,
      title: 'Materi',
      description: 'Pelajari HTML, CSS, dan JavaScript dari dasar',
      page: 'materi',
      color: 'blue',
    },
    {
      icon: FolderGit2,
      title: 'Project',
      description: 'Kerjakan project nyata untuk praktik',
      page: 'project',
      color: 'green',
    },
    {
      icon: Trophy,
      title: 'Lomba',
      description: 'Ikuti kompetisi programming nasional',
      page: 'lomba',
      color: 'yellow',
    },
    {
      icon: Brain,
      title: 'Quiz',
      description: 'Uji pemahaman dengan quiz interaktif',
      page: 'quiz',
      color: 'purple',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600';
      case 'new-content':
        return darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-600';
      case 'competition':
        return darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-600';
      case 'tip':
        return darkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600';
      default:
        return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };
  
  const h1Text = "ITC Programming Learning Portal";
  const descriptionText = [
    "Platform pembelajaran internal untuk anggota ITC Programming.", 
    "Belajar web development dari dasar hingga mahir!"
  ];

  // Kelas Glassmorphism untuk Card dan Pengumuman
  const glassmorphismClasses = darkMode
    ? 'bg-gray-700/30 border border-gray-600/50 shadow-lg hover:shadow-cyan-500/30' 
    : 'bg-white/50 border border-gray-200/50 shadow-lg hover:shadow-blue-500/30';


  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          
          {/* JUDUL H1 MENGGUNAKAN SPLITTEXT */}
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <SplitText
              // Teks dibagi menjadi dua baris agar gradient pada "Learning Portal" bisa ditangani
              // Catatan: Jika SplitText tidak mendukung gradient, warna akan solid.
              text={h1Text}
              tag="span" // Menggunakan span agar bisa diatur block/inline-block
              className="text-center block"
              delay={50}
              duration={0.7}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </h1>
          
          {/* DESKRIPSI MENGGUNAKAN TEXTTYPE */}
          <p
            className={`text-xl md:text-2xl ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            } max-w-3xl mx-auto min-h-[4rem]`}
          >
            <TextType
              text={descriptionText}
              typingSpeed={50}
              pauseDuration={1500}
              showCursor={true}
              cursorCharacter="|"
            />
          </p>
        </div>

        {/* FEATURE CARDS (Gunakan Card.tsx, diasumsikan sudah mendukung Glassmorphism) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 1.0 }}
            >
              <Card
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onClick={() => onNavigate(feature.page)}
                darkMode={darkMode}
                // Tambahkan kelas Glassmorphism di sini, asumsi Card.tsx menerimanya
                className={`backdrop-blur-md ${glassmorphismClasses} rounded-xl`} 
              >
                <motion.div 
                  className="flex items-center text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                  whileHover={{ x: 3 }}
                >
                  <span className="text-sm font-medium">Mulai</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* PENGUMUMAN TERBARU (Menerapkan Glassmorphism langsung) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: features.length * 0.1 + 1.2 }}
          className="mb-8"
        >
          <div className="flex items-center mb-6">
            <Bell
              className={`w-6 h-6 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
            />
            <h2
              className={`text-3xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Pengumuman Terbaru
            </h2>
          </div>

          <div className="space-y-4">
            {updateData.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: features.length * 0.1 + 1.4 + index * 0.1 }}
                // Kelas GLASSMORPHISM diterapkan di sini
                className={`
                  backdrop-blur-md rounded-xl p-6 transition-all duration-300 hover:shadow-2xl cursor-pointer
                  ${glassmorphismClasses}
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3
                    className={`text-lg font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {update.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      update.type
                    )}`}
                  >
                    {update.date}
                  </span>
                </div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {update.content}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;