import React, { useState, useRef, useContext } from 'react';
import { 
  UploadCloud, CheckCircle2, Loader2, ArrowLeft, Target, Shield, Users, 
  TrendingUp, Award, AlertCircle, Download 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function BatchAnalysis() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  const { token } = useContext(AuthContext);
  const fileInputRef = useRef();
  
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const handleFileChange = (e) => {
    if (e.target.files) {
      setResumes(Array.from(e.target.files));
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!jobDescription || resumes.length === 0) {
      setError("Provide a job description and at least one resume.");
      return;
    }

    setLoading(true);
    setError("");
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      resumes.forEach(r => formData.append("resumes", r));

      const response = await axios.post(`${API_URL}/batch/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setResults(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Batch processing failed.");
      console.error("Batch analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (analysisId, filename) => {
    try {
      const response = await axios.get(
        `${API_URL}/history/${analysisId}/report`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentChild?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading report:", err);
    }
  };

  const getScoreBadgeColor = (score) => {
    if (score > 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score > 70) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (score > 50) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const getMedalEmoji = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 p-4 md:p-8 relative selection:bg-purple-500/30">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[45%] h-[45%] bg-purple-600/10 rounded-full blur-[120px] animate-float"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3">
                <Users className="text-purple-400"/> Batch Candidate Assessment
              </h1>
              <p className="text-gray-400 text-sm mt-1">Analyze multiple resumes against a single job description</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Target size={16} /> Job Requirements
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-40 glass-input rounded-2xl p-4 text-sm text-gray-300 placeholder-gray-600 resize-none bg-white/5 border border-white/10 focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="glass-card rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Resume Upload</h2>
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files) setResumes(Array.from(e.dataTransfer.files)); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer group
                  ${isDragging ? "border-purple-500 bg-purple-500/10" : "border-white/10 hover:border-purple-500/30 hover:bg-white/5"}
                `}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" multiple onChange={handleFileChange} className="hidden" />
                <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${resumes.length > 0 ? "bg-purple-500/20" : ""}`}>
                  <UploadCloud className={`${resumes.length > 0 ? "text-purple-400" : "text-gray-400 group-hover:text-purple-400"} transition-colors`} size={32} />
                </div>
                <p className="text-white font-bold">{resumes.length > 0 ? `${resumes.length} resumes selected` : "Drop PDF files here"}</p>
                <span className="text-xs text-gray-500 tracking-wider mt-1">or click to select</span>
              </div>

              {resumes.length > 0 && (
                <div className="mt-4 space-y-2">
                  {resumes.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-xs">
                      <span className="text-gray-300 truncate">{r.name}</span>
                      <button
                        onClick={() => setResumes(resumes.filter((_, idx) => idx !== i))}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || resumes.length === 0 || !jobDescription}
                className={`w-full h-14 mt-6 rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-500
                  ${loading || resumes.length === 0 || !jobDescription 
                    ? "bg-gray-800 text-gray-600 cursor-not-allowed" 
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-[0_0_30px_-5px_rgba(147,51,234,0.6)]"}
                `}
              >
                {loading ? <><Loader2 size={18} className="animate-spin" /> Processing... ({resumes.length})</> : <>
                  <TrendingUp size={18} /> Analyze {resumes.length} {resumes.length === 1 ? "Resume" : "Resumes"}
                </>}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-3xl p-6 border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <Shield size={16} /> Results Leaderboard
              </h2>
              
              {!results ? (
                <div className="flex flex-col items-center justify-center py-16 opacity-40">
                  <Users size={64} className="mb-4" />
                  <p className="uppercase tracking-widest text-xs font-bold">Awaiting analysis...</p>
                  <p className="text-gray-500 text-xs mt-2">Upload resumes and select a job description to begin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.results?.length > 0 ? (
                    results.results.map((candidate, index) => (
                      <div 
                        key={index}
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="group cursor-pointer"
                      >
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-2xl font-black">
                                {getMedalEmoji(index + 1) || `#${index + 1}`}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate">{candidate.filename}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="flex-1 bg-white/5 rounded-full h-2">
                                    <div 
                                      className={`h-full rounded-full transition-all bg-gradient-to-r ${
                                        candidate.overall_score > 80 ? 'from-emerald-500 to-emerald-400' :
                                        candidate.overall_score > 70 ? 'from-blue-500 to-blue-400' :
                                        candidate.overall_score > 50 ? 'from-amber-500 to-amber-400' :
                                        'from-gray-500 to-gray-400'
                                      }`}
                                      style={{ width: `${Math.min(candidate.overall_score, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-bold text-gray-400">{Math.round(candidate.overall_score)}%</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-md text-xs font-black border ${getScoreBadgeColor(candidate.overall_score)}`}>
                                {candidate.overall_score.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {expandedIndex === index && (
                            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 uppercase tracking-widest">Skills Match</p>
                                  <p className="text-lg font-black text-blue-400">{candidate.skills_score?.toFixed(0) || candidate.match_score?.toFixed(0)}%</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 uppercase tracking-widest">Experience Match</p>
                                  <p className="text-lg font-black text-emerald-400">{candidate.experience_score?.toFixed(0)}%</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 uppercase tracking-widest">ATS Score</p>
                                  <p className="text-lg font-black text-purple-400">{candidate.ats_score?.toFixed(0)}%</p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                  <p className="text-xs text-gray-500 uppercase tracking-widest">Probability</p>
                                  <p className="text-lg font-black text-amber-400">{candidate.selection_probability?.toFixed(0)}%</p>
                                </div>
                              </div>

                              {candidate.top_missing_skills?.length > 0 && (
                                <div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Missing Top Skills</p>
                                  <div className="flex flex-wrap gap-2">
                                    {candidate.top_missing_skills.map((skill, i) => (
                                      <span key={i} className="px-2 py-1 text-xs bg-red-500/10 text-red-300 rounded border border-red-500/20">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {candidate.summary && (
                                <div>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Summary</p>
                                  <p className="text-xs text-gray-300 line-clamp-2">{candidate.summary}</p>
                                </div>
                              )}

                              {candidate.analysis_id && (
                                <button
                                  onClick={() => downloadReport(candidate.analysis_id, candidate.filename)}
                                  className="w-full mt-3 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-xs font-bold text-purple-300 flex items-center justify-center gap-2 transition-all"
                                >
                                  <Download size={14} /> Download PDF Report
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <AlertCircle size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No valid resumes could be analyzed</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
