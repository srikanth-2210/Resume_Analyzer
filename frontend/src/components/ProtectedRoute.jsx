import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useContext(AuthContext);
  const [timeout, setTimeout] = useState(false);

  useEffect(() => {
    // Set a 5-second timeout for loading state
    const timer = setInterval(() => {
      if (loading) {
        setTimeout(true);
      }
    }, 5000);
    
    return () => clearInterval(timer);
  }, [loading]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-blue-500 w-16 h-16 mb-4" />
        <p className="text-gray-400 text-sm font-medium">Loading Career OS...</p>
        {timeout && (
          <p className="text-yellow-400 text-xs mt-4 text-center max-w-xs">
            This is taking longer than expected. If it persists, refresh the page.
          </p>
        )}
      </div>
    );
  }

  return children;
}
