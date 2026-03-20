import React from "react";
import { Sparkles, Zap, Target, Search, Brain } from "lucide-react";

const MatchingTabs = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: "insights", label: "Structured Insights", icon: Sparkles },
        { id: "deep-scan", label: "Deep Scan", icon: Search },
        { id: "skill-compare", label: "Skill Compare", icon: Target },
        { id: "interview", label: "Interview AI", icon: Brain },
        { id: "optimization", label: "Optimization", icon: Zap },
        { id: "career-fit", label: "Career Fit", icon: Target },
    ];

    return (
        <div className="flex flex-wrap gap-2 p-1.5 glass-card rounded-2xl border-white/5 bg-white/5 mb-8">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300
              ${activeTab === tab.id
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-[1.02]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                    >
                        <Icon size={14} className={activeTab === tab.id ? "animate-pulse" : ""} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
};

export default MatchingTabs;
