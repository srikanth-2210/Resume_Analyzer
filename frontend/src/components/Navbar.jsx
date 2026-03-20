import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, FileText, Settings } from 'lucide-react';
import { Button } from './PremiumComponents';
import { cn } from '../utils/cn';

/**
 * Global Navigation Bar
 * Used across all authenticated pages
 */
export default function Navbar({ user, onLogout, page = 'dashboard' }) {
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'scan', label: 'Resume Analyzer', icon: FileText, href: '/scan' },
    { id: 'batch', label: 'Batch Analysis', icon: FileText, href: '/batch' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 border-b border-white/5"
    >
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo & Name */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-2 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl border border-blue-500/20"
          >
            <FileText size={20} className="text-blue-400" />
          </motion.div>
          <div>
            <h1 className="font-black text-white">Career Intelligence OS</h1>
            <p className="text-xs text-gray-500 font-bold">Premium Resume Analysis Platform</p>
          </div>
        </div>

        {/* Center Nav Items */}
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2',
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                )}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Online</span>
          </motion.div>

          {/* User Email */}
          {user && (
            <div className="px-4 py-2 text-xs font-bold text-gray-400 truncate max-w-[150px]">
              {user.email}
            </div>
          )}

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            icon={LogOut}
            onClick={onLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
