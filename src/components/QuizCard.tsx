import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizCardProps {
  question: string;
  options: string[];
  selectedAnswer: number | null;
  correctAnswer?: number;
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-xl p-6 shadow-lg`}
    >
      <div className="mb-4">
        <span
          className={`text-sm font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Pertanyaan {questionNumber} dari {totalQuestions}
        </span>
      </div>

      <h3
        className={`text-xl font-semibold mb-6 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        {question}
      </h3>

      <div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = correctAnswer === index;
          const isWrong = showResult && isSelected && !isCorrect;

          return (
            <motion.button
              key={index}
              whileHover={{ scale: showResult ? 1 : 1.02 }}
              whileTap={{ scale: showResult ? 1 : 0.98 }}
              onClick={() => !showResult && onSelectAnswer(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : isWrong
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : darkMode
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-200 bg-white'
                  : isSelected
                  ? darkMode
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-blue-500 bg-blue-50'
                  : darkMode
                  ? 'border-gray-700 hover:border-gray-600 bg-gray-800'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span
                className={`${
                  showResult && isCorrect
                    ? 'text-green-700 dark:text-green-400 font-semibold'
                    : showResult && isWrong
                    ? 'text-red-700 dark:text-red-400 font-semibold'
                    : isSelected
                    ? darkMode
                      ? 'text-blue-400 font-medium'
                      : 'text-blue-700 font-medium'
                    : darkMode
                    ? 'text-gray-300'
                    : 'text-gray-700'
                }`}
              >
                {option}
              </span>

              {showResult && isCorrect && (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              {showResult && isWrong && (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default QuizCard;
