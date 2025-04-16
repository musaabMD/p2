"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Component that uses useSearchParams, to be wrapped in Suspense
function LoginContent() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        // Successfully logged in, reload the page to navigate to the intended destination
        window.location.href = '/';
      } else {
        // Handle error response
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Invalid password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Use URL error or state error
  const error = errorMessage || urlError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <h1 className="text-2xl font-bold ml-3">Part 2 Exam</h1>
        </div>
        
        <h2 className="text-xl font-semibold text-center mb-6">Login Required</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error === 'Invalid%20password' ? 'Invalid password' : error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Loading fallback
function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
          <div className="w-32 h-8 bg-gray-300 rounded ml-3 animate-pulse"></div>
        </div>
        <div className="w-full h-6 bg-gray-300 rounded mb-6 animate-pulse"></div>
        <div className="w-full h-36 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

// Main component that uses Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
} 