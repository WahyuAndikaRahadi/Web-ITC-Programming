import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, ExternalLink, Building2, Award } from 'lucide-react';
import lombaData from '../data/lomba.json';

interface LombaProps {
  darkMode: boolean;
}

interface Lomba {
  id: string;
  title: string;
  organizer: string;
  deadline: string;
  status: 'active' | 'upcoming' | 'finished';
  link: string;
  description: string;
  prize: string;
}

const Lomba = ({ darkMode }: LombaProps) => {
  const [filter, setFilter] = useState<string>('all');

  const statusConfig = {
    active: {
      label: 'Aktif',
      color: darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-700',
    },
    upcoming: {
      label: 'Akan Datang',
      color: darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-700',
    },
    finished: {
      label: 'Selesai',
      color: darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600',
    },
  };

  // Glassmorphism Base Styles
  const glassmorphismClasses = darkMode
    ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 hover:bg-gray-800/70' 
    : 'bg-white/50 backdrop-blur-lg border border-gray-200/50 hover:bg-white/70';

  const filters = [
    { id: 'all', label: 'Semua' },
    { id: 'active', label: 'Aktif' },
    { id: 'upcoming', label: 'Akan Datang' },
    { id: 'finished', label: 'Selesai' },
  ];

  const filteredLomba =
    filter === 'all'
      ? lombaData
      : lombaData.filter((lomba: Lomba) => lomba.status === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* PERUBAHAN: Kembali menggunakan max-w-7xl (lebar penuh) */}
      <div className="max-w-7xl mx-auto"> 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className={`text-4xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Lomba Programming
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ikuti berbagai kompetisi programming tingkat nasional dan internasional.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === f.id
                  ? darkMode
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                  : darkMode
                  ? 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70'
                  : 'bg-gray-100/70 text-gray-700 hover:bg-gray-200/70'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Lomba Cards (Grid 2 Kolom) */}
        {/* grid-cols-1: Mobile (1 kolom)
            md:grid-cols-2: Tablet/Desktop (2 kolom) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
          {filteredLomba.map((lomba: Lomba, index) => (
            <motion.div
              key={lomba.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className={`rounded-xl p-6 transition-all duration-300 ${glassmorphismClasses}`} 
            >
              {/* Card Content */}
              <div className="space-y-4">
                {/* Status & Title */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusConfig[lomba.status].color
                    }`}
                  >
                    {statusConfig[lomba.status].label}
                  </span>
                  <Trophy 
                      className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
                  />
                </div>

                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {lomba.title}
                </h2>

                <p
                  className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {lomba.description}
                </p>

                <div className="space-y-3 pt-2">
                  {/* Penyelenggara */}
                  <div className="flex items-start">
                    <Building2
                      className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        Penyelenggara
                      </p>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        {lomba.organizer}
                      </p>
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="flex items-start">
                    <Calendar
                      className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        Deadline
                      </p>
                      <p
                        className={`text-sm font-semibold ${
                          darkMode ? 'text-red-400' : 'text-red-600'
                        }`}
                      >
                        {formatDate(lomba.deadline)}
                      </p>
                    </div>
                  </div>

                  {/* Hadiah */}
                  <div className="flex items-start">
                    <Award
                      className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                        darkMode ? 'text-yellow-400' : 'text-yellow-600'
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs font-medium ${
                          darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}
                      >
                        Hadiah
                      </p>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}
                      >
                        {lomba.prize}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Link Button */}
                <a
                  href={lomba.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-full py-2 rounded-lg font-medium transition-colors mt-4
                    ${
                      lomba.status === 'finished'
                        ? darkMode
                          ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                  `}
                  onClick={(e) => {
                    if (lomba.status === 'finished') {
                      e.preventDefault();
                    }
                  }}
                >
                  {lomba.status === 'finished' ? (
                    'Sudah Selesai'
                  ) : (
                    <>
                      Lihat Detail & Daftar
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </>
                  )}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLomba.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Trophy
              className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? 'text-gray-700' : 'text-gray-300'
              }`}
            />
            <p
              className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
            >
              Tidak ada lomba dengan filter ini
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Lomba;