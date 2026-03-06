import React from 'react';
import { HelpCircle, Brain, ChevronRight, MessageSquare, Target, Zap } from "lucide-react";

export default function InterviewPrepView({ intelligence }) {
    if (!intelligence) return null;

    return (
        <div className="space-y-12 py-6 animate-fade-in">
            {/* Strategy Header */}
            <div className="p-8 glass-card rounded-[2.5rem] bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border-blue-500/10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <Brain className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Strategic Preparation</h3>
                </div>
                <p className="text-gray-300 leading-relaxed italic">
                    "{intelligence.preparation_strategy}"
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Behavioral Questions */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 px-2 flex items-center gap-2">
                        <MessageSquare size={12} /> Personalized Behavioral Intelligence
                    </h4>
                    <div className="space-y-4">
                        {intelligence.behavioral_questions?.map((q, i) => (
                            <div key={i} className="p-6 glass-card rounded-3xl group hover:border-purple-500/30 transition-all border-white/5">
                                {q.resume_reference && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="px-2 py-0.5 bg-purple-500/10 rounded-md text-[8px] font-black text-purple-400 border border-purple-500/20 uppercase tracking-widest">
                                            Reference: {q.resume_reference}
                                        </div>
                                    </div>
                                )}
                                <p className="text-white font-bold mb-4 leading-relaxed">{q.question}</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                                        <Target size={14} className="text-purple-400 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-1">Impact Intent</p>
                                            <p className="text-xs text-gray-400 leading-relaxed">{q.intent}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                        <HelpCircle size={14} className="text-emerald-400 mt-1 shrink-0" />
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Contextual Tip</p>
                                            <p className="text-xs text-gray-400 leading-relaxed">{q.star_tip}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technical Domain */}
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 px-2 flex items-center gap-2">
                        <Target size={12} /> Architectural Deep Dive
                    </h4>
                    <div className="space-y-4">
                        {intelligence.technical_questions?.map((q, i) => (
                            <div key={i} className="p-6 glass-card rounded-3xl group hover:border-blue-500/30 transition-all border-white/5">
                                <div className="flex items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-500/10 rounded-lg">
                                            <ChevronRight size={12} className="text-blue-400" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{q.topic || 'System Design'}</span>
                                    </div>
                                    {q.depth_level && (
                                        <span className="px-2 py-0.5 bg-indigo-500/10 rounded-md text-[8px] font-black text-indigo-400 border border-indigo-500/20">{q.depth_level} LEVEL</span>
                                    )}
                                </div>
                                <p className="text-white font-bold mb-4 leading-relaxed">{q.question}</p>
                                <div className="space-y-2.5 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-2">Key Talking Points</p>
                                    {q.expected_answer_points?.map((point, j) => (
                                        <div key={j} className="flex items-start gap-2">
                                            <Target size={10} className="text-blue-500 mt-1 shrink-0" />
                                            <span className="text-xs text-gray-300 leading-relaxed">{point}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Role Specific Challenges */}
            <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 px-2 flex items-center gap-2">
                    <Zap size={12} /> High-Stakes Production Scenarios
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {intelligence.role_specific_challenges?.map((c, i) => (
                        <div key={i} className="p-8 glass-card rounded-[2rem] bg-amber-500/[0.02] border-amber-500/10 group hover:border-amber-500/30 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-amber-400/60 uppercase tracking-[0.2em]">Scenario {i + 1}</span>
                                <HelpCircle size={14} className="text-amber-500/40" />
                            </div>
                            <p className="text-sm text-gray-300 mb-6 leading-relaxed font-medium">{c.scenario}</p>
                            {c.constraints && (
                                <div className="mb-6 p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
                                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-1">Operational Constraint</p>
                                    <p className="text-[11px] text-gray-400 italic">{c.constraints}</p>
                                </div>
                            )}
                            <div className="pt-6 border-t border-white/5">
                                <p className="text-white text-sm font-bold leading-relaxed">{c.question}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
