import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Lock, ArrowRight, RotateCcw, Trophy, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import QuizCard from '../components/QuizCard'; // Asumsi komponen ini ada
import quizData from '../data/quiz.json';
import materiData from '../data/materi.json';

interface QuizProps {
  darkMode: boolean;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  topic: string;
  description: string;
  locked: boolean;
  requiredMaterials: string[];
  questions: Question[];
}

const Quiz = ({ darkMode }: QuizProps) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [completedMaterials, setCompletedMaterials] = useState<Set<string>>(new Set());
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  // GLASSMORPHISM BASE CLASSES
  const glassmorphismBase = darkMode
    ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700/50' 
    : 'bg-white/50 backdrop-blur-lg border border-gray-200/50';

  useEffect(() => {
    const savedMaterials = localStorage.getItem('itc-completed-materials');
    if (savedMaterials) {
      const completed = JSON.parse(savedMaterials);
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

    const savedScores = localStorage.getItem('itc-quiz-scores');
    if (savedScores) {
      setQuizScores(JSON.parse(savedScores));
    }
  }, []);

  const isQuizUnlocked = (quiz: Quiz) => {
    if (!quiz.locked) return true;
    return quiz.requiredMaterials.every((materialId) =>
      completedMaterials.has(materialId)
    );
  };

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setShowResults(false);
    setQuizCompleted(false);
  };

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion] !== null) {
      if (currentQuestion < selectedQuiz!.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizCompleted(true);
        calculateScore();
      }
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return;

    let correct = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / selectedQuiz.questions.length) * 100);

    const newScores = { ...quizScores, [selectedQuiz.id]: score };
    setQuizScores(newScores);
    localStorage.setItem('itc-quiz-scores', JSON.stringify(newScores));
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const getScoreMessage = (score: number) => {
    if (score === 100) return 'Sempurna! 🎉';
    if (score >= 80) return 'Sangat Baik! 👏';
    if (score >= 60) return 'Bagus! 👍';
    if (score >= 40) return 'Cukup Baik 💪';
    return 'Tetap Semangat! 💪';
  };

  // Tampilan saat Quiz Sedang Berjalan
  if (selectedQuiz && !quizCompleted) {
    const currentQ = selectedQuiz.questions[currentQuestion];

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <button
              onClick={resetQuiz}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ← Kembali ke Daftar Quiz
            </button>
          </motion.div>

          {/* Quiz Card - Menggunakan komponen QuizCard */}
          <QuizCard
            question={currentQ.question}
            options={currentQ.options}
            selectedAnswer={selectedAnswers[currentQuestion]}
            correctAnswer={showResults ? currentQ.correctAnswer : undefined}
            onSelectAnswer={handleSelectAnswer}
            showResult={showResults}
            darkMode={darkMode}
            questionNumber={currentQuestion + 1}
            totalQuestions={selectedQuiz.questions.length}
          />

          {/* Penjelasan Jawaban (Glassmorphism Added) */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 rounded-xl p-6 ${glassmorphismBase} ${
                darkMode ? 'shadow-xl shadow-blue-900/20' : 'shadow-lg shadow-blue-100/50'
              }`}
            >
              <h4
                className={`font-semibold mb-2 ${
                  darkMode ? 'text-blue-400' : 'text-blue-700'
                }`}
              >
                Penjelasan:
              </h4>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {currentQ.explanation}
              </p>
            </motion.div>
          )}

          {/* Tombol Navigasi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex justify-between items-center"
          >
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {currentQuestion + 1} dari {selectedQuiz.questions.length}
            </span>

            <button
              onClick={() => {
                if (showResults) {
                  setShowResults(false);
                  handleNext();
                } else {
                  setShowResults(true);
                }
              }}
              disabled={selectedAnswers[currentQuestion] === null}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center ${
                selectedAnswers[currentQuestion] === null
                  ? darkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : darkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {showResults
                ? currentQuestion === selectedQuiz.questions.length - 1
                  ? 'Selesai'
                  : 'Lanjut'
                : 'Jawab'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Tampilan Hasil Quiz
  if (quizCompleted && selectedQuiz) {
    const correct = selectedQuiz.questions.filter(
      (q, i) => selectedAnswers[i] === q.correctAnswer
    ).length;
    const score = Math.round((correct / selectedQuiz.questions.length) * 100);

    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-xl p-8 text-center shadow-lg ${glassmorphismBase}`} // Glassmorphism applied
          >
            {/* ... (Konten Hasil Quiz tidak diubah) ... */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Trophy
                className={`w-20 h-20 mx-auto mb-4 ${
                  score >= 80 ? 'text-yellow-500' : 'text-blue-500'
                }`}
              />
            </motion.div>

            <h2
              className={`text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Quiz Selesai!
            </h2>

            <p
              className={`text-xl mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            >
              {getScoreMessage(score)}
            </p>

            <div
              className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 ${
                score >= 80
                  ? darkMode
                    ? 'bg-green-900/30 border-green-500'
                    : 'bg-green-100 border-green-500'
                  : score >= 60
                  ? darkMode
                    ? 'bg-blue-900/30 border-blue-500'
                    : 'bg-blue-100 border-blue-500'
                  : darkMode
                  ? 'bg-yellow-900/30 border-yellow-500'
                  : 'bg-yellow-100 border-yellow-500'
              } border-4`}
            >
              <span
                className={`text-4xl font-bold ${
                  score >= 80
                    ? 'text-green-500'
                    : score >= 60
                    ? 'text-blue-500'
                    : 'text-yellow-500'
                }`}
              >
                {score}
              </span>
            </div>

            <p
              className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              Kamu menjawab <span className="font-bold">{correct}</span> dari{' '}
              <span className="font-bold">{selectedQuiz.questions.length}</span> soal
              dengan benar
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  darkMode
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Kembali ke Daftar
              </button>
              <button
                onClick={() => startQuiz(selectedQuiz)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                  darkMode
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Coba Lagi
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Tampilan Daftar Quiz
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
            Quiz Interaktif
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Uji pemahaman Anda dengan quiz berdasarkan materi yang telah dipelajari.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizData.map((quiz: Quiz, index) => {
            const unlocked = isQuizUnlocked(quiz);
            const previousScore = quizScores[quiz.id];

            return (
              <motion.div
                key={quiz.id}
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
                        Quiz akan segera hadir
                      </p>
                    </div>
                  </div>
                )}

                {/* Card - Asumsi menggunakan komponen Card dengan Glassmorphism */}
                <Card
                  title={quiz.title}
                  description={quiz.description}
                  icon={Brain}
                  onClick={unlocked ? () => startQuiz(quiz) : undefined}
                  darkMode={darkMode}
                  blur={!unlocked}
                  className={!unlocked ? 'pointer-events-none' : ''}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          darkMode
                            ? 'bg-purple-900 text-purple-400'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {quiz.topic}
                      </span>
                      <span
                        className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {quiz.questions.length} soal
                      </span>
                    </div>

                    {previousScore !== undefined && (
                      <div
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          darkMode ? 'bg-gray-700/50 backdrop-blur-sm' : 'bg-gray-100/70 backdrop-blur-sm' // Diperkuat Glassmorphism di skor
                        }`}
                      >
                        <span
                          className={`text-sm font-medium ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          Skor Terakhir:
                        </span>
                        <span
                          className={`text-lg font-bold ${
                            previousScore >= 80
                              ? 'text-green-500'
                              : previousScore >= 60
                              ? 'text-blue-500'
                              : 'text-yellow-500'
                          }`}
                        >
                          {previousScore}
                        </span>
                      </div>
                    )}

                    {unlocked && (
                      <div className="flex items-center text-blue-500 hover:text-blue-600 transition-colors">
                        <span className="text-sm font-medium">Mulai Quiz</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
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

export default Quiz;