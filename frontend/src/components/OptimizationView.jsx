import React from "react";
import { Zap, AlertCircle, CheckCircle2, Target, TrendingUp, Search, ArrowRight, ShieldCheck } from "lucide-react";

const OptimizationView = ({
    optimizedBullets = [],
    structuralSuggestions = [],
    impactSummary = "",
    selectionIntelligence = null
}) => {
    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Selection Probability Header */}
            {selectionIntelligence && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 p-8 glass-card rounded-[2.5rem] bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-indigo-500/20 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/20">
                                    <Target className="w-6 h-6 text-indigo-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Selection Probability Booster</h3>
                                    <p className="text-sm text-indigo-300 font-medium tracking-wide">Recruiter Sentiment & ATS Alignment Metrics</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-end gap-3 mb-4">
                                        <span className="text-6xl font-black text-white tracking-tighter">{selectionIntelligence.probability_score}%</span>
                                        <div className="mb-2">
                                            <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/20 flex items-center gap-2">
                                                <TrendingUp size={12} className="text-emerald-400" />
                                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{selectionIntelligence.tier} Match</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                                <span>Keyword Alignment</span>
                                                <span>{selectionIntelligence.local_factors?.keyword_alignment}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${selectionIntelligence.local_factors?.keyword_alignment}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-400">
                                                <span>Impact Density</span>
                                                <span>{selectionIntelligence.local_factors?.impact_density}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${selectionIntelligence.local_factors?.impact_density}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
                                    <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Priority Action Plan</h5>
                                    <div className="space-y-3">
                                        {selectionIntelligence.priority_action_plan?.map((p, i) => (
                                            <div key={i} className="flex items-start gap-3 group">
                                                <div className="p-1.5 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                                    <ArrowRight size={12} className="text-indigo-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white font-bold leading-tight mb-0.5">{p.action}</p>
                                                    <p className="text-[10px] text-gray-400 leading-tight italic">{p.reason}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 glass-card rounded-[2.5rem] bg-amber-500/5 border-amber-500/10 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 bg-amber-500/10 rounded-xl">
                                    <Search className="w-5 h-5 text-amber-400" />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Recruiter Hooks</h4>
                            </div>
                            <div className="space-y-4">
                                {selectionIntelligence.recruiter_hooks?.map((hook, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                                        <ShieldCheck size={14} className="text-amber-500/40 group-hover:text-amber-500/80 transition-colors" />
                                        <p className="text-[11px] text-gray-300 font-medium leading-relaxed">{hook}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-8 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                            <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest text-center">First 6-Second Scan impact</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Impact Narrative */}
            <div className="p-8 glass-card rounded-[2.5rem] bg-indigo-500/[0.02] border-indigo-500/10 mb-8 flex items-center gap-6">
                <div className="p-4 bg-indigo-500/10 rounded-2xl shrink-0 hidden md:block">
                    <Zap className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-2 block">Strategic Impact Narrative</span>
                    <p className="text-sm text-gray-300 italic leading-relaxed font-medium">
                        "{impactSummary || "Selection logic calibrated towards high-performance architectural fit."}"
                    </p>
                </div>
            </div>

            {/* Structural Career Strategy */}
            {structuralSuggestions.length > 0 && (
                <div className="space-y-8">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-[1px] bg-indigo-500/30"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Structural Career Strategy</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {structuralSuggestions.map((s, i) => (
                            <div key={i} className="p-8 glass-card rounded-[2rem] bg-indigo-600/[0.02] border-indigo-500/10 group hover:border-indigo-500/40 transition-all duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                        <Zap size={18} className="text-indigo-400" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">{s.area}</span>
                                </div>
                                <p className="text-lg font-bold text-white mb-3 leading-tight tracking-tight">{s.suggestion}</p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                    <p className="text-[11px] text-gray-400 italic">Expected Outcome: {s.benefit}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bullet Point Transformation */}
            <div className="space-y-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-8 h-[1px] bg-emerald-500/30"></div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Bullet Point Transformation Engine</h4>
                </div>
                <div className="grid gap-6">
                    {optimizedBullets.map((item, i) => (
                        <div key={i} className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 hover:border-emerald-500/20 transition-all duration-500 group">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-8 bg-rose-500/[0.01] border-b lg:border-b-0 lg:border-r border-white/5 relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <AlertCircle size={14} className="text-rose-400/60" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-500/60">Legacy Draft</span>
                                    </div>
                                    <p className="text-sm text-gray-500 italic line-through leading-relaxed pr-4">{item.original}</p>
                                </div>
                                <div className="p-8 bg-emerald-500/[0.01] group-hover:bg-emerald-500/[0.03] transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 bg-emerald-500/20 rounded-lg">
                                                <CheckCircle2 size={12} className="text-emerald-400" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Elite Impact Version</span>
                                        </div>
                                        {item.method && (
                                            <span className="px-3 py-1 bg-emerald-500/10 rounded-full text-[9px] font-black text-emerald-400 border border-emerald-500/20 tracking-tighter">{item.method} OPTIMIZED</span>
                                        )}
                                    </div>
                                    <p className="text-base text-white font-bold leading-relaxed mb-6 group-hover:text-emerald-50 tracking-tight">{item.suggested}</p>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                                        <p className="text-[10px] text-gray-400 leading-relaxed">
                                            <span className="text-indigo-400 font-black uppercase tracking-widest mr-2 underline decoration-indigo-500/30">Strategic Rationale:</span>
                                            {item.reason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OptimizationView;
