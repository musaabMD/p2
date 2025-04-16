"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CircleCheck, CircleAlert, BookmarkCheck, Clock } from "lucide-react";
import CountdownTimer from '@/components/CountdownTimer';

export default function Home() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    pinnedQuestions: 0,
    incorrectQuestions: 0,
    correctQuestions: 0,
    subjectStats: [],
    sourceStats: []
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all questions to calculate stats
        const response = await fetch('/api/questions');
        if (!response.ok) throw new Error('Failed to fetch questions');
        
        const questions = await response.json();
        
        // Calculate overall stats
        const totalQuestions = questions.length;
        const pinnedQuestions = questions.filter(q => q.pinned).length;
        const incorrectQuestions = questions.filter(q => q.incorrect > 0).length;
        const correctQuestions = questions.filter(q => q.correct > 0).length;
        
        // Calculate score percentage (correct answers vs total answers)
        const totalAnswers = questions.reduce((total, q) => total + q.correct + q.incorrect, 0);
        const correctAnswers = questions.reduce((total, q) => total + q.correct, 0);
        const scorePercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
        
        // Calculate stats by subject
        const subjectMap = new Map();
        questions.forEach(question => {
          if (!question.subject) return;
          
          const currentStats = subjectMap.get(question.subject) || {
            name: question.subject,
            total: 0,
            correct: 0,
            incorrect: 0
          };
          
          currentStats.total++;
          currentStats.correct += question.correct;
          currentStats.incorrect += question.incorrect;
          
          subjectMap.set(question.subject, currentStats);
        });
        
        // Calculate stats by source
        const sourceMap = new Map();
        questions.forEach(question => {
          if (!question.source) return;
          
          const currentStats = sourceMap.get(question.source) || {
            name: question.source,
            total: 0,
            correct: 0,
            incorrect: 0
          };
          
          currentStats.total++;
          currentStats.correct += question.correct;
          currentStats.incorrect += question.incorrect;
          
          sourceMap.set(question.source, currentStats);
        });
        
        // Convert maps to arrays and calculate percentages
        const subjectStats = Array.from(subjectMap.values()).map(subject => ({
          ...subject,
          percentage: subject.correct + subject.incorrect > 0 
            ? Math.round((subject.correct / (subject.correct + subject.incorrect)) * 100) 
            : 0
        }));
        
        const sourceStats = Array.from(sourceMap.values()).map(source => ({
          ...source,
          percentage: source.correct + source.incorrect > 0 
            ? Math.round((source.correct / (source.correct + source.incorrect)) * 100) 
            : 0
        }));
        
        setStats({
          totalQuestions,
          pinnedQuestions,
          incorrectQuestions,
          correctQuestions,
          scorePercentage,
          subjectStats,
          sourceStats
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">Hi Musaab!🫡 </h1>
            
            <CountdownTimer />
            
            <h1 className="text-3xl font-bold mb-8 text-center text-green-700">  </h1>

      <h1 className="text-3xl font-bold mb-8 text-center">Part 2 Exam Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <p>Loading exam statistics...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-medium">Total Questions</h3>
                <p className="text-3xl font-bold">{stats.totalQuestions}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CircleCheck className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-medium">Correct Answers</h3>
                <p className="text-3xl font-bold">{stats.correctQuestions}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <CircleAlert className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-medium">Incorrect Answers</h3>
                <p className="text-3xl font-bold">{stats.incorrectQuestions}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <BookmarkCheck className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-medium">Pinned Questions</h3>
                <p className="text-3xl font-bold">{stats.pinnedQuestions}</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Overall Score */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Overall Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-2">
                  <span>Score</span>
                  <span className="font-medium">{stats.scorePercentage}%</span>
                </div>
                <Progress value={stats.scorePercentage} className="w-full h-4" />
              </div>
            </CardContent>
          </Card>
          
          {/* Subject Performance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.subjectStats.length > 0 ? (
                  <div className="space-y-6">
                    {stats.subjectStats.map((subject, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{subject.name}</span>
                          <span>{subject.percentage}%</span>
                        </div>
                        <Progress value={subject.percentage} className="w-full h-2" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Questions: {subject.total}</span>
                          <span>Correct: {subject.correct} | Incorrect: {subject.incorrect}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No subject data available</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance by Source</CardTitle>
              </CardHeader>
              <CardContent>
                {stats.sourceStats.length > 0 ? (
                  <div className="space-y-6">
                    {stats.sourceStats.map((source, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{source.name}</span>
                          <span>{source.percentage}%</span>
                        </div>
                        <Progress value={source.percentage} className="w-full h-2" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Questions: {source.total}</span>
                          <span>Correct: {source.correct} | Incorrect: {source.incorrect}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No source data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Link 
          href="/questions" 
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Practice Questions
        </Link>
        
        <Link 
          href="/questions?review=review_pinned" 
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-purple-600 text-white gap-2 hover:bg-purple-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Review Pinned Questions
        </Link>
        
        <Link 
          href="/questions?review=review_incorrect" 
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-red-600 text-white gap-2 hover:bg-red-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Review Incorrect Questions
        </Link>
      </div>
      
      <footer className="mt-16 flex gap-6 flex-wrap items-center justify-center">
        <Link 
          href="/mock-exam" 
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-amber-500 text-white gap-2 hover:bg-amber-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Mock Exam
        </Link>
        
        <Link 
          href="/notes" 
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-teal-500 text-white gap-2 hover:bg-teal-600 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          Hy Notes
        </Link>
      </footer>
    </div>
  );
}