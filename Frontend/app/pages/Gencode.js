"use client";

import Split from 'react-split';
import { FiSun, FiMoon, FiFileText, FiCode, FiBarChart2 } from 'react-icons/fi';
import ProblemHeader from '../sections/Header/ProblemHeader';
import ProblemWorkspace from '../sections/LeftContainer/ProblemWorkspace';
import CodeEditor from '../sections/RightContainer/editor/CodeEditor';
import ConsoleModal from '../modals/ConsoleModal';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import useGencodeLogic from '../hooks/useGencodeLogic';

const GenCode = () => {
  const {
    theme,
    toggleTheme,
    code,
    setCode,
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    isConsoleOpen,
    setIsConsoleOpen,
    isFullscreen,
    setIsFullscreen,
    response,
    setResponse,
    status_data,
    setStatusData,
    error,
    setError,
    activeTestCase,
    setActiveTestCase,
    isRunning,
    setIsRunning,
    isSubmitting,
    setIsSubmitting,
    compilationResult,
    setCompilationResult,
    editorRef,
    consoleHeight,
    problemData,
    setProblemData,
    isLoading,
    setIsLoading,
    problemError,
    setProblemError,
    generateNewProblem,
    fetchQuestionForTopic,
    tabs,
    toggleConsole,
    toggleFullscreen,
    closeConsole,
    handleSubmitCode,
    handleEditorDidMount,
    handleEditorChange,
    showCorrectCode,
    runCode
  } = useGencodeLogic();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (problemError) {
    return <ErrorDisplay error={problemError} />;
  }

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      <ProblemHeader 
        problemData={problemData} 
        theme={theme} 
        editorCode={code} 
        solutionCode={problemData?.solution} 
        resultsData={response} 
        generateNewProblem={generateNewProblem}
        isLoading={isLoading}
        onSubmitCode={() => handleSubmitCode({
          description: problemData?.description,
          typedSolution: code,
          actualSolution: problemData?.solution,
          language: language
        })}
        setActiveTab={setActiveTab}
      />
      <Split
        className={`flex flex-1 overflow-hidden split-horizontal ${theme === 'dark' ? ' bg-gray-800' : 'prose-slate'}`}
        sizes={[45, 55]}
        minSize={250}
        expandToMin={false}
        gutterSize={4}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        gutterStyle={() => ({
          backgroundColor: theme === 'dark' ? '#374151' : '#e5e7eb',
          cursor: 'col-resize'
        })}
      >
        <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transition-colors duration-300`}>
          <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} transition-colors duration-300`}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium flex items-center transition-all duration-200 ${
                  activeTab === tab.id 
                    ? `${theme === 'dark' ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-500'} border-b-2` 
                    : `${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`
                }`}
              >
                <span className={`mr-2 flex items-center ${activeTab === tab.id ? '' : 'opacity-80'}`}
                  style={{ fontSize: 18, display: 'flex', alignItems: 'center' }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            ))}
            <div className="ml-auto flex items-center pr-4">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme === 'dark' ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            </div>
          </div>
          <ProblemWorkspace 
            problemData={problemData} 
            activeTab={activeTab} 
            response={response}
            status={status_data}
            theme={theme} 
            isLoading={isSubmitting}
          />
        </div>
        <div className="flex flex-col h-full">
          <CodeEditor
            language={language}
            code={problemData.initial_code}
            fontSize={14}
            isFullscreen={isFullscreen}
            onCodeChange={handleEditorChange}
            onEditorMount={handleEditorDidMount}
            onRunCode={runCode}
            onToggleFullscreen={toggleFullscreen}
            setLanguage={setLanguage}
            onSubmitCode={handleSubmitCode}
            problemData={problemData}
            theme={theme}
            isRunning={isRunning}
            isSubmitting={isSubmitting}
            setActiveTab={setActiveTab}
          />
        </div>
      </Split>
      <ConsoleModal
        isOpen={isConsoleOpen}
        onClose={closeConsole}
        compilationResult={compilationResult}
        showCorrectCode={showCorrectCode}
        activeTestCase={activeTestCase}
        theme={theme}
      />
    </div>
  );
}

export default GenCode;