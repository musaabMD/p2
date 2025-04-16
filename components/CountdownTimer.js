"use client";

import { useState, useEffect } from 'react';

const CountdownTimer = () => {
  // Define the exam dates
  const osceDate = new Date('November 1, 2025');
  const writtenDate = new Date('October 6, 2025');
  
  const [timeLeft, setTimeLeft] = useState({
    osce: { totalDays: 0, weeks: 0, days: 0 },
    written: { totalDays: 0, weeks: 0, days: 0 }
  });

  useEffect(() => {
    // Function to calculate time left
    const calculateTimeLeft = () => {
      const now = new Date();
      
      // Calculate days left for OSCE
      const osceDiffTime = osceDate - now;
      const osceDays = Math.ceil(osceDiffTime / (1000 * 60 * 60 * 24));
      const osceWeeks = Math.floor(osceDays / 7);
      const osceRemainingDays = osceDays % 7;
      
      // Calculate days left for Written Exam
      const writtenDiffTime = writtenDate - now;
      const writtenDays = Math.ceil(writtenDiffTime / (1000 * 60 * 60 * 24));
      const writtenWeeks = Math.floor(writtenDays / 7);
      const writtenRemainingDays = writtenDays % 7;
      
      return {
        osce: { 
          totalDays: osceDays,
          weeks: osceWeeks, 
          days: osceRemainingDays 
        },
        written: { 
          totalDays: writtenDays,
          weeks: writtenWeeks, 
          days: writtenRemainingDays 
        }
      };
    };

    // Set initial time left
    setTimeLeft(calculateTimeLeft());
    
    // Update the countdown every hour
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 3600000); // Every hour
    
    // Also update at midnight to ensure day changes are reflected
    const updateAtMidnight = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0 // midnight
      );
      const msToMidnight = night.getTime() - now.getTime();
      
      // Set timeout for midnight update
      setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
        // Recursively set the next midnight update
        updateAtMidnight();
      }, msToMidnight);
    };
    
    // Start the midnight update cycle
    updateAtMidnight();
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-center text-green-700 mb-3">Exam Countdown</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 bg-gray-50">
          <h3 className="font-medium text-gray-800">OSCE Exam (Nov 1, 2025)</h3>
          <div className="mt-2 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{timeLeft.osce.totalDays}</span>
              <p className="text-xs text-gray-600">days left</p>
            </div>
            <span className="mx-2 text-gray-400">or</span>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{timeLeft.osce.weeks}</span>
              <p className="text-xs text-gray-600">weeks</p>
            </div>
            <span className="mx-1 text-gray-400">+</span>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{timeLeft.osce.days}</span>
              <p className="text-xs text-gray-600">days</p>
            </div>
          </div>
        </div>
        
        <div className="border rounded-md p-3 bg-gray-50">
          <h3 className="font-medium text-gray-800">Written Exam (Oct 6, 2025)</h3>
          <div className="mt-2 flex items-center justify-center">
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{timeLeft.written.totalDays}</span>
              <p className="text-xs text-gray-600">days left</p>
            </div>
            <span className="mx-2 text-gray-400">or</span>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{timeLeft.written.weeks}</span>
              <p className="text-xs text-gray-600">weeks</p>
            </div>
            <span className="mx-1 text-gray-400">+</span>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{timeLeft.written.days}</span>
              <p className="text-xs text-gray-600">days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer; 