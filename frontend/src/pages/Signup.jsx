import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const success = await signup(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Failed to create account. User might already exist.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-gray-100 flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[35%] h-[45%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10 glass-card p-10 rounded-[2.5rem] border-white/10 bg-white/5">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-gray-900 border border-white/10 rounded-2xl mb-4 group hover:border-purple-500/50 transition-colors">
            <Shield className="w-8 h-8 text-purple-400 group-hover:text-purple-300 transition-colors" />
          </div>
          <h1 className="text-3xl font-black text-white">Initialize Profile</h1>
          <p className="text-gray-400 mt-2 text-sm">Join Career Intelligence OS</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input rounded-2xl p-4 text-sm text-gray-200"
              placeholder="agent@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Secure Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input rounded-2xl p-4 text-sm text-gray-200"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_-5px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_-5px_rgba(147,51,234,0.6)]"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Already authorized? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-bold transition-colors">Access Profile</Link>
        </p>
      </div>
    </div>
  );
}
