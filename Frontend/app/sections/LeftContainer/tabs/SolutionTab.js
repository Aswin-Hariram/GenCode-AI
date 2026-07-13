"use client";
import { useEffect, useState } from "react";
import { getMarkdownComponents } from "../../../components/problem/markdown/MarkdownComponents";
import SolutionLanguageSelector from "../../../components/problem/Solution/SolutionLanguageSelector";
import SolutionCodeBlock from "../../../components/problem/Solution/SolutionCodeBlock";
import SolutionMeta from "../../../components/problem/Solution/SolutionMeta";
import ErrorAlert from "../../../elements/Problem/Solution/ErrorAlert";
import { getChangeLanguageUrl, requestJson } from "../../../utils/api";

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

  useEffect(() => {
    setSelectedLanguage('cpp');
    setConvertedCode(problemData?.solution || '// Solution code will be displayed here');
    setError(null);
    setCopied(false);
  }, [problemData?.solution, problemData?.title]);

  const languageOptions = [
    { value: 'cpp', label: 'C++' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' },
  ];

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

    setIsConverting(true);
    setError(null);

    try {
      const data = await requestJson(getChangeLanguageUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromLang: selectedLanguage,
          toLang: newLanguage,
          code: convertedCode,
        }),
        timeoutMs: 30000,
      });

      if (data && String(data.result || '').toLowerCase() === 'success' && data.code) {
        setConvertedCode(data.code);
        setSelectedLanguage(newLanguage);
      } else {
        const errorMessage = data?.message || 'No error message provided by server';
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMsg = `Failed to convert code: ${err.message}`;
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

  return (
    <div className="space-y-6 font-lexend">
      <div className={`rounded-xl p-6 shadow-md transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900/80 border border-gray-700/80' : 'bg-slate-100/80 border border-gray-300/80'}`}
      >
        <div className="flex flex-col gap-4">
          <SolutionLanguageSelector
            languageOptions={languageOptions}
            selectedLanguage={selectedLanguage}
            onChange={handleLanguageChange}
            isConverting={isConverting}
            theme={theme}
          />
          {error && <ErrorAlert error={error} theme={theme} />}
          <p className="text-base">Here&apos;s an efficient solution to the problem:</p>
          <SolutionCodeBlock
            code={convertedCode}
            language={selectedLanguage}
            theme={theme}
            onCopy={handleCopyCode}
            copied={copied}
            isConverting={isConverting}
          />
          <div className="mt-6 space-y-4">
            <SolutionMeta
              markdown={problemData.time_complexity}
              markdownComponents={markdownComponents}
              theme={theme}
            />
            <SolutionMeta
              markdown={problemData.space_complexity}
              markdownComponents={markdownComponents}
              theme={theme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionTab;
