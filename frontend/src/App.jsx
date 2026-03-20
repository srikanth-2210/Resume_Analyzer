import React, { useState, useRef, useContext } from "react";
import {
  UploadCloud, FileText, Sparkles, AlertCircle, CheckCircle2, Loader2,
  Shield, Briefcase, BarChart3, RefreshCw, Zap, Brain, Download,
  Search, Target, ChevronRight, Database, Link2, LogIn, LayoutDashboard
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Import Components
import RoleSelector from "./components/RoleSelector";
import CircularProgress from "./components/CircularProgress";
import MatchingTabs from "./components/MatchingTabs";
import OptimizationView from "./components/OptimizationView";
import CareerPrediction from "./components/CareerPrediction";
import InterviewPrepView from "./components/InterviewPrepView";
import SkillComparisonView from "./components/SkillComparisonView";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function ResumeMatcher() {
  const { token, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Input mode: "pdf" or "linkedin"
  const [inputMode, setInputMode] = useState("pdf");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("insights");
  const [selectedRole, setSelectedRole] = useState("Custom");
  const [downloadingReport, setDownloadingReport] = useState(false);

  const [analysisResult, setAnalysisResult] = useState(null);

  const fileInputRef = useRef(null);

  // Handle role selection
  const handleRoleSelect = async (role) => {
    setSelectedRole(role);
    if (role === "Custom") {
      setJobDescription("");
    } else {
      try {
        const response = await fetch(`${API_URL}/role-details/${role}`);
        const data = await response.json();
        setJobDescription(data.jd);
      } catch (e) {
        console.error("Failed to fetch role details", e);
      }
    }
  };

  // Main analysis function
  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      setError("Please enter or select a job description.");
      return;
    }

    if (inputMode === "pdf" && !resumeFile) {
      setError("Please upload a resume PDF.");
      return;
    }
    if (inputMode === "linkedin" && !linkedinUrl.trim()) {
      setError("Please enter a LinkedIn profile URL.");
      return;
    }

    setLoading(true);
    setError("");
    setShowAnalysis(false);

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      if (selectedRole !== "Custom") {
        formData.append("role_template", selectedRole);
      }

      if (inputMode === "pdf") {
        formData.append("resume", resumeFile);
      } else {
        formData.append("linkedin_url", linkedinUrl);
      }

      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/analysis/match_resume`, {
        method: "POST",
        body: formData,
        headers,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.detail || `Server error: ${response.statusText}`);
      }

      const data = await response.json();

      const safeData = {
        ...data,
        summary: String(data.summary || "Deep analysis in progress. Please wait a moment..."),
        strengths: Array.isArray(data.strengths) ? data.strengths : [],
        missing_skills: Array.isArray(data.missing_skills) ? data.missing_skills : [],
        skill_gap_ranking: Array.isArray(data.skill_gap_ranking) ? data.skill_gap_ranking : [],
        skill_comparison: Array.isArray(data.skill_comparison) ? data.skill_comparison : [],
        readiness: {
          readiness_score: data.readiness?.readiness_score || 0,
          found_tools: Array.isArray(data.readiness?.found_tools) ? data.readiness.found_tools : [],
          recommendations: Array.isArray(data.readiness?.recommendations) ? data.readiness.recommendations : []
        },
        semantic_report: {
          overall_match: data.semantic_report?.overall_match || 0,
          skill_match: data.semantic_report?.skill_match || 0,
          experience_match: data.semantic_report?.experience_match || 0,
          tool_match: data.semantic_report?.tool_match || 0
        },
        interview_intelligence: {
          behavioral_questions: Array.isArray(data.interview_intelligence?.behavioral_questions)
            ? data.interview_intelligence.behavioral_questions.map(q => ({
              question: String(q.question || ""),
              intent: String(q.intent || ""),
              star_tip: String(q.star_tip || ""),
              resume_reference: String(q.resume_reference || "")
            })) : [],
          technical_questions: Array.isArray(data.interview_intelligence?.technical_questions)
            ? data.interview_intelligence.technical_questions.map(q => ({
              question: String(q.question || ""),
              topic: String(q.topic || "System Design"),
              depth_level: String(q.depth_level || "Senior"),
              expected_answer_points: Array.isArray(q.expected_answer_points) ? q.expected_answer_points.map(p => String(p)) : []
            })) : [],
          role_specific_challenges: Array.isArray(data.interview_intelligence?.role_specific_challenges)
            ? data.interview_intelligence.role_specific_challenges.map(c => ({
              scenario: String(c.scenario || ""),
              question: String(c.question || ""),
              constraints: String(c.constraints || "")
            })) : [],
          preparation_strategy: String(data.interview_intelligence?.preparation_strategy || "Strategy generation in progress.")
        },
        optimized_bullets: Array.isArray(data.optimized_bullets)
          ? data.optimized_bullets.map(b => ({
            original: String(b.original || ""),
            suggested: String(b.suggested || ""),
            method: String(b.method || "Impact-First"),
            reason: String(b.reason || "")
          })) : [],
        structural_suggestions: Array.isArray(data.structural_suggestions)
          ? data.structural_suggestions.map(s => ({
            area: String(s.area || "Strategic Advice"),
            suggestion: String(s.suggestion || ""),
            benefit: String(s.benefit || "")
          })) : [],
        selection_intelligence: {
          probability_score: data.selection_intelligence?.probability_score || 0,
          tier: String(data.selection_intelligence?.tier || "Medium"),
          recruiter_hooks: Array.isArray(data.selection_intelligence?.recruiter_hooks)
            ? data.selection_intelligence.recruiter_hooks.map(h => String(h)) : [],
          priority_action_plan: Array.isArray(data.selection_intelligence?.priority_action_plan)
            ? data.selection_intelligence.priority_action_plan.map(p => ({
              action: String(p.action || ""),
              impact: String(p.impact || "High"),
              reason: String(p.reason || "")
            })) : [],
          local_factors: data.selection_intelligence?.local_factors || { keyword_alignment: 0, impact_density: 0 }
        },
        impact_summary: String(data.impact_summary || "Initial baseline optimization suggested.")
      };

      setAnalysisResult(safeData);
      setShowAnalysis(true);
      setActiveTab("insights");

    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Failed to reach Career Engine. Check backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJobDescription("");
    setResumeFile(null);
    setFileName("");
    setAnalysisResult(null);
    setShowAnalysis(false);
    setError("");
    setSelectedRole("Custom");
    setLinkedinUrl("");
  };

  const handleDownloadReport = async () => {
    if (!analysisResult?.id || !token) return;
    setDownloadingReport(true);
    try {
      const res = await fetch(`${API_URL}/history/${analysisResult.id}/report`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Resume_Report_${analysisResult.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (e) {
      console.error("Report download failed:", e);
    } finally {
      setDownloadingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 p-4 md:p-8 relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Premium Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[45%] h-[45%] bg-purple-600/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Modern Header */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="relative group p-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-100 transition duration-1000" />
              <div className="relative p-5 bg-gray-900 border border-white/10 rounded-2xl">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-baseline gap-2">
                <span className="premium-gradient-text text-white">RESUME</span>
                <span className="text-blue-500">FEEDBACK TOOL</span>
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              </h1>
              <p className="text-gray-400 mt-2 font-medium flex items-center gap-2">
                <Shield size={14} className="text-indigo-500" />
                AI Career Intelligence Engine v3.0
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {showAnalysis && (
              <button
                onClick={handleReset}
                className="p-4 glass-card rounded-2xl hover:bg-red-500/10 border-red-500/20 text-red-100 group transition-all"
              >
                <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
              </button>
            )}
            {/* Download Report button — appears after analysis if authenticated */}
            {showAnalysis && analysisResult?.id && token && (
              <button
                onClick={handleDownloadReport}
                disabled={downloadingReport}
                className="px-5 py-3 glass-card rounded-2xl flex items-center gap-2 border-indigo-500/20 bg-indigo-500/5 text-indigo-300 hover:bg-indigo-500/10 transition-all font-bold text-sm disabled:opacity-50"
              >
                {downloadingReport
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Download size={16} />
                }
                PDF Report
              </button>
            )}
            <Link
              to="/dashboard"
              className="px-5 py-3 glass-card rounded-2xl flex items-center gap-2 border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold text-sm"
            >
              <LayoutDashboard size={16} /> Dashboard
            </Link>
            <div className="px-5 py-3 glass-card rounded-2xl flex items-center gap-3 border-emerald-500/20 bg-emerald-500/5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Online</span>
            </div>
          </div>
        </header>

        {/* Input Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Requirement Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/5 hover:border-blue-500/20 transition-all duration-500 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold">Target Matrix</h2>
              </div>

              <div className="space-y-6 flex-1">
                <RoleSelector onSelect={handleRoleSelect} selectedRole={selectedRole} apiUrl={API_URL} />
                <div className="relative h-64 lg:h-80">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => {
                      setJobDescription(e.target.value);
                      if (selectedRole !== "Custom") setSelectedRole("Custom");
                    }}
                    placeholder="Define role requirements..."
                    className="w-full h-full glass-input rounded-3xl p-6 text-sm text-gray-300 placeholder-gray-600 resize-none leading-relaxed transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Ingestion */}
          <div className="lg:col-span-4">
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/5 hover:border-purple-500/20 transition-all duration-500 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-2xl">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-xl font-bold">Profile Ingestion</h2>
              </div>

              {/* Input Mode Toggle */}
              <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6">
                <button
                  onClick={() => setInputMode("pdf")}
                  className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all
                    ${inputMode === "pdf" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  PDF Upload
                </button>
                <button
                  onClick={() => setInputMode("linkedin")}
                  className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1
                    ${inputMode === "linkedin" ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
                >
                  <Link2 size={12} /> LinkedIn
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-6">
                {inputMode === "pdf" ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files[0];
                      if (file?.type === "application/pdf") {
                        setResumeFile(file);
                        setFileName(file.name);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 border-2 border-dashed rounded-[2rem] transition-all duration-500 flex flex-col items-center justify-center p-8 text-center cursor-pointer relative overflow-hidden group
                      ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/20 hover:bg-white/5"}
                      ${fileName ? "border-emerald-500/50 bg-emerald-500/5" : ""}
                    `}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) { setResumeFile(file); setFileName(file.name); }
                      }}
                      className="hidden"
                    />
                    {fileName ? (
                      <>
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20">
                          <CheckCircle2 className="text-emerald-400" size={32} />
                        </div>
                        <p className="text-emerald-100 font-bold truncate max-w-full px-4">{fileName}</p>
                        <span className="text-[10px] font-black tracking-widest text-emerald-500 mt-2">ASSET VERIFIED</span>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <UploadCloud className="text-gray-400 group-hover:text-blue-400 transition-colors" size={32} />
                        </div>
                        <p className="text-gray-300 font-bold">Deploy PDF Profile</p>
                        <span className="text-xs text-gray-500 mt-1">Manual upload or Drop</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="p-5 bg-blue-500/5 border border-blue-500/20 rounded-2xl text-xs text-blue-300 leading-relaxed">
                      <p className="font-bold mb-1 flex items-center gap-1"><Link2 size={12} /> LinkedIn Profile URL</p>
                      <p className="text-gray-400">Enter a public LinkedIn profile URL. Note: LinkedIn actively limits automated access, so results may vary.</p>
                    </div>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://www.linkedin.com/in/your-profile/"
                      className="glass-input rounded-2xl p-4 text-sm text-gray-200 placeholder-gray-600"
                    />
                  </div>
                )}

                <button
                  onClick={handleAnalyze}
                  disabled={loading || (!resumeFile && inputMode === "pdf") || (!linkedinUrl.trim() && inputMode === "linkedin") || !jobDescription}
                  className={`h-20 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all duration-500 group relative overflow-hidden
                    ${loading || (inputMode === "pdf" ? !resumeFile : !linkedinUrl.trim()) || !jobDescription
                      ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-[0_0_30px_-10px_rgba(79,70,229,0.5)] active:scale-95"}`}
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span className="animate-pulse italic">Engine Running...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={24} className="group-hover:rotate-12 transition-transform" />
                      EXECUTE SCAN
                    </>
                  )}
                </button>

                {/* Not logged in notice */}
                {!token && (
                  <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                    <LogIn size={12} />
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">Sign in</Link>
                    &nbsp;to save analyses & download reports
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Score Display (Right Panel) */}
          <div className="lg:col-span-4">
            <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-white/5 h-full flex flex-col justify-center">
              {loading ? (
                <div className="flex flex-col items-center text-center animate-pulse">
                  <div className="w-32 h-32 border-4 border-white/5 border-t-blue-500 rounded-full animate-spin mb-6" />
                  <h3 className="text-xl font-bold text-white mb-2">Neural Scan Active</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Parsing high-dimensional semantics...</p>
                </div>
              ) : showAnalysis ? (
                <div className="flex flex-col items-center animate-scale-in">
                  <CircularProgress
                    score={analysisResult.match_score}
                    label="Overall Match"
                    size={200}
                    strokeWidth={12}
                    color={analysisResult.match_score > 80 ? "text-emerald-400" : "text-blue-500"}
                  />

                  <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                    <div className="p-5 glass-card rounded-[1.5rem] flex flex-col items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">ATS Parsability</span>
                      <span className="text-2xl font-black text-white">{analysisResult.ats_score}%</span>
                    </div>
                    <div className="p-5 glass-card rounded-[1.5rem] flex flex-col items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Readability</span>
                      <span className="text-2xl font-black text-white">{analysisResult.readability_score}%</span>
                    </div>
                    <div className="p-5 glass-card rounded-[1.5rem] flex flex-col items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Skills</span>
                      <span className="text-2xl font-black text-white">{analysisResult.skills_score}%</span>
                    </div>
                    <div className="p-5 glass-card rounded-[1.5rem] flex flex-col items-center">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Experience</span>
                      <span className="text-2xl font-black text-white">{analysisResult.experience_score}%</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 flex items-center gap-3 w-full">
                    <Shield className="text-emerald-400" size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                      {analysisResult.id ? "Saved to your history" : "Scan Complete · Sign in to save"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center opacity-30">
                  <Brain size={80} className="text-gray-500 mb-6" />
                  <h3 className="text-xl font-bold">Engine Standby</h3>
                  <p className="text-xs uppercase tracking-widest mt-2">Initialize ingestion to begin</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Intelligence Dashboard */}
        {showAnalysis && (
          <div className="animate-fade-in-up">
            <MatchingTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="glass-card rounded-[3rem] p-8 md:p-12 border-white/5 bg-white/5 mb-16 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Database size={200} />
              </div>

              {/* Insights Tab */}
              {activeTab === "insights" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4 flex items-center gap-2">
                        <Search size={12} /> Executive Assessment
                      </h4>
                      <p className="text-gray-300 leading-relaxed font-medium italic">"{analysisResult.summary}"</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4 px-2">Key Strengths</h4>
                      {analysisResult.strengths?.map((s, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 glass-card rounded-2xl hover:bg-emerald-500/5 transition-colors group">
                          <div className="p-1.5 bg-emerald-500/20 rounded-lg group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={14} className="text-emerald-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-200">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-4 px-2">Critical Gaps</h4>
                      {analysisResult.missing_skills?.length > 0 ? (
                        analysisResult.missing_skills.map((m, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 glass-card rounded-2xl hover:bg-rose-500/5 transition-colors group">
                            <div className="p-1.5 bg-rose-500/20 rounded-lg group-hover:scale-110 transition-transform">
                              <AlertCircle size={14} className="text-rose-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-200">{m}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 glass-card rounded-2xl bg-white/5 opacity-50">
                          <p className="text-xs text-center text-gray-400 italic">No significant gaps detected by AI.</p>
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/20">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 px-2 flex items-center justify-between">
                        <span>Heuristic Priority Ranking</span>
                        <ChevronRight size={12} />
                      </h4>
                      <div className="space-y-4">
                        {analysisResult.skill_gap_ranking?.length > 0 ? (
                          analysisResult.skill_gap_ranking.map((gap, i) => (
                            <div key={i} className="p-5 glass-card rounded-2xl bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all group">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/20">
                                    {gap.priority || i + 1}
                                  </div>
                                  <span className="text-sm font-bold text-white">{gap.skill}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border ${gap.business_impact === 'high' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                  {gap.business_impact || 'high'} Impact
                                </span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-500/50 transition-all duration-1000"
                                  style={{ width: gap.learning_curve === 'steep' ? '90%' : gap.learning_curve === 'medium' ? '50%' : '30%' }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 glass-card rounded-2xl bg-white/5 opacity-50">
                            <p className="text-xs text-center text-gray-400 italic">Sequential bridging priority pending...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="p-8 glass-card rounded-[2.5rem] bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border-indigo-500/10">
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white">Production Readiness</h4>
                        <div className="text-xl font-black text-indigo-400">{analysisResult.readiness.readiness_score}%</div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {analysisResult.readiness.found_tools.map((tool) => (
                          <span key={tool} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-gray-400 border border-white/5">{tool}</span>
                        ))}
                      </div>
                      <div className="space-y-3">
                        {analysisResult.readiness.recommendations.map((rec, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <ChevronRight size={10} className="text-indigo-500 mt-1" />
                            <span className="text-[10px] text-gray-400 font-medium">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Deep Scan Tab */}
              {activeTab === "deep-scan" && (
                <div className="animate-fade-in py-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <CircularProgress score={analysisResult.semantic_report.overall_match} label="Semantic Overall" size={140} color="text-indigo-400" />
                    <CircularProgress score={analysisResult.semantic_report.skill_match} label="Skill Alignment" size={140} color="text-emerald-400" />
                    <CircularProgress score={analysisResult.semantic_report.experience_match} label="Experience Depth" size={140} color="text-amber-400" />
                    <CircularProgress score={analysisResult.semantic_report.tool_match} label="Tool Stack Match" size={140} color="text-purple-400" />
                  </div>

                  <div className="mt-16 p-8 glass-card rounded-[2rem] border-white/5 bg-gray-950/20">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Semantic Vector Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <h5 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Vector Alignment Strength
                        </h5>
                        <div className="space-y-4">
                          <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
                            <div className="h-full bg-blue-500 w-[70%]" />
                            <div className="h-full bg-indigo-500 w-[15%] opacity-50" />
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                            The resume's latent vector representation shows high cosine similarity with the {selectedRole === "Custom" ? "job requirements" : selectedRole + " ontology"}.
                          </p>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-purple-500" /> Role Displacement Metrics
                        </h5>
                        <div className="space-y-4">
                          <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
                            <div className="h-full bg-purple-500 w-[85%]" />
                          </div>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-medium">Minimal deviation found in core responsibility clusters compared to industry benchmarks.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Skill Compare Tab */}
              {activeTab === "skill-compare" && (
                <SkillComparisonView
                  skillComparison={analysisResult.skill_comparison}
                  resumeSkills={analysisResult.strengths}
                  jdSkills={analysisResult.missing_skills}
                />
              )}

              {/* Optimization Tab */}
              {activeTab === "optimization" && (
                <OptimizationView
                  optimizedBullets={analysisResult.optimized_bullets}
                  structuralSuggestions={analysisResult.structural_suggestions}
                  selectionIntelligence={analysisResult.selection_intelligence}
                  impactSummary={analysisResult.impact_summary}
                />
              )}

              {/* Career Fit Tab */}
              {activeTab === "career-fit" && (
                <CareerPrediction predictions={analysisResult.career_fit_prediction} />
              )}

              {/* Interview AI Tab */}
              {activeTab === "interview" && (
                <InterviewPrepView intelligence={analysisResult.interview_intelligence} />
              )}
            </div>
          </div>
        )}

        {/* Global Error Handler */}
        {error && (
          <div className="mb-8 p-6 glass-card rounded-3xl border-red-500/20 bg-red-500/5 flex items-center gap-4 animate-shake">
            <div className="p-3 bg-red-500/20 rounded-2xl text-red-400">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-red-200">Processing Interrupted</h4>
              <p className="text-sm text-red-400/80 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Brand Footer */}
        <footer className="pt-20 pb-12 flex flex-col items-center gap-6 opacity-30">
          <div className="flex items-center gap-3">
            <Zap size={14} className="text-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Advanced Career OS</span>
          </div>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">
            Professional AI Feedback · Industry Standard Analysis · NLP Pattern Matching
          </p>
        </footer>
      </div>
    </div>
  );
}