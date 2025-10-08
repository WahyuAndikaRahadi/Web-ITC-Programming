import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, ExternalLink, Building2, Award } from 'lucide-react';
import Card from '../components/Card';
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLomba.map((lomba: Lomba, index) => (
            <motion.div
              key={lomba.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card title={lomba.title} darkMode={darkMode}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        statusConfig[lomba.status].color
                      }`}
                    >
                      {statusConfig[lomba.status].label}
                    </span>
                  </div>

                  <p
                    className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {lomba.description}
                  </p>

                  <div className="space-y-2">
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
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {lomba.organizer}
                        </p>
                      </div>
                    </div>

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
                          className={`text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {formatDate(lomba.deadline)}
                        </p>
                      </div>
                    </div>

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
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {lomba.prize}
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href={lomba.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-full py-2 rounded-lg font-medium transition-colors ${
                      lomba.status === 'finished'
                        ? darkMode
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : darkMode
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
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
                        Lihat Detail
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

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
