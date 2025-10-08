import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  CheckCircle,
  Circle,
  Code2,
  Palette,
  Zap,
  ChevronLeft,
  Youtube,
} from 'lucide-react';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import materiData from '../data/materi.json';

interface MateriProps {
  darkMode: boolean;
}

type ViewLevel = 'main' | 'sub' | 'detail';

interface ContentDetail {
  id: string;
  title: string;
  explanation: string;
  code: string;
  video: string;
}

interface SubContent {
  id: string;
  title: string;
  description: string;
  contentDetails: ContentDetail[];
}

interface MainContent {
  id: string;
  title: string;
  description: string;
  icon: string;
  subContent: SubContent[];
}

const Materi = ({ darkMode }: MateriProps) => {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('main');
  const [selectedMain, setSelectedMain] = useState<MainContent | null>(null);
  const [selectedSub, setSelectedSub] = useState<SubContent | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<ContentDetail | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('itc-completed-materials');
    if (saved) {
      setCompletedItems(new Set(JSON.parse(saved)));
    }
  }, []);

  const saveProgress = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    newCompleted.add(itemId);
    setCompletedItems(newCompleted);
    localStorage.setItem('itc-completed-materials', JSON.stringify([...newCompleted]));
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return Code2;
      case 'palette':
        return Palette;
      case 'zap':
        return Zap;
      default:
        return Code2;
    }
  };

  const calculateProgress = (mainContent: MainContent) => {
    const allDetails = mainContent.subContent.flatMap((sub) => sub.contentDetails);
    const completed = allDetails.filter((detail) =>
      completedItems.has(detail.id)
    ).length;
    return allDetails.length > 0 ? (completed / allDetails.length) * 100 : 0;
  };

  const handleMainClick = (main: MainContent) => {
    setSelectedMain(main);
    setViewLevel('sub');
  };

  const handleSubClick = (sub: SubContent) => {
    setSelectedSub(sub);
    setViewLevel('detail');
  };

  const handleDetailClick = (detail: ContentDetail) => {
    setSelectedDetail(detail);
  };

  const handleBack = () => {
    if (viewLevel === 'detail') {
      setSelectedDetail(null);
      setViewLevel('sub');
    } else if (viewLevel === 'sub') {
      setSelectedSub(null);
      setViewLevel('main');
    }
  };

  const breadcrumb = () => {
    const items = [];
    if (selectedMain) items.push(selectedMain.title);
    if (selectedSub) items.push(selectedSub.title);
    if (selectedDetail) items.push(selectedDetail.title);
    return items.join(' > ');
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
            Materi Pembelajaran
          </h1>

          {viewLevel !== 'main' && (
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handleBack}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Kembali
              </button>

              <p
                className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {breadcrumb()}
              </p>
            </div>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {viewLevel === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {materiData.map((main: MainContent, index) => {
                const Icon = getIcon(main.icon);
                const progress = calculateProgress(main);

                return (
                  <motion.div
                    key={main.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      title={main.title}
                      description={main.description}
                      icon={Icon}
                      onClick={() => handleMainClick(main)}
                      darkMode={darkMode}
                    >
                      <ProgressBar progress={progress} darkMode={darkMode} />
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {viewLevel === 'sub' && selectedMain && (
            <motion.div
              key="sub"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {selectedMain.subContent.map((sub, index) => {
                const completed = sub.contentDetails.filter((detail) =>
                  completedItems.has(detail.id)
                ).length;
                const total = sub.contentDetails.length;

                return (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      title={sub.title}
                      description={sub.description}
                      onClick={() => handleSubClick(sub)}
                      darkMode={darkMode}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {completed}/{total} selesai
                        </span>
                        <ChevronRight
                          className={`w-5 h-5 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        />
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {viewLevel === 'detail' && selectedSub && !selectedDetail && (
            <motion.div
              key="detail-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {selectedSub.contentDetails.map((detail, index) => {
                const isCompleted = completedItems.has(detail.id);

                return (
                  <motion.div
                    key={detail.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleDetailClick(detail)}
                    className={`${
                      darkMode
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    } border rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg flex items-center justify-between`}
                  >
                    <div className="flex items-center space-x-4">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle
                          className={`w-6 h-6 ${
                            darkMode ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        />
                      )}
                      <span
                        className={`text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {detail.title}
                      </span>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {viewLevel === 'detail' && selectedDetail && (
            <motion.div
              key="detail-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } border rounded-xl p-8 shadow-lg`}
            >
              <h2
                className={`text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {selectedDetail.title}
              </h2>

              <p
                className={`text-lg mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {selectedDetail.explanation}
              </p>

              <div className="mb-6">
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Contoh Kode:
                </h3>
                <pre
                  className={`${
                    darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'
                  } p-4 rounded-lg overflow-x-auto`}
                >
                  <code>{selectedDetail.code}</code>
                </pre>
              </div>

              {selectedDetail.video && (
                <div className="mb-6">
                  <h3
                    className={`text-xl font-semibold mb-3 flex items-center ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <Youtube className="w-5 h-5 mr-2 text-red-500" />
                    Video Pembelajaran:
                  </h3>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedDetail.video}
                      title="Video Pembelajaran"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="border-0"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  saveProgress(selectedDetail.id);
                  handleBack();
                }}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  completedItems.has(selectedDetail.id)
                    ? darkMode
                      ? 'bg-green-900 text-green-400 cursor-default'
                      : 'bg-green-100 text-green-700 cursor-default'
                    : darkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={completedItems.has(selectedDetail.id)}
              >
                {completedItems.has(selectedDetail.id)
                  ? '✓ Sudah Selesai'
                  : 'Tandai Selesai'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Materi;
