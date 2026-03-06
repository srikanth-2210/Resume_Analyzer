import React from "react";
import { Target, TrendingUp, Award } from "lucide-react";

const CareerPrediction = ({ predictions = [] }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <Target size={24} className="text-blue-400" />
                </div>
                <div>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Career Fit Prediction</h4>
                    <p className="text-sm text-gray-400 font-medium">Neural alignment against standardized industry lattices</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {predictions.map((pred, i) => (
                    <div key={i} className={`glass-card rounded-[2rem] p-8 border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500
            ${i === 0 ? " ring-2 ring-blue-500/20 bg-blue-500/5" : "bg-white/5"}
          `}>
                        {i === 0 && <div className="absolute top-4 right-4"><Award className="text-blue-400 animate-bounce" size={24} /></div>}

                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <span className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${i === 0 ? 'text-blue-400' : 'text-gray-500'}`}>
                                    {i === 0 ? "Highest Compatibility" : `Rank #${i + 1} Alignment`}
                                </span>
                                <h5 className="text-2xl font-bold text-white mb-4">{pred.role}</h5>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-end justify-between mb-2">
                                    <span className="text-3xl font-black text-white">{pred.confidence}%</span>
                                    <TrendingUp size={16} className="text-blue-500 mb-2" />
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out"
                                        style={{ width: `${pred.confidence}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerPrediction;
