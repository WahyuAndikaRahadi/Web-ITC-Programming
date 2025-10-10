import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; 
import Swal from 'sweetalert2'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula, coy } from 'react-syntax-highlighter/dist/esm/styles/prism'; 

import {
  ChevronRight,
  CheckCircle,
  Circle,
  Code2,
  Palette,
  Zap,
  ChevronLeft,
  Youtube,
  BookOpenText,
  Globe,
  Lock, // ⭐ IKON BARU: Untuk status terkunci
} from 'lucide-react';

import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import materiData from '../data/materi.json'; 

// ⭐ ASUMSI: Data materi utama yang ingin dikunci adalah item PERTAMA di array materiData
const mainModuleData = materiData[0] as MainContent; 


// 1. MODIFIKASI INTERFACE: Tambahkan isLocked
interface ContentDetail {
  id: string;
  title: string;
  explanation: string;
  code: string;
  video: string;
  images: string[];
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
  isLocked?: boolean; // ⭐ TAMBAHAN KUNCI LAMA
}

interface MateriProps {
  darkMode: boolean;
}

type ViewLevel = 'main' | 'sub' | 'detail' | 'content';

const Materi = ({ darkMode }: MateriProps) => {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('main');
  // ⭐ UBAH selectedMain dari null menjadi mainModuleData agar bisa diakses di root
  const [selectedMain, setSelectedMain] = useState<MainContent>(mainModuleData); 
  const [selectedSub, setSelectedSub] = useState<SubContent | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<ContentDetail | null>(null);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  // ⭐ STATUS KUNCI MODUL UTAMA
  // Kita asumsikan isLocked adalah boolean. Jika tidak ada di JSON, default ke false (tidak terkunci)
  const isModuleLocked = selectedMain.isLocked ?? false; 

  // ... (useEffect, saveProgress, getIcon, calculateProgress)

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
      case 'globe-alt':
        return Globe;
      default:
        return BookOpenText;
    }
  };

  const calculateProgress = (mainContent: MainContent) => {
    const allDetails = mainContent.subContent.flatMap((sub) => sub.contentDetails);
    const completed = allDetails.filter((detail) =>
      completedItems.has(detail.id)
    ).length;
    return allDetails.length > 0 ? (completed / allDetails.length) * 100 : 0;
  };

  // 2. LOGIKA KLIK: Cegah akses jika terkunci
  const handleMainClick = (main: MainContent) => {
    if (main.isLocked) { // Pengecekan Kunci
      Swal.fire("Maaf Belum Bisa", "Modul Belajar masih terkunci nihh mohon bersabar yaaa" ,'error')
      return;
    }
    setSelectedMain(main);
    setViewLevel('sub');
  };

  const handleSubClick = (sub: SubContent) => {
    setSelectedSub(sub);
    setViewLevel('detail');
  };

  const handleDetailClick = (detail: ContentDetail) => {
    setSelectedDetail(detail);
    setViewLevel('content');
  };

  const handleBack = () => {
    if (viewLevel === 'content') {
      setSelectedDetail(null);
      setViewLevel('detail');
    } else if (viewLevel === 'detail') {
      setSelectedSub(null);
      setViewLevel('sub');
    } else if (viewLevel === 'sub') {
      // Kembali ke main view (daftar semua modul)
      // setSelectedMain(null); // (Opsional) Jika Anda hanya punya 1 modul utama, ini tidak perlu
      setViewLevel('main');
    }
  };

  const breadcrumb = () => {
    const items = [];
    if (selectedMain) items.push(selectedMain.title);
    if (selectedSub) items.push(selectedSub.title);
    if (selectedDetail && viewLevel === 'content') items.push(selectedDetail.title);
    
    if (viewLevel === 'detail' && selectedSub) {
      return items.join(' > ') + ` > Daftar Konten`;
    }
    return items.join(' > ');
  };
  
  const cardClasses = darkMode
    ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/70 hover:bg-gray-700/70 hover:border-blue-500/50'
    : 'bg-white/70 backdrop-blur-sm border border-gray-200/70 hover:bg-gray-100/70 hover:border-blue-500/50';

  const isCodeAvailable = selectedDetail && selectedDetail.code && selectedDetail.code.trim().length > 0;
  const isVideoAvailable = selectedDetail && selectedDetail.video && selectedDetail.video.trim().length > 0;

  // ⭐ KOMPONEN KUSTOM UNTUK MERENDER BLOK KODE DALAM MARKDOWN
  const CodeBlock = ({ inline, className, children }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : 'markup'; 
    
    if (inline) {
      return (
        <code className={`p-1 rounded ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-red-600'}`}>
          {children}
        </code>
      );
    }

    return (
      <div className="rounded-lg overflow-hidden shadow-xl my-4">
        <SyntaxHighlighter
          style={darkMode ? darcula : coy}
          language={language}
          customStyle={{ 
            padding: '1rem',
            margin: 0, 
            fontSize: '0.9rem',
            lineHeight: '1.4'
          }}
          showLineNumbers={true}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER & BREADCRUMB */}
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
              <button
                onClick={handleBack}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors border ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Kembali
              </button>

              <p
                className={`mt-2 sm:mt-0 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {breadcrumb()}
              </p>
            </div>
          )}
        </motion.div>


        {/* CONTAINER KONTEN (MAIN | SUB | DETAIL | CONTENT) */}
        <AnimatePresence mode="wait">
          
          {/* 3. LOGIKA RENDER UTAMA: MAIN CONTENT (Daftar Modul) */}
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
                const isLocked = main.isLocked ?? false; // Ambil status kunci

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
                      // Jika terkunci, gunakan ikon Lock dan matikan onClick
                      icon={isLocked ? Lock : Icon} 
                      onClick={() => handleMainClick(main)} 
                      darkMode={darkMode}
                      // Ubah style jika terkunci
                      className={`${cardClasses} ${
                        isLocked 
                          ? 'opacity-60 cursor-not-allowed border-red-500/50 hover:bg-red-900/10 hover:border-red-500/50' 
                          : ''
                      }`}
                    >
                      {isLocked ? (
                        <p className="mt-2 text-red-400 font-semibold flex items-center">
                          <Lock className="w-4 h-4 mr-1"/> MODUL TERKUNCI
                        </p>
                      ) : (
                        <ProgressBar progress={progress} darkMode={darkMode} />
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* 2. SUB CONTENT (Struktur Dokumen, Body HTML) - Tidak berubah, tapi kita tahu hanya tampil jika isLocked: false */}
          {viewLevel === 'sub' && selectedMain && (
            <motion.div
              key="sub"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* ... (Isi rendering subContent sama seperti sebelumnya) ... */}
              {selectedMain.subContent.map((sub, index) => {
                 const completed = sub.contentDetails.filter((detail) =>
                    completedItems.has(detail.id)
                  ).length;
                  const total = sub.contentDetails.length;
                  const isAllCompleted = completed === total && total > 0;
  
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
                        className={cardClasses}
                      >
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            {isAllCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                              <BookOpenText className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                isAllCompleted ? 'text-green-500' : (darkMode ? 'text-gray-400' : 'text-gray-600')
                              }`}
                            >
                              {completed}/{total} selesai
                            </span>
                          </div>
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

          {/* 3. DETAIL LIST (Daftar Konten) */}
          {/* ... (Bagian viewLevel === 'detail' dan viewLevel === 'content' tidak perlu diubah karena sudah dilindungi oleh isLocked di level main) ... */}

          {viewLevel === 'detail' && selectedSub && !selectedDetail && (
            <motion.div
              key="detail-list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {selectedSub.contentDetails.map((detail, index) => {
                 const isCompleted = completedItems.has(detail.id);
                 const hasCode = !!detail.code && detail.code.trim().length > 0;
                 const hasVideo = !!detail.video && detail.video.trim().length > 0;
                 const hasImages = detail.images && detail.images.length > 0;
  
                 return (
                   <motion.div
                     key={detail.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.05 }}
                     onClick={() => handleDetailClick(detail)}
                     className={`
                       ${darkMode
                         ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/70'
                         : 'bg-white/70 border-gray-200 hover:bg-gray-100/70'
                       } 
                       backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg flex items-center justify-between
                     `}
                   >
                     <div className="flex items-center space-x-4">
                       {isCompleted ? (
                         <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                       ) : (
                         <Circle
                           className={`w-6 h-6 flex-shrink-0 ${
                             darkMode ? 'text-gray-600' : 'text-gray-400'
                           }`}
                         />
                       )}
                       <span
                         className={`text-lg font-medium ${
                           darkMode ? 'text-white' : 'text-gray-900'
                         } ${isCompleted ? 'line-through opacity-75' : ''}`}
                       >
                         {detail.title}
                       </span>
                     </div>
                     <div className="flex items-center space-x-2">
                         {hasCode && <Code2 className="w-5 h-5 text-purple-500" />}
                         {hasImages && <Globe className="w-5 h-5 text-blue-500" />}
                         {hasVideo && <Youtube className="w-5 h-5 text-red-500" />}
                       <ChevronRight
                           className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                       />
                     </div>
                   </motion.div>
                 );
              })}
            </motion.div>
          )}


          {/* 4. CONTENT DETAIL (Isi Materi + Code + Gambar) */}
          {viewLevel === 'content' && selectedDetail && (
            <motion.div
              key="detail-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`
                ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
                border rounded-xl p-8 shadow-xl
              `}
            >
              <h2
                className={`text-3xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {selectedDetail.title}
              </h2>

              {/* PENJELASAN MENGGUNAKAN REACT MARKDOWN */}
              <div
                className={`markdown-body mb-6 ${ 
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: CodeBlock, 
                    h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-xl font-semibold mt-5 mb-2 border-b pb-1" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4 text-lg leading-relaxed" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4 mb-4 space-y-1" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-4 mb-4 space-y-1" {...props} />,
                    a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-400 underline" {...props} />,
                  }}
                >
                  {selectedDetail.explanation}
                </ReactMarkdown>
              </div>

              {/* TAMPILAN GAMBAR DENGAN GRID DAN ANIMASI */}
              {selectedDetail.images && selectedDetail.images.length > 0 && (
                <div className="mb-8 p-4 border rounded-lg border-dashed border-blue-400 dark:border-blue-600/50">
                  <h3
                    className={`text-xl font-semibold mb-4 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}
                  >
                    Ilustrasi / Diagram:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {selectedDetail.images.map((imgSrc, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="rounded-lg overflow-hidden shadow-md border border-gray-300 dark:border-gray-700"
                      >
                        <img 
                          src={imgSrc} 
                          alt={`Ilustrasi ${selectedDetail.title} ${index + 1}`} 
                          className="w-full h-auto object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTOH KODE DENGAN SYNTAX HIGHLIGHTING (Kode dari JSON) */}
              {isCodeAvailable && (
                <div className="mb-6">
                  <h3
                    className={`text-xl font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Contoh Kode (Dari Data):
                  </h3>
                  <div className="rounded-lg overflow-hidden shadow-xl">
                      <SyntaxHighlighter
                        style={darkMode ? darcula : coy} 
                        language={selectedDetail.code.includes('{') ? 'javascript' : 'markup'} 
                        customStyle={{ 
                          padding: '1rem',
                          margin: 0, 
                          fontSize: '0.9rem',
                          lineHeight: '1.4'
                        }}
                        showLineNumbers={true}
                      >
                        {selectedDetail.code.trim()}
                      </SyntaxHighlighter>
                  </div>
                </div>
              )}

              {/* Video Pembelajaran - Hanya tampil jika ada URL video */}
              {isVideoAvailable && (
                <div className="mb-6">
                  <h3
                    className={`text-xl font-semibold mb-3 flex items-center ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    <Youtube className="w-5 h-5 mr-2 text-red-500" />
                    Video Pembelajaran:
                  </h3>
                  <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
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

              {/* Tombol Tandai Selesai */}
              <button
                onClick={() => {
                  saveProgress(selectedDetail.id);
                  handleBack();
                }}
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  completedItems.has(selectedDetail.id)
                    ? darkMode
                      ? 'bg-green-900/50 text-green-400 cursor-default'
                      : 'bg-green-100 text-green-700 cursor-default'
                    : darkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={completedItems.has(selectedDetail.id)}
              >
                {completedItems.has(selectedDetail.id)
                  ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Sudah Selesai
                      </>
                    )
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