"use client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";
import { Copy, Check, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import SkeletonLoader from './SkeletonLoader';

const SolutionTab = ({ problemData, theme = 'light' }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [copied, setCopied] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('cpp');
  const [convertedCode, setConvertedCode] = useState(
    problemData?.solution || '// Solution code will be displayed here'
  );
  const markdownComponents = getMarkdownComponents(theme);

  const handleLanguageChange = async (newLanguage) => {
    if (!problemData?.solution) {
      const errorMsg = 'No solution code available for conversion';
      console.error(errorMsg);
      setError(errorMsg);
      return;
    }

    if (newLanguage === selectedLanguage) {
      console.log('Language is already set to', newLanguage);
      return;
    }

    console.log('Initiating language conversion from', selectedLanguage, 'to', newLanguage);
    setIsConverting(true);
    setError(null);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/changeLanguage`;
      console.log('API URL:', apiUrl);
      
      const requestBody = {
        fromLang: selectedLanguage,
        toLang: newLanguage,
        code: problemData.solution,
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const responseText = await response.text();
      console.log('Raw API response:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Invalid response format: ${responseText.substring(0, 200)}`);
      }
      
      console.log('Parsed response data:', data);
      
      if (data && data.result === 'Success' && data.code) {
        console.log('Language conversion successful');
        setConvertedCode(data.code);
        setSelectedLanguage(newLanguage);
      } else {
        const errorMessage = data?.message || 'No error message provided by server';
        console.error('Conversion failed with message:', errorMessage);
        throw new Error(`Conversion failed: ${errorMessage}`);
      }
    } catch (err) {
      const errorMsg = `Failed to convert code: ${err.message}`;
      console.error('Language conversion error:', err);
      setError(errorMsg);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(convertedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const languageOptions = [
    { value: 'cpp', label: 'C++' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' },
  ];

  return (
    <div className="space-y-6 font-urbanist">
      <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-700/50' : 'bg-slate-100/50'
      }`}>
        <h3 className={`text-2xl font-bold mb-5 ${ 
          theme === 'dark' ? 'text-blue-300' : 'text-blue-600' 
        }`}>Solution Approach</h3>
        <div className={`space-y-5 ${ 
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700' 
        }`}>
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="language-select" className="font-medium">Language:</label>
                <div className="relative">
                  <select
                    id="language-select"
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    disabled={isConverting}
                    className={`appearance-none rounded-lg px-4 py-2 pr-8 border-2 transition-all duration-200 ${ 
                      isConverting ? 'opacity-60 cursor-not-allowed' : ''
                    } ${ 
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-200 border-gray-600 focus:border-blue-500 focus:ring-blue-500' : 'bg-slate-100 text-gray-700 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className={`absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none ${isConverting ? 'opacity-60' : ''}`}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.043-.481 1.576 0L10 10.405l2.908-2.857c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615l-3.712 3.667a1.103 1.103 0 01-1.574 0L5.516 9.163c-.408-.418-.436-1.17 0-1.615z"/></svg>
                  </div>
                </div>
              </div>
              {isConverting && (
                <div className="flex items-center gap-2 text-sm text-blue-400">
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Converting...</span>
                </div>
              )}
            </div>
            {error && (
              <div className={`text-sm p-3 rounded-lg flex items-center gap-2 ${ 
                theme === 'dark' ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-600' 
              }`}>
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                <span>{error}</span>
              </div>
            )}
          </div>
          <p className="text-base">Here&apos;s an efficient solution to the problem:</p>
          <div className={`rounded-xl relative group transition-all duration-300 ${ 
            theme === 'dark' 
              ? 'bg-gray-900/70 border border-gray-700/80'
              : 'bg-slate-100/70 border border-gray-300/80'
          }`}>
            <button
              onClick={handleCopyCode}
              disabled={isConverting}
              className={`absolute top-3 right-3 p-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-1.5 ${ 
                isConverting ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
              } ${ 
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-slate-200 hover:bg-slate-300 text-gray-700'
              }`}
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </button>
            <div className="p-4 min-h-[200px]">
              {isConverting ? (
                <SkeletonLoader theme={theme} />
              ) : (
                <SyntaxHighlighter
                  language={selectedLanguage}
                  style={theme === 'dark' ? vscDarkPlus : vs}
                  customStyle={{
                    background: theme === 'dark' ? '#181C24' : '#f3f6fa',
                    fontSize: '1rem',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    fontFamily: 'Urbanist, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    color: theme === 'dark' ? '#e5e7eb' : '#1e293b',
                    boxShadow: theme === 'dark' ? '0 2px 12px 0 #0002' : '0 2px 12px 0 #0001',
                    userSelect: 'text',
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: 'Urbanist, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontWeight: 600,
                      letterSpacing: '0.015em',
                    }
                  }}
                  className="!bg-transparent font-urbanist"
                >
                  {convertedCode}
                </SyntaxHighlighter>
              )}
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className={`mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={markdownComponents}
              >
                {problemData.time_complexity}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionTab;