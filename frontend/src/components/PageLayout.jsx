import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

/**
 * Global Layout Wrapper
 * Provides consistent background, spacing, and animations
 */
export default function PageLayout({
  children,
  className = '',
  showBackground = true,
}) {
  return (
    <div className={cn('min-h-screen bg-[#0B0F1A] text-gray-100 relative overflow-x-hidden', className)}>
      {/* Premium Animated Background */}
      {showBackground && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Gradient orbs - premium SaaS style */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[5%] left-[10%] w-[40%] h-[40%] bg-blue-600/8 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[10%] right-[5%] w-[50%] h-[50%] bg-purple-600/8 rounded-full blur-[130px]"
          />
          <motion.div
            animate={{
              x: [0, 30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[50%] left-[50%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[100px]"
          />

          {/* Subtle grain texture */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNyIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMiIgLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsdGVyPSJ1cmwoI25vaXNlKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 mix-blend-overlay" />
        </div>
      )}

      {/* Content container with max-width */}
      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
