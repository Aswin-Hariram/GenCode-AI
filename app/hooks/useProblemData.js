"use client";

import { useState, useEffect } from 'react';

export const useProblemData = () => {
  const [problemData, setProblemData] = useState({
    title: "",
    difficulty: "",
    description: '',
    testcases: [
      { input: '"babad"', output: '"bab"' },
      { input: '"cbbd"', output: '"bb"' }
    ],
    solution: "",
    space_complexity: "",
    time_complexity: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/get_dsa_question', {
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
          space_complexity: data.space_complexity
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemData();
  }, []);

  return { problemData, isLoading, error, setProblemData };
};
