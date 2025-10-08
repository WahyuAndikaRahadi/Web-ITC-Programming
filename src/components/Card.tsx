import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  darkMode: boolean;
  children?: React.ReactNode;
  blur?: boolean;
  className?: string;
}

const Card = ({
  title,
  description,
  icon: Icon,
  onClick,
  darkMode,
  children,
  blur = false,
  className = '',
}: CardProps) => {
  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      className={`relative ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-xl p-6 transition-all ${
        onClick ? 'cursor-pointer hover:shadow-lg' : ''
      } ${blur ? 'blur-sm' : ''} ${className}`}
      onClick={onClick}
    >
      {Icon && (
        <div
          className={`inline-flex p-3 rounded-lg mb-4 ${
            darkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}

      <h3
        className={`text-xl font-semibold mb-2 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}
      >
        {title}
      </h3>

      {description && (
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          {description}
        </p>
      )}

      {children}
    </motion.div>
  );
};

export default Card;
