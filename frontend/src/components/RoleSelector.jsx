import React, { useState, useEffect } from "react";
import { Briefcase, ChevronDown } from "lucide-react";

const RoleSelector = ({ onSelect, selectedRole, apiUrl }) => {
    const [roles, setRoles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchRoles = async () => {
            const baseUrl = apiUrl || "http://127.0.0.1:8000";
            try {
                const response = await fetch(`${baseUrl}/roles`);
                const data = await response.json();
                setRoles(data);
            } catch (e) {
                console.error("Failed to fetch roles", e);
                setRoles(["Data Scientist", "ML Engineer", "Backend Engineer", "AI Researcher", "Data Analyst"]);
            }
        };
        fetchRoles();
    }, [apiUrl]);

    return (
        <div className="relative w-full">
            <div
                className="glass-input rounded-2xl p-4 flex items-center justify-between cursor-pointer group hover:bg-white/10 transition-all border border-white/5"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-200 font-medium">{selectedRole || "Select Role Template"}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full glass-card rounded-2xl border border-white/10 shadow-2xl z-[100] overflow-hidden overflow-y-auto max-h-60">
                    <div
                        className="p-4 hover:bg-white/10 cursor-pointer text-gray-300 font-medium border-b border-white/5"
                        onClick={() => {
                            onSelect("Custom");
                            setIsOpen(false);
                        }}
                    >
                        Custom / Paste JD
                    </div>
                    {roles.map((role) => (
                        <div
                            key={role}
                            className="p-4 hover:bg-white/10 cursor-pointer text-gray-300 font-medium border-b border-white/5 last:border-0"
                            onClick={() => {
                                onSelect(role);
                                setIsOpen(false);
                            }}
                        >
                            {role}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoleSelector;
