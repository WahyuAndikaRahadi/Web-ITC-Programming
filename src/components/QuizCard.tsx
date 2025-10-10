import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizCardProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer?: number; // Opsional, hanya ada saat showResult=true
  onSelectAnswer: (index: number) => void;
  showResult: boolean;
  darkMode: boolean;
  questionNumber: number;
  totalQuestions: number;
}

const QuizCard = ({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  onSelectAnswer,
  showResult,
  darkMode,
  questionNumber,
  totalQuestions,
}: QuizCardProps) => {
  // GLASSMORPHISM BASE CLASSES
  const glassmorphismContainer = darkMode
    ? 'bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 shadow-xl shadow-gray-900/50' 
    : 'bg-white/50 backdrop-blur-lg border border-gray-200/50 shadow-lg shadow-gray-100/50';

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index); // 65 adalah kode ASCII untuk 'A'
  };

  const getOptionClasses = (index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = correctAnswer === index;
    const isIncorrect = isSelected && showResult && !isCorrect;

    // Base option class (Glassmorphism & Interactive)
    let classes = `p-4 rounded-xl cursor-pointer transition-all flex items-start text-left min-h-[60px] relative
                   ${
                     darkMode 
                       ? 'bg-gray-700/40 hover:bg-gray-700/60 border border-transparent hover:border-blue-600'
                       : 'bg-white/40 hover:bg-white/60 border border-transparent hover:border-blue-500'
                   }`;

    // Styling saat dipilih (Sebelum Hasil Muncul)
    if (isSelected && !showResult) {
      classes += darkMode ? ' border-blue-500 ring-2 ring-blue-500' : ' border-blue-500 ring-2 ring-blue-500';
    }

    // Styling setelah Hasil Muncul (showResult=true)
    if (showResult) {
      if (isCorrect) {
        // Jawaban Benar
        classes = `p-4 rounded-xl flex items-start text-left min-h-[60px] relative border-2 ring-2 
                   ${darkMode 
                      ? 'bg-green-900/50 border-green-500 ring-green-500' 
                      : 'bg-green-100/70 border-green-500 ring-green-500'}`;
      } else if (isIncorrect) {
        // Jawaban Salah
        classes = `p-4 rounded-xl flex items-start text-left min-h-[60px] relative border-2 ring-2 
                   ${darkMode 
                      ? 'bg-red-900/50 border-red-500 ring-red-500' 
                      : 'bg-red-100/70 border-red-500 ring-red-500'}`;
      } else {
        // Opsi yang tidak dipilih dan bukan jawaban benar/salah
        classes = `p-4 rounded-xl flex items-start text-left min-h-[60px] relative ${
          darkMode ? 'bg-gray-800/20 text-gray-400' : 'bg-gray-100/50 text-gray-500'
        } opacity-70 cursor-default`;
      }
    }

    return classes;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
      className={`p-6 rounded-xl space-y-6 ${glassmorphismContainer}`}
    >
      {/* Header Soal & Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Soal #{questionNumber}
          </h3>
          <span className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {questionNumber}/{totalQuestions}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
            <div 
                className="h-1.5 rounded-full bg-blue-500 transition-all duration-500 ease-out" 
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
        </div>
      </div>

      {/* Pertanyaan */}
      <p className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
        {question}
      </p>

      {/* Opsi Jawaban */}
      <div className="space-y-4">
        {options.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: showResult ? 1 : 1.01 }}
            whileTap={{ scale: showResult ? 1 : 0.98 }}
            onClick={() => !showResult && onSelectAnswer(index)}
            className={getOptionClasses(index)}
          >
            {/* Label A/B/C/D */}
            <span 
              className={`mr-3 w-6 h-6 flex items-center justify-center font-bold flex-shrink-0 rounded-full text-sm 
                ${showResult && correctAnswer === index 
                  ? 'bg-green-500 text-white' 
                  : showResult && selectedAnswer === index && selectedAnswer !== correctAnswer
                  ? 'bg-red-500 text-white'
                  : darkMode 
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-300 text-gray-800'
                }`}
            >
              {getOptionLabel(index)}
            </span>
            
            {/* Teks Opsi */}
            <p className={`flex-grow ${darkMode ? 'text-gray-200' : 'text-gray-800'} ${showResult && correctAnswer !== index && selectedAnswer !== index ? 'opacity-70' : ''}`}>
              {option}
            </p>

            {/* Icon Status */}
            {showResult && (
              <div className="ml-3 flex-shrink-0">
                {correctAnswer === index ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : selectedAnswer === index ? (
                  <XCircle className="w-6 h-6 text-red-500" />
                ) : null}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuizCard;