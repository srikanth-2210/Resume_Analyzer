import React, { useState } from 'react';
import { CheckCircle2, XCircle, MinusCircle, ChevronDown, ChevronUp } from 'lucide-react';

const categoryColors = {
  "Programming":    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20" },
  "Machine Learning": { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
  "Data Analysis":  { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20" },
  "Cloud":          { bg: "bg-sky-500/10",      text: "text-sky-400",    border: "border-sky-500/20" },
  "DevOps":         { bg: "bg-orange-500/10",   text: "text-orange-400", border: "border-orange-500/20" },
  "Frontend":       { bg: "bg-pink-500/10",     text: "text-pink-400",   border: "border-pink-500/20" },
  "Backend":        { bg: "bg-emerald-500/10",  text: "text-emerald-400",border: "border-emerald-500/20" },
  "Soft Skills":    { bg: "bg-amber-500/10",    text: "text-amber-400",  border: "border-amber-500/20" },
  "Other":          { bg: "bg-gray-500/10",     text: "text-gray-400",   border: "border-gray-500/20" },
};

const StatusBadge = ({ status }) => {
  if (status === "Match") return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
      <CheckCircle2 size={12} /> Match
    </span>
  );
  if (status === "Partial Match") return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-wider">
      <MinusCircle size={12} /> Partial
    </span>
  );
  return (
    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-wider">
      <XCircle size={12} /> Missing
    </span>
  );
};

export default function SkillComparisonView({ skillComparison, resumeSkills, jdSkills, categorizedResumeSkills }) {
  const [showAllRows, setShowAllRows] = useState(false);

  const comparison = skillComparison || [];
  const matched = comparison.filter(s => s.status === "Match").length;
  const partial = comparison.filter(s => s.status === "Partial Match").length;
  const missing = comparison.filter(s => s.status === "Missing").length;
  const total = comparison.length;
  const matchPct = total > 0 ? Math.round((matched / total) * 100) : 0;

  const displayRows = showAllRows ? comparison : comparison.slice(0, 10);

  return (
    <div className="animate-fade-in space-y-10">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total JD Skills", value: total, color: "text-white" },
          { label: "Matched", value: matched, color: "text-emerald-400" },
          { label: "Partial", value: partial, color: "text-amber-400" },
          { label: "Missing", value: missing, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Match percentage bar */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">Skill Match Rate</span>
          <span className="text-xl font-black text-white">{matchPct}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden flex gap-0.5">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${total > 0 ? (matched/total)*100 : 0}%` }} />
          <div className="h-full bg-amber-500 opacity-60 rounded-full transition-all duration-1000" style={{ width: `${total > 0 ? (partial/total)*100 : 0}%` }} />
          <div className="h-full bg-red-500 opacity-40 rounded-full transition-all duration-1000" style={{ width: `${total > 0 ? (missing/total)*100 : 0}%` }} />
        </div>
        <div className="flex items-center gap-6 mt-3 text-[10px] font-bold text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Matched</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />Partial</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 opacity-60 inline-block" />Missing</span>
        </div>
      </div>

      {/* Comparison Table */}
      {comparison.length > 0 && (
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Skill-by-Skill Comparison</h4>
          <div className="overflow-hidden rounded-2xl border border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500">JD Requirement</th>
                  <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {displayRows.map((item, i) => (
                  <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-gray-200">{item.skill}</td>
                    <td className="px-5 py-3 text-right">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {comparison.length > 10 && (
              <button
                onClick={() => setShowAllRows(!showAllRows)}
                className="w-full py-3 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2 bg-white/[0.02] hover:bg-white/[0.04]"
              >
                {showAllRows
                  ? <><ChevronUp size={14} /> Show Less</>
                  : <><ChevronDown size={14} /> Show All {comparison.length} Skills</>
                }
              </button>
            )}
          </div>
        </div>
      )}

      {/* NLP Extracted Skills by Category */}
      {categorizedResumeSkills && Object.keys(categorizedResumeSkills).length > 0 && (
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Your Skills by Category (NLP Extracted)</h4>
          <div className="space-y-4">
            {Object.entries(categorizedResumeSkills).map(([category, skills]) => {
              if (!skills || skills.length === 0) return null;
              const colors = categoryColors[category] || categoryColors["Other"];
              return (
                <div key={category} className={`p-4 rounded-2xl ${colors.bg} border ${colors.border}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${colors.text} mb-3`}>{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <span key={i} className={`px-2.5 py-1 rounded-lg ${colors.bg} ${colors.text} border ${colors.border} text-xs font-bold`}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Missing Skills highlight */}
      {missing > 0 && (
        <div className="p-6 bg-red-500/5 rounded-[2rem] border border-red-500/20">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mb-4">Skills to Acquire for This Role</h4>
          <div className="flex flex-wrap gap-2">
            {comparison
              .filter(s => s.status === "Missing")
              .map((item, i) => (
                <span key={i} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold">
                  + {item.skill}
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
