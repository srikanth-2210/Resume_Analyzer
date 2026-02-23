import React, { useState, useRef, useEffect } from "react";
import {
  UploadCloud,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Shield,
  Briefcase,
  BarChart3,
  XCircle,
  CheckCircle,
  Target,
  Copy,
  Download,
  Lightbulb,
  Zap,
  Brain,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  HelpCircle,
  Star,
  TrendingUp,
  Users,
  Award,
  Clock,
} from "lucide-react";

export default function ResumeMatcher() {
  // State Management
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [matchScore, setMatchScore] = useState(null);
  const [missingItems, setMissingItems] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // New Feedback States
  const [summary, setSummary] = useState("");
  const [formattingFeedback, setFormattingFeedback] = useState([]);
  const [actionableSteps, setActionableSteps] = useState([]);
  const [industryRelevance, setIndustryRelevance] = useState("");

  // Refs
  const fileInputRef = useRef(null);
  const jobTextareaRef = useRef(null);

  // Parse AI response to extract structured data
  const parseAIResponse = (responseText) => {
    console.log("Parsing AI response:", responseText);

    const parsedData = {
      score: 0,
      strengths: [],
      missing: [],
      analysis: responseText,
      categoryScores: {
        technical: 0,
        experience: 0,
        education: 0,
        softSkills: 0
      }
    };

    try {
      // Try to extract match score from response
      const scoreMatch = responseText.match(/(\d{1,3})%\s*(match|score|compatibility)/i);
      if (scoreMatch) {
        parsedData.score = parseInt(scoreMatch[1]);
      } else {
        // Fallback: extract any percentage in the text
        const anyScoreMatch = responseText.match(/(\d{1,3})%/);
        if (anyScoreMatch) {
          parsedData.score = parseInt(anyScoreMatch[1]);
        } else {
          parsedData.score = 75;
        }
      }

      // Extract strengths (looking for keywords)
      const strengthKeywords = [
        "strength", "strong", "excellent", "good", "proficient",
        "experienced", "skilled", "knowledgeable", "qualifies", "matches"
      ];

      const lines = responseText.split('\n');
      for (let line of lines) {
        line = line.trim().toLowerCase();

        // Look for strength indicators
        if (strengthKeywords.some(keyword => line.includes(keyword))) {
          const cleanLine = line
            .replace(/^[•\-*✓]\s*/, '')
            .replace(/^strengths?:?\s*/i, '')
            .trim();
          if (cleanLine.length > 10 && !cleanLine.includes('missing') && !cleanLine.includes('improve')) {
            parsedData.strengths.push(cleanLine.charAt(0).toUpperCase() + cleanLine.slice(1));
          }
        }

        // Look for missing items
        if (line.includes('missing') || line.includes('improve') || line.includes('lack') || line.includes('gap')) {
          const cleanLine = line
            .replace(/^[•\-*✗]\s*/, '')
            .replace(/^missing:?\s*/i, '')
            .replace(/^areas for improvement:?\s*/i, '')
            .trim();
          if (cleanLine.length > 10) {
            parsedData.missing.push(cleanLine.charAt(0).toUpperCase() + cleanLine.slice(1));
          }
        }
      }

      // Limit arrays and ensure uniqueness
      parsedData.strengths = [...new Set(parsedData.strengths.slice(0, 5))];
      parsedData.missing = [...new Set(parsedData.missing.slice(0, 5))];

      // Generate category scores based on match score
      const baseScore = parsedData.score;
      parsedData.categoryScores = {
        technical: Math.min(100, baseScore + (Math.random() * 10 - 5)),
        experience: Math.min(100, baseScore + (Math.random() * 10 - 3)),
        education: Math.min(100, baseScore + (Math.random() * 10 - 2)),
        softSkills: Math.min(100, baseScore + (Math.random() * 10 - 7))
      };

      // Fallbacks if nothing was parsed
      if (parsedData.strengths.length === 0) {
        parsedData.strengths = [
          "Strong technical skills mentioned in resume",
          "Relevant experience for the position",
          "Good educational background"
        ];
      }

      if (parsedData.missing.length === 0) {
        parsedData.missing = [
          "Could be more specific about achievements",
          "Consider adding more metrics and quantifiable results",
          "Include more technical details about projects"
        ];
      }

    } catch (error) {
      console.error("Error parsing AI response:", error);
      parsedData.score = 70;
      parsedData.strengths = ["AI analysis completed successfully"];
      parsedData.missing = ["Review the detailed analysis for specific insights"];
    }

    return parsedData;
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setResumeFile(file);
        setFileName(file.name);
        setError("");
      } else {
        setError("Please upload a PDF file only.");
        setFileName("");
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
      setFileName(file.name);
      setError("");
    } else {
      setError("Please drop a PDF file only.");
    }
  };

  // Main analysis function
  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    if (!resumeFile) {
      setError("Please upload a resume PDF.");
      return;
    }

    setLoading(true);
    setAnalyzing(true);
    setError("");
    setShowAnalysis(true);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("job_description", jobDescription);

      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/match_resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Update state with actual data from JSON
      setMatchScore(data.match_score || 0);
      setStrengths(data.strengths || []);
      setMissingItems(data.missing_skills || []);
      setFormattingFeedback(data.formatting_feedback || []);
      setActionableSteps(data.actionable_steps || []);
      setSummary(data.summary || "");
      setIndustryRelevance(data.industry_relevance || "");
      setResult(JSON.stringify(data, null, 2));

    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to connect to AI service. Please check your connection.");

      // Show error but keep UI consistent
      setMatchScore(0);
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  // Download functions
  const handleDownloadReport = () => {
    const reportContent = `
Resume Analysis Report
=======================

Job Description Preview: ${jobDescription.split('\n')[0]?.substring(0, 100) || "N/A"}...
Analyzed File: ${fileName}
Match Score: ${matchScore}%
Analysis Date: ${new Date().toLocaleString()}

ANALYSIS RESULTS:
${result}

KEY INSIGHTS:
- Match Score: ${matchScore}%
- Strengths Identified: ${strengths.length}
- Areas for Improvement: ${missingItems.length}

Generated by Resume Analyzer
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy functions
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in';
      toast.textContent = 'Copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 2000);
    });
  };

  // Reset function
  const handleReset = () => {
    setJobDescription("");
    setResumeFile(null);
    setFileName("");
    setResult("");
    setMatchScore(null);
    setMissingItems([]);
    setStrengths([]);
    setShowAnalysis(false);
    setShowTips(false);
    setShowRawData(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Score color functions
  const getScoreColor = (score) => {
    if (score >= 90) return "from-emerald-400 to-green-500";
    if (score >= 80) return "from-cyan-400 to-blue-500";
    if (score >= 70) return "from-amber-400 to-orange-500";
    return "from-rose-400 to-pink-500";
  };

  const getScoreTextColor = (score) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 80) return "text-cyan-400";
    if (score >= 70) return "text-amber-400";
    return "text-rose-400";
  };

  // Auto-resize textarea
  useEffect(() => {
    if (jobTextareaRef.current) {
      jobTextareaRef.current.style.height = 'auto';
      jobTextareaRef.current.style.height = jobTextareaRef.current.scrollHeight + 'px';
    }
  }, [jobDescription]);

  // Format result text for display
  const formatResultText = (text) => {
    if (!text) return "No analysis available.";
    return text
      .replace(/(MATCH|ANALYSIS|SUMMARY|RECOMMENDATIONS|STRENGTHS|MISSING):/gi, '\n\n$1:\n')
      .replace(/(\d+%)/g, '\n$1\n')
      .replace(/\.\s+/g, '.\n');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 p-4 md:p-8 relative overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-purple-600/20 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-fade-in">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-40 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <div className="relative p-4 bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10 ring-1 ring-white/10 shadow-2xl">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="premium-gradient-text">Resume</span>
                <span className="text-white ml-2">Analyzer</span>
              </h1>
              <p className="text-gray-400 mt-2 flex items-center gap-2">
                <Brain size={16} className="text-indigo-400" />
                Advanced AI Pattern Recognition for Career Extraction
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 glass-card rounded-2xl flex items-center gap-3 border-blue-500/20">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </div>
              <span className="text-sm font-medium text-blue-100">AI Engine active</span>
            </div>

            <button
              onClick={() => setShowTips(!showTips)}
              className="p-3 glass-card rounded-2xl hover:bg-white/10 transition-all border-white/5"
            >
              <HelpCircle size={22} className="text-gray-400" />
            </button>

            {showAnalysis && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-2xl hover:bg-red-500/10 border-red-500/20 text-red-100 group transition-all"
              >
                <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-semibold">Reset</span>
              </button>
            )}
          </div>
        </header>

        {/* Tips Banner */}
        {showTips && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold">Pro Tip:</span> Upload PDF resumes and paste complete job descriptions for the most accurate AI analysis. The AI examines keywords, skills match, experience levels, and qualifications.
                </p>
              </div>
              <button
                onClick={() => setShowTips(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Interface Layout */}
        <div className="flex flex-col gap-8 mb-12">
          {/* Top Section: Inputs & Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {/* Job Description Card */}
            <div className="glass-card rounded-[2rem] p-8 group hover:border-indigo-500/30 transition-all duration-500 flex flex-col min-h-[400px] ring-1 ring-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:bg-indigo-500/20 transition-colors">
                    <Briefcase className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Requirement Detail</h2>
                    <p className="text-sm text-gray-400">Target Role Specification</p>
                  </div>
                </div>
              </div>

              <div className="relative flex-1 flex flex-col">
                <textarea
                  ref={jobTextareaRef}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description here..."
                  className="w-full h-full glass-input rounded-2xl p-6 text-gray-200 placeholder-gray-500 transition-all outline-none resize-none leading-relaxed text-[15px] font-medium"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  {jobDescription && (
                    <button
                      onClick={() => copyToClipboard(jobDescription)}
                      className="p-2.5 glass-card rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                      title="Copy text"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Upload Card */}
            <div className="glass-card rounded-[2rem] p-8 group hover:border-purple-500/30 transition-all duration-500 flex flex-col min-h-[400px] ring-1 ring-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-colors">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Digital Assets</h2>
                    <p className="text-sm text-gray-400">PDF Profile Ingestion</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-6">
                <div
                  className={`relative flex-1 rounded-2xl border-2 border-dashed transition-all duration-500 cursor-pointer overflow-hidden
                    ${isDragging ? 'border-blue-500 bg-blue-500/10 scale-[0.98]' : 'border-white/10 bg-white/5'}
                    ${fileName ? 'border-teal-500/40 bg-teal-500/5' : 'hover:border-blue-500/30 hover:bg-white/10'}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />

                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    {fileName ? (
                      <>
                        <div className="mb-4 relative">
                          <div className="absolute inset-0 bg-teal-500/20 blur-2xl animate-pulse"></div>
                          <CheckCircle2 className="w-16 h-16 text-teal-400 relative" />
                        </div>
                        <p className="text-lg font-bold text-teal-100 mb-1 truncate max-w-full px-4">{fileName}</p>
                        <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs font-bold border border-teal-500/20">VERIFIED ASSET</span>
                      </>
                    ) : (
                      <>
                        <div className="p-5 bg-white/5 rounded-full mb-4 border border-white/5">
                          <UploadCloud className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-300 font-bold text-lg">Injest PDF Profile</p>
                        <p className="text-gray-500 text-sm mt-1">Drag & drop or click to upload</p>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !resumeFile || !jobDescription}
                  className={`premium-button w-full h-16 rounded-2xl font-black text-xl tracking-wide group
                    ${loading || !resumeFile || !jobDescription
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border-white/5'
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-indigo-500/40 active:scale-95'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-4">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="animate-pulse italic">Quantum Ingestion...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <Zap className="w-6 h-6 group-hover:scale-125 group-hover:rotate-12 transition-transform" />
                      Execute AI Analysis
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Score Visualization Card */}
            <div className="glass-card rounded-[2rem] p-8 flex flex-col border-white/10 bg-white/5 relative overflow-hidden group min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <BarChart3 size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Quantum Matching</h3>
                </div>
                {showAnalysis && (
                  <button onClick={handleDownloadReport} className="p-2 gap-2 glass-card rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center px-4 group">
                    <Download size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest hidden group-hover:inline">Report</span>
                  </button>
                )}
              </div>

              {/* Loader, Empty, or Score */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {analyzing ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-blue-500/30 blur-[40px] animate-pulse"></div>
                      <div className="w-20 h-20 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
                      <Brain className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
                    </div>
                    <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Neural Scan Active</p>
                  </div>
                ) : !showAnalysis ? (
                  <div className="text-center opacity-40">
                    <Target className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">Await analysis execution</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center animate-fade-in">
                    <div className="relative">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                        <circle
                          cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="10" fill="transparent"
                          className={`${getScoreTextColor(matchScore)}`}
                          strokeDasharray={464.7}
                          strokeDashoffset={464.7 - (464.7 * matchScore) / 100}
                          strokeLinecap="round"
                          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-white tracking-tighter">{matchScore}%</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Match</span>
                      </div>
                    </div>
                    <div className="mt-6 px-6 py-2 glass-card rounded-full border-white/10">
                      <p className={`text-xs font-black uppercase tracking-widest ${getScoreTextColor(matchScore)}`}>
                        {matchScore >= 90 ? "EXCEPTIONAL" : matchScore >= 80 ? "HIGH PROFILE" : matchScore >= 70 ? "QUALIFIED" : "LOW ALIGNMENT"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message Section */}
          {error && (
            <div className="flex items-center gap-4 p-5 glass-card rounded-2xl border-red-500/30 bg-red-500/5 animate-shake">
              <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <h4 className="font-bold text-red-200">Processing Interrupted</h4>
                <p className="text-sm text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {/* Bottom Section: Detailed Insights (Full Width) */}
          {showAnalysis && !analyzing && (
            <div className="glass-card rounded-[2rem] p-8 border-white/10 bg-white/5 animate-fade-in-up">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-xl">
                    <Sparkles size={20} className="text-purple-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-white">Advanced Insights & Intelligence</h3>
                </div>
                <div className="flex gap-2 p-1 glass-card rounded-2xl border-white/5 bg-white/5">
                  <button
                    onClick={() => setShowRawData(false)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!showRawData ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    Structured Insights
                  </button>
                  <button
                    onClick={() => setShowRawData(true)}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showRawData ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                  >
                    Neural Data Scan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {showRawData ? (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 glass-card rounded-2xl p-6 bg-gray-950/50 border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-tighter text-purple-400">RAW NEURAL DATA DISPLAY</span>
                      <button onClick={() => copyToClipboard(result)} className="p-1 px-2 glass-card rounded-lg text-[10px] text-gray-400 hover:text-white flex items-center gap-1">
                        <Copy size={10} /> CLONE DATA
                      </button>
                    </div>
                    <p className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{result}</p>
                  </div>
                ) : (
                  <>
                    {/* Left Column: Summary & Strengths */}
                    <div className="space-y-6">
                      <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase mb-3">AI Executive Summary</h4>
                        <p className="text-sm text-gray-300 leading-relaxed italic">"{summary}"</p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-teal-400 px-2 uppercase">Core Differentiators</h4>
                        {strengths.map((s, i) => (
                          <div key={i} className="glass-card rounded-2xl p-4 border-teal-500/10 hover:border-teal-500/30 transition-all flex gap-3 group">
                            <CheckCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors leading-tight">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Middle Column: Gaps & Formatting */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-rose-400 px-2 uppercase">Structural Gaps</h4>
                        {missingItems.map((m, i) => (
                          <div key={i} className="glass-card rounded-2xl p-4 border-rose-500/10 hover:border-rose-500/30 transition-all flex gap-3 group">
                            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors leading-tight">{m}</p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-indigo-400 px-2 uppercase">Formatting Intelligence</h4>
                        {formattingFeedback.map((f, i) => (
                          <div key={i} className="glass-card rounded-2xl p-4 border-indigo-500/10 hover:border-indigo-500/30 transition-all flex gap-3 group">
                            <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors leading-tight">{f}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Actionable Steps */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black tracking-[0.2em] text-amber-400 px-2 uppercase">Actionable Roadmap</h4>
                      {actionableSteps.map((a, i) => (
                        <div key={i} className="glass-card rounded-2xl p-4 border-amber-500/10 hover:border-amber-500/30 transition-all flex gap-3 group">
                          <TrendingUp className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors leading-tight">{a}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Credits */}
        <footer className="pt-12 pb-8 flex flex-col items-center justify-center border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Upload Resume • Find Gaps • Fulfill It • Achieve It</span>
          </div>
        </footer>
      </div>
    </div>
  );
}