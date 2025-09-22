'use client';

import React, { useState, useEffect } from 'react';
import AuthWrapper from '@/components/auth/AuthWrapper';
import Dashboard from '@/components/Dashboard';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthenticated = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <AuthWrapper onAuthenticated={handleAuthenticated} />;
  }

  return <Dashboard authToken={authToken} />;
}
