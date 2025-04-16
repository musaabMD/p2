"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import QuizHeaderPreview from '@/components/QuizHeaderPreview';
import Questions from '@/components/Questions';
import CountdownTimer from '@/components/CountdownTimer';

// Wrapper component that uses useSearchParams
function QuestionsContent() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();

  // Set initial filters from URL parameters
  const initialFilters = {
    searchTerm: searchParams.get('search') || '',
    subject: searchParams.get('subject') ? searchParams.get('subject').split(',') : [],
    source: searchParams.get('source') || '',
    review: searchParams.get('review') || 'review_all'
  };

  // State to hold the filters
  const [filters, setFilters] = useState(initialFilters);

  // Fetch questions based on current filters
  const fetchQuestions = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (currentFilters.searchTerm) {
        queryParams.append('search', currentFilters.searchTerm);
      }
      
      if (currentFilters.subject && currentFilters.subject.length > 0) {
        queryParams.append('subject', currentFilters.subject.join(','));
      }
      
      if (currentFilters.source) {
        queryParams.append('source', currentFilters.source);
      }
      
      if (currentFilters.review && currentFilters.review !== 'review_all') {
        queryParams.append('review', currentFilters.review);
      }
      
      console.log('Fetching questions with params:', queryParams.toString());
      
      // Fetch questions from the API
      const response = await fetch(`/api/questions?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      console.log(`Loaded ${data.length} questions`);
      setQuestions(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to load questions. Please try again later.');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch questions when filters change
  useEffect(() => {
    fetchQuestions(filters);
  }, [fetchQuestions, filters]);

  // Handle filter changes from the QuizHeaderPreview component
  const handleFiltersChange = useCallback((newFilters) => {
    console.log('Filters changed:', newFilters);
    setFilters(newFilters);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <QuizHeaderPreview 
        examName="Part 2 Exam" 
        onFiltersChange={handleFiltersChange}
        totalQuestions={questions.length}
      />
      
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto p-6">
          <CountdownTimer />
          
          {loading ? (
            <div className="text-center">
              <p>Loading questions...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <Questions questions={questions} />
          )}
        </div>
      </main>
    </div>
  );
}

// Loading fallback for Suspense
function QuestionsLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 bg-gray-200 animate-pulse"></div>
      <div className="container mx-auto p-6 text-center">
        <p>Loading questions...</p>
      </div>
    </div>
  );
}

// Main component wrapped with Suspense
export default function QuestionsPage() {
  return (
    <Suspense fallback={<QuestionsLoading />}>
      <QuestionsContent />
    </Suspense>
  );
}