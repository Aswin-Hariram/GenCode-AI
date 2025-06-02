"use client";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { getMarkdownComponents } from "../markdown/MarkdownComponents";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const SolutionTab = ({ problemData, theme = 'light' }) => {
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
    <div className="space-y-6">
      <div className={`rounded-lg p-6 shadow-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <h3 className={`text-xl font-semibold mb-4 ${
          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
        }`}>Solution Approach</h3>
        <div className={`space-y-4 ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <span>Select Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                disabled={isConverting}
                className={`rounded-md px-3 py-1 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-gray-200 border-gray-600'
                    : 'bg-white text-gray-800 border-gray-300'
                } border ${isConverting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {isConverting && (
                <span className="text-sm text-blue-500 ml-2">Converting...</span>
              )}
            </div>
            {error && (
              <div className={`text-sm p-2 rounded ${
                theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
              }`}>
                {error}
              </div>
            )}
          </div>
          <p>Here&apos;s an efficient solution to the problem:</p>
          <div className={`rounded-lg p-4 relative ${
            theme === 'dark' 
              ? 'bg-gray-900 border border-gray-700' 
              : 'bg-white border border-gray-200'
          }`}>
            <button
              onClick={handleCopyCode}
              className={`absolute top-2 right-2 px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check size={16} /> Copied
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy
                </>
              )}
            </button>
            <SyntaxHighlighter
              language={selectedLanguage}
              style={theme === 'dark' ? oneDark : oneLight}
              className="rounded-md"
            >
              {convertedCode}
            </SyntaxHighlighter>
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