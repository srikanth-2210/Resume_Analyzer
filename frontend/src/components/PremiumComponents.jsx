import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

/**
 * Premium Reusable Card Component
 * Used throughout the app for consistent styling
 */
export const Card = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  onClick = null,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { scale: 1.02, y: -5 } : {}}
      onClick={onClick}
      className={cn(
        'glass-card rounded-[1.75rem] border border-white/10 backdrop-blur-xl',
        'bg-gradient-to-br from-white/5 to-white/[0.02]',
        'hover:border-white/20 transition-all duration-300',
        hover ? 'cursor-pointer' : '',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Premium Button Component
 * Primary, secondary, and ghost variants
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40',
    secondary: 'bg-white/10 text-gray-100 border border-white/20 hover:bg-white/20',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5',
    danger: 'bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold rounded-lg',
    md: 'px-5 py-2.5 text-sm font-bold rounded-xl',
    lg: 'px-8 py-3.5 text-base font-bold rounded-2xl'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={cn(
        'flex items-center justify-center gap-2 transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />}
      {Icon && <Icon size={18} />}
      {children}
    </motion.button>
  );
};

/**
 * Stat Card Component
 * Displays metrics with icon and label
 */
export const StatCard = ({
  icon: Icon,
  label,
  value,
  color = 'blue',
  delay = 0
}) => {
  const colorStyles = {
    blue: { icon: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    indigo: { icon: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    purple: { icon: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  };

  const style = colorStyles[color];

  return (
    <Card delay={delay} className={`p-6 flex items-center gap-4 ${style.border}`}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`p-3 ${style.bg} rounded-xl`}
      >
        <Icon size={24} className={style.icon} />
      </motion.div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">{label}</p>
        <p className={`text-3xl font-black mt-1 ${style.icon}`}>{value}</p>
      </div>
    </Card>
  );
};

/**
 * Input Component
 * Consistent styling across the app
 */
export const Input = ({
  label,
  icon: Icon,
  error = false,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />}
        <input
          className={cn(
            'w-full px-4 py-3 rounded-xl',
            'bg-white/5 border border-white/10 backdrop-blur-xl',
            'text-gray-100 placeholder-gray-600',
            'focus:outline-none focus:border-blue-500/50 focus:bg-white/10',
            'transition-all duration-200',
            Icon ? 'pl-12' : '',
            error ? 'border-red-500/50 bg-red-500/5' : ''
          )}
          {...props}
        />
      </div>
    </div>
  );
};

/**
 * Badge Component
 * For status, tags, labels
 */
export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border border-red-500/30',
  };

  return (
    <span className={cn('px-3 py-1 rounded-lg text-xs font-bold inline-block', variants[variant], className)}>
      {children}
    </span>
  );
};

/**
 * Loading Skeleton Component
 */
export const Skeleton = ({ className = '' }) => {
  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={cn('bg-white/10 rounded-xl', className)}
    />
  );
};
