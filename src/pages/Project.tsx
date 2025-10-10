import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckSquare, Code, ExternalLink, Send } from 'lucide-react';
import Card from '../components/Card';
import projectData from '../data/project.json';
import materiData from '../data/materi.json';

interface ProjectProps {
  darkMode: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  level: string;
  locked: boolean;
  requiredMaterials: string[];
  tasks: string[];
  submissionLink: string; // <-- Properti link pengumpulan tugas
}

const Project = ({ darkMode }: ProjectProps) => {
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set());

  // Logika untuk mengambil materi yang sudah selesai dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('itc-completed-materials');
    if (saved) {
      const completedDetailIds = JSON.parse(saved);
      const mainIds = new Set<string>();

      // Cek apakah SEMUA detail di dalam MainContent sudah selesai
      materiData.forEach((main) => {
        const allDetails = main.subContent.flatMap((sub) => sub.contentDetails);
        const allCompleted = allDetails.every((detail) => completedDetailIds.includes(detail.id));
        if (allCompleted) {
          mainIds.add(main.id);
        }
      });

      setCompletedMaterials(mainIds);
    }
  }, []);

  const isProjectUnlocked = (project: Project) => {
    if (!project.locked) return true;
    return project.requiredMaterials.every((materialId) =>
      completedMaterials.has(materialId)
    );
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return darkMode ? 'bg-green-900 text-green-400' : 'bg-green-100 text-green-700';
      case 'intermediate':
        return darkMode ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return darkMode ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-700';
      default:
        return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600';
    }
  };
  
  // Kelas Glassmorphism untuk Card yang lebih panjang
  const glassmorphismClasses = darkMode
    ? 'bg-gray-800/40 backdrop-blur-md border border-gray-700/50 hover:bg-gray-700/50' 
    : 'bg-white/70 backdrop-blur-md border border-gray-200/50 hover:bg-gray-100/70';


  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto"> {/* Mengurangi max-width agar lebih fokus satu kolom */}
        
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1
            className={`text-4xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            Project Praktik
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Kerjakan project nyata untuk menguasai skill. Selesaikan materi
            terkait untuk membuka kunci project level Intermediate ke atas.
          </p>
        </motion.div>

        {/* PROJECT LIST (Daftar Memanjang Satu Kolom) */}
        <div className="space-y-6">
          {projectData.map((project: Project, index) => {
            const unlocked = isProjectUnlocked(project);
            const cardStyle = `transition-all duration-300 rounded-xl p-6 shadow-xl ${glassmorphismClasses}`;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 rounded-xl backdrop-blur-sm transition-opacity duration-300 hover:bg-black/50">
                    <div className="text-center p-8">
                      <Lock
                        className="w-10 h-10 mx-auto mb-3 text-white/80"
                      />
                      <p className="font-bold text-white text-xl">
                        Project Terkunci
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        Project Praktik akan segera hadir
                      </p>
                    </div>
                  </div>
                )}
                
                {/* PROJECT CARD */}
                <div 
                  className={unlocked ? cardStyle : `${cardStyle} ${darkMode ? 'opacity-60' : 'opacity-80'}`}
                >
                    {/* LEVEL & STATUS */}
                    <div className="flex items-start justify-between mb-4">
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${getLevelColor(project.level)}`}
                        >
                            {project.level}
                        </span>
                        {unlocked && (
                            <Code className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        )}
                    </div>
                    
                    {/* TITLE & DESCRIPTION */}
                    <h2 
                        className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        {project.title}
                    </h2>
                    <p 
                        className={`text-base mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                        {project.description}
                    </p>

                    {/* TUGAS PROJECT */}
                    <div className="mb-6 border-t border-dashed pt-4">
                        <h4 className={`text-base font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            🎯 Tugas Utama:
                        </h4>
                        <ul className="space-y-2">
                            {project.tasks.map((task, idx) => (
                                <li
                                    key={idx}
                                    className={`flex items-start text-sm ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                                >
                                    <CheckSquare className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-blue-500" />
                                    <span className="leading-relaxed">{task}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* MATERI WAJIB */}
                    {project.requiredMaterials.length > 0 && (
                        <div className="mb-6">
                            <h4 className={`text-base font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                📚 Materi Prasyarat:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {project.requiredMaterials.map((materialId) => {
                                    // Cari nama materi (kita asumsikan materiData sudah dimuat)
                                    const material = materiData.find((m) => m.id === materialId);
                                    const isCompleted = completedMaterials.has(materialId);

                                    return (
                                        <span
                                            key={materialId}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                                isCompleted
                                                    ? darkMode
                                                        ? 'bg-green-700/50 text-green-300 border border-green-700'
                                                        : 'bg-green-100 text-green-700 border border-green-200'
                                                    : darkMode
                                                    ? 'bg-gray-700/50 text-gray-400 border border-gray-600'
                                                    : 'bg-gray-200 text-gray-600 border border-gray-300'
                                            }`}
                                        >
                                            {material?.title || materialId} {isCompleted && '✓'}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    
                    {/* TOMBOL AKSI */}
                    {unlocked && (
                        <a 
                            href={project.submissionLink || '#'} // Menggunakan submissionLink atau fallback '#'
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full flex items-center justify-center py-3 rounded-lg font-semibold transition-colors mt-4
                                ${darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}
                            `}
                        >
                            <Send className="w-5 h-5 mr-2" />
                            Kumpulkan Tugas
                            <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                    )}

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Project;