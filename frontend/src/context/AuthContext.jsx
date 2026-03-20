import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    if (token) {
      // Fetch profile in background, don't block loading state
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Invalid token');
      })
      .then(data => {
        setUser(data);
      })
      .catch((err) => {
        console.error("Auth error:", err);
        // Even if profile fetch fails, token is valid - don't logout
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });
      
      return () => {
        clearTimeout(timeout);
        controller.abort();
      };
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    console.log("\n📧 LOGIN REQUEST");
    console.log(`  Email: ${email}`);
    console.log(`  Password length: ${password.length} chars`);
    
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);
    
    console.log(`  Sending to: ${API_URL}/auth/login`);

    try {
      console.log("  Sending request...");
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
        timeout: 10000 // 10 second timeout
      });
      
      console.log(`  Response status: ${res.status}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log(`  ✓ Login successful! Token: ${data.access_token?.substring(0, 50)}...`);
        localStorage.setItem('token', data.access_token);
        // Set user immediately without waiting for profile fetch
        setUser({ email });
        setToken(data.access_token);
        setLoading(false);
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.log(`  ❌ Login failed! Error:`, errorData);
        return false;
      }
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const signup = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        timeout: 10000 // 10 second timeout
      });
      if (res.ok) {
        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          // Set user immediately without waiting for profile fetch
          setUser({ email });
          setToken(data.access_token);
          setLoading(false);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
