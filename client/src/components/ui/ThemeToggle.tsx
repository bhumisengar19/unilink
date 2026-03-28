import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`
        relative w-16 h-8 rounded-full p-1 cursor-pointer overflow-hidden
        ${theme === 'dark' ? 'bg-slate-700' : 'bg-blue-100'}
        transition-colors duration-400 neu-card border-none
        ${className}
      `}
      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
      aria-label="Toggle Theme"
    >
      <motion.div
        className={`
          w-6 h-6 rounded-full flex items-center justify-center
          ${theme === 'dark' ? 'bg-indigo-400 text-white' : 'bg-yellow-400 text-white'}
          shadow-lg
        `}
        animate={{
          x: theme === 'dark' ? 32 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        <AnimatePresence mode='wait' initial={false}>
          {theme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={14} />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
