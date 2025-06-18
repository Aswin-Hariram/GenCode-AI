"use client";

import { useState, useEffect, useCallback } from 'react';

export const useProblemData = () => {
  const [problemData, setProblemData] = useState({
    title: "",
    difficulty: "",
    description: '',
    realtopic: "",
    testcases: [],
    solution: "",
    space_complexity: "",
    time_complexity: "",
    initial_code: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchProblemData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_GET_QUESTION_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      setProblemData({
        title: data.title,
        description: data.markdown,
        solution: data.solution,
        testcases: data.testcases,
        difficulty: data.difficulty,
        time_complexity: data.time_complexity,
        space_complexity: data.space_complexity,
        initial_code: data.initial_code,
        realtopic: data.realtopic
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);



  return { problemData, isLoading, error, setProblemData, generateNewProblem: fetchProblemData };
};
