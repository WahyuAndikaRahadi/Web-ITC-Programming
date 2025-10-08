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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1
            className={`text-5xl md:text-6xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            ITC Programming
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Learning Portal
            </span>
          </h1>
          <p
            className={`text-xl md:text-2xl ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            } max-w-3xl mx-auto`}
          >
            Platform pembelajaran internal untuk anggota ITC Programming. Belajar web
            development dari dasar hingga mahir!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.page}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onClick={() => onNavigate(feature.page)}
                darkMode={darkMode}
              >
                <div className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                  <span className="text-sm font-medium">Mulai</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                } border rounded-xl p-6 hover:shadow-lg transition-shadow`}
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
