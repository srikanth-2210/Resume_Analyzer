import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FileText, Download, Target, Calendar, ArrowRight, Loader2, BarChart3, 
  Users, TrendingUp, Award, Zap, LogOut, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import CircularProgress from '../components/CircularProgress';
import { Card, StatCard, Button } from '../components/PremiumComponents';
import PageLayout from '../components/PageLayout';
import Navbar from '../components/Navbar';
import { animationVariants } from '../utils/cn';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function Dashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/history/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch (e) {
        console.error("Failed to fetch history:", e);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchHistory();
  }, [token, API_URL]);

  const handleDownload = async (id, filename) => {
    try {
      const res = await fetch(`${API_URL}/history/${id}/report`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resume_Report_${filename}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  // Stats
  const totalScans = history.length;
  const avgScore = totalScans > 0
    ? Math.round(history.reduce((s, h) => s + (h.match_score || 0), 0) / totalScans)
    : 0;
  const bestScore = totalScans > 0
    ? Math.round(Math.max(...history.map(h => h.match_score || 0)))
    : 0;

  // Chart data
  const chartHistory = [...history].reverse().slice(-8);
  const chartData = {
    labels: chartHistory.map((h, i) => `#${i + 1}`),
    datasets: [{
      label: 'Match Score',
      data: chartHistory.map(h => h.match_score || 0),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.08)',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6366f1',
      pointRadius: 4,
    }]
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 10 } } },
      y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#6b7280', font: { size: 10 }, callback: v => `${v}%` } }
    }
  };

  return (
    <PageLayout>
      {/* Navbar */}
      <Navbar 
        user={user} 
        onLogout={() => {
          console.log("Logout clicked");
          logout();
          navigate("/login");
        }} 
        page="dashboard" 
      />

      <motion.div
        variants={animationVariants.containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* Page Header */}
        <motion.div
          variants={animationVariants.itemVariants}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Agent Portal
            </h1>
            <p className="text-gray-400 font-medium">
              Welcome back, <span className="text-blue-400 font-bold">{user?.email}</span>
            </p>
          </div>
          <Link to="/scan">
            <Button variant="primary" size="lg" icon={Plus}>
              New Scan
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={animationVariants.containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          <motion.div variants={animationVariants.itemVariants}>
            <StatCard
              icon={BarChart3}
              label="Total Scans"
              value={totalScans}
              color="blue"
            />
          </motion.div>
          <motion.div variants={animationVariants.itemVariants}>
            <StatCard
              icon={TrendingUp}
              label="Average Score"
              value={`${avgScore}%`}
              color="indigo"
            />
          </motion.div>
          <motion.div variants={animationVariants.itemVariants}>
            <StatCard
              icon={Award}
              label="Best Score"
              value={`${bestScore}%`}
              color="emerald"
            />
          </motion.div>
        </motion.div>

        {/* Chart Section */}
        {chartHistory.length > 1 && (
          <motion.div
            variants={animationVariants.itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <TrendingUp size={20} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Score Trend Analysis</h3>
              </div>
              <Line data={chartData} options={chartOptions} height={80} />
            </Card>
          </motion.div>
        )}

        {/* Analysis History Section */}
        <motion.div
          variants={animationVariants.itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <BarChart3 size={24} className="text-blue-400" />
              Analysis History
            </h2>
            {history.length > 0 && (
              <span className="text-xs font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg">
                {totalScans} {totalScans === 1 ? 'scan' : 'scans'}
              </span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : history.length === 0 ? (
            <Card className="p-16 text-center flex flex-col items-center justify-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FileText size={48} className="text-gray-600 mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No Analyses Yet</h3>
              <p className="text-gray-500 mb-8 max-w-md">
                Start your first resume analysis to generate career intelligence insights and recommendations.
              </p>
              <Link to="/scan">
                <Button variant="primary" size="lg" icon={Plus}>
                  Start Your First Scan
                </Button>
              </Link>
            </Card>
          ) : (
            <motion.div
              variants={animationVariants.containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {history.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={animationVariants.itemVariants}
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="p-6 flex flex-col h-full" hover={true}>
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-6">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="p-2 border border-blue-500/30 bg-blue-500/10 rounded-lg shrink-0"
                      >
                        <FileText size={18} className="text-blue-400" />
                      </motion.div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white truncate" title={item.resume_filename}>
                          {item.resume_filename}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Calendar size={12} />
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : 'Unknown date'}
                        </p>
                      </div>
                    </div>

                    {/* Score Display */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CircularProgress score={item.match_score} size={70} strokeWidth={4} />
                      </motion.div>
                      <div>
                        <p className="text-2xl font-black text-blue-400">{Math.round(item.match_score)}%</p>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">Match Score</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <Link to="/scan" className="flex-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          icon={ArrowRight}
                        >
                          New Scan
                        </Button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownload(item.id, item.resume_filename)}
                        className="px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-all font-bold text-sm"
                      >
                        <Download size={16} />
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </PageLayout>
  );
}
