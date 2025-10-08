import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, CheckSquare, ExternalLink } from 'lucide-react';
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
}

const Project = ({ darkMode }: ProjectProps) => {
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = localStorage.getItem('itc-completed-materials');
    if (saved) {
      const completed = JSON.parse(saved);
      const mainIds = new Set<string>();

      materiData.forEach((main) => {
        const allDetails = main.subContent.flatMap((sub) => sub.contentDetails);
        const allCompleted = allDetails.every((detail) => completed.includes(detail.id));
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
            Project Praktik
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Kerjakan project nyata untuk menguasai skill programming. Project terbuka
            setelah menyelesaikan materi terkait.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectData.map((project: Project, index) => {
            const unlocked = isProjectUnlocked(project);

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-30 rounded-xl backdrop-blur-sm">
                    <div className="text-center">
                      <Lock
                        className={`w-12 h-12 mx-auto mb-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      />
                      <p
                        className={`font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Terkunci
                      </p>
                      <p
                        className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Selesaikan materi terlebih dahulu
                      </p>
                    </div>
                  </div>
                )}

                <Card
                  title={project.title}
                  description={project.description}
                  darkMode={darkMode}
                  blur={!unlocked}
                  className={!unlocked ? 'pointer-events-none' : ''}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(
                          project.level
                        )}`}
                      >
                        {project.level}
                      </span>
                      {unlocked && (
                        <ExternalLink
                          className={`w-5 h-5 ${
                            darkMode ? 'text-blue-400' : 'text-blue-600'
                          }`}
                        />
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-semibold mb-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        Tugas Project:
                      </h4>
                      <ul className="space-y-2">
                        {project.tasks.slice(0, 3).map((task, idx) => (
                          <li
                            key={idx}
                            className={`flex items-start text-sm ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            <CheckSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{task}</span>
                          </li>
                        ))}
                        {project.tasks.length > 3 && (
                          <li
                            className={`text-sm ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}
                          >
                            + {project.tasks.length - 3} tugas lainnya
                          </li>
                        )}
                      </ul>
                    </div>

                    {project.requiredMaterials.length > 0 && (
                      <div>
                        <h4
                          className={`text-sm font-semibold mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Materi yang Diperlukan:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.requiredMaterials.map((materialId) => {
                            const material = materiData.find((m) => m.id === materialId);
                            const isCompleted = completedMaterials.has(materialId);

                            return (
                              <span
                                key={materialId}
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  isCompleted
                                    ? darkMode
                                      ? 'bg-green-900 text-green-400'
                                      : 'bg-green-100 text-green-700'
                                    : darkMode
                                    ? 'bg-gray-700 text-gray-400'
                                    : 'bg-gray-200 text-gray-600'
                                }`}
                              >
                                {material?.title || materialId}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Project;
