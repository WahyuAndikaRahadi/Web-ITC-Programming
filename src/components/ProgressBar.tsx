import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  darkMode: boolean;
  label?: string;
  showPercentage?: boolean;
}

const ProgressBar = ({
  progress,
  darkMode,
  label,
  showPercentage = true,
}: ProgressBarProps) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {clampedProgress.toFixed(0)}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full h-3 rounded-full overflow-hidden ${
          darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            clampedProgress === 100
              ? 'bg-green-500'
              : clampedProgress >= 50
              ? 'bg-blue-500'
              : 'bg-blue-400'
          }`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
