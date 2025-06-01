"use client";
import PropTypes from 'prop-types';
import { FiShare, FiClock, FiRefreshCw } from 'react-icons/fi';
import { useSidebar } from '../../context/SidebarContext';
import { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const ProblemHeader = ({ problemData, theme, editorCode, solutionCode, resultsData }) => {
  const { toggleSidebar } = useSidebar();
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const handleRegenerate = async () => {
    if (isRegenerating) return;
    
    try {
      setIsRegenerating(true);
      // Dispatch event to regenerate the same question
      const event = new CustomEvent('regenerateQuestion', { 
        detail: { topic: problemData?.realtopic } 
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error regenerating question:', error);
    } finally {
      setIsRegenerating(false);
    }
  };
  const getDifficultyClasses = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return theme === 'dark'
          ? "bg-green-900/30 text-green-400 border border-green-700"
          : "bg-green-100 text-green-700 border border-green-300";
      case "Medium":
        return theme === 'dark'
          ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700"
          : "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Hard":
        return theme === 'dark' 
          ? "bg-red-900/30 text-red-400 border border-red-700"
          : "bg-red-100 text-red-700 border border-red-300";
      default:
        return theme === 'dark'
          ? "bg-gray-800 text-gray-300 border border-gray-700"
          : "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  // Fallback for missing data
  const title = problemData?.title || 'Untitled Problem';
  const difficulty = problemData?.difficulty || 'Unknown';
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Function to generate PDF
  const generatePDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    
    try {
      // Create a new PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set up PDF document properties
      pdf.setProperties({
        title: `${title} - DSA Practice Helper`,
        subject: `${difficulty} Problem`,
        creator: 'DSA Practice Helper',
        author: 'DSA Practice Helper'
      });
      
      // Create a temporary div to hold the content
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '210mm';
      tempDiv.style.padding = '10mm';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.color = 'black';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(tempDiv);
      
      // Add problem title and difficulty
      const titleEl = document.createElement('h1');
      titleEl.textContent = title;
      titleEl.style.fontSize = '24px';
      titleEl.style.marginBottom = '5px';
      tempDiv.appendChild(titleEl);
      
      const difficultyEl = document.createElement('div');
      difficultyEl.textContent = `Difficulty: ${difficulty}`;
      difficultyEl.style.fontSize = '14px';
      difficultyEl.style.marginBottom = '20px';
      difficultyEl.style.color = difficulty === 'Easy' ? 'green' : 
                               difficulty === 'Medium' ? 'orange' : 
                               difficulty === 'Hard' ? 'red' : 'gray';
      tempDiv.appendChild(difficultyEl);
      
      // Add problem description
      if (problemData?.description) {
        const descriptionTitle = document.createElement('h2');
        descriptionTitle.textContent = 'Problem Description';
        descriptionTitle.style.fontSize = '18px';
        descriptionTitle.style.marginTop = '20px';
        descriptionTitle.style.marginBottom = '10px';
        tempDiv.appendChild(descriptionTitle);
        
        // Create a properly formatted markdown container
        const descriptionEl = document.createElement('div');
        
        // Use ReactMarkdown to render the markdown content
        const markdownHtml = ReactDOMServer.renderToString(
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {problemData.description}
          </ReactMarkdown>
        );
        
        descriptionEl.innerHTML = markdownHtml;
        descriptionEl.style.fontSize = '14px';
        descriptionEl.style.lineHeight = '1.5';
        descriptionEl.style.marginBottom = '20px';
        
        // Add proper styling for markdown elements
        const style = document.createElement('style');
        style.textContent = `
          h1, h2, h3, h4, h5, h6 { margin-top: 16px; margin-bottom: 8px; font-weight: bold; }
          h1 { font-size: 20px; }
          h2 { font-size: 18px; }
          h3 { font-size: 16px; }
          p { margin-bottom: 10px; }
          ul, ol { margin-left: 20px; margin-bottom: 10px; }
          li { margin-bottom: 4px; }
          pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px; overflow-x: auto; }
          code { font-family: monospace; background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          blockquote { border-left: 4px solid #ddd; padding-left: 10px; margin-left: 0; margin-right: 0; }
        `;
        tempDiv.appendChild(style);
        tempDiv.appendChild(descriptionEl);
      }
      
      // Add examples if available
      if (problemData?.examples && problemData.examples.length > 0) {
        const examplesTitle = document.createElement('h2');
        examplesTitle.textContent = 'Examples';
        examplesTitle.style.fontSize = '18px';
        examplesTitle.style.marginTop = '20px';
        examplesTitle.style.marginBottom = '10px';
        tempDiv.appendChild(examplesTitle);
        
        problemData.examples.forEach((example, index) => {
          const exampleEl = document.createElement('div');
          exampleEl.style.marginBottom = '15px';
          exampleEl.style.padding = '10px';
          exampleEl.style.border = '1px solid #ddd';
          exampleEl.style.borderRadius = '5px';
          
          const exampleTitle = document.createElement('div');
          exampleTitle.textContent = `Example ${index + 1}`;
          exampleTitle.style.fontWeight = 'bold';
          exampleTitle.style.marginBottom = '5px';
          exampleEl.appendChild(exampleTitle);
          
          const inputEl = document.createElement('div');
          inputEl.innerHTML = `<strong>Input:</strong> ${example.input}`;
          inputEl.style.marginBottom = '5px';
          exampleEl.appendChild(inputEl);
          
          const outputEl = document.createElement('div');
          outputEl.innerHTML = `<strong>Output:</strong> ${example.output}`;
          outputEl.style.marginBottom = '5px';
          exampleEl.appendChild(outputEl);
          
          if (example.explanation) {
            const explanationEl = document.createElement('div');
            explanationEl.innerHTML = `<strong>Explanation:</strong> ${example.explanation}`;
            exampleEl.appendChild(explanationEl);
          }
          
          tempDiv.appendChild(exampleEl);
        });
      }
      
      // Add user's solution if available
      if (editorCode) {
        const userSolutionTitle = document.createElement('h2');
        userSolutionTitle.textContent = 'Your Solution';
        userSolutionTitle.style.fontSize = '18px';
        userSolutionTitle.style.marginTop = '20px';
        userSolutionTitle.style.marginBottom = '10px';
        tempDiv.appendChild(userSolutionTitle);
        
        const userSolutionEl = document.createElement('pre');
        userSolutionEl.textContent = editorCode;
        userSolutionEl.style.fontSize = '12px';
        userSolutionEl.style.padding = '10px';
        userSolutionEl.style.backgroundColor = '#f5f5f5';
        userSolutionEl.style.borderRadius = '5px';
        userSolutionEl.style.overflow = 'auto';
        userSolutionEl.style.marginBottom = '20px';
        tempDiv.appendChild(userSolutionEl);
      }
      
      // Add correct solution if available
      if (solutionCode) {
        const correctSolutionTitle = document.createElement('h2');
        correctSolutionTitle.textContent = 'Correct Solution';
        correctSolutionTitle.style.fontSize = '18px';
        correctSolutionTitle.style.marginTop = '20px';
        correctSolutionTitle.style.marginBottom = '10px';
        tempDiv.appendChild(correctSolutionTitle);
        
        const correctSolutionEl = document.createElement('pre');
        correctSolutionEl.textContent = solutionCode;
        correctSolutionEl.style.fontSize = '12px';
        correctSolutionEl.style.padding = '10px';
        correctSolutionEl.style.backgroundColor = '#f5f5f5';
        correctSolutionEl.style.borderRadius = '5px';
        correctSolutionEl.style.overflow = 'auto';
        correctSolutionEl.style.marginBottom = '20px';
        tempDiv.appendChild(correctSolutionEl);
      }
      
      // Add results if available
      if (resultsData) {
        const resultsTitle = document.createElement('h2');
        resultsTitle.textContent = 'Results';
        resultsTitle.style.fontSize = '18px';
        resultsTitle.style.marginTop = '20px';
        resultsTitle.style.marginBottom = '10px';
        tempDiv.appendChild(resultsTitle);
        
        // Create a properly formatted markdown container for results
        const resultsEl = document.createElement('div');
        
        // Use ReactMarkdown to render the markdown content
        const markdownHtml = ReactDOMServer.renderToString(
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {resultsData}
          </ReactMarkdown>
        );
        
        resultsEl.innerHTML = markdownHtml;
        resultsEl.style.fontSize = '14px';
        resultsEl.style.lineHeight = '1.5';
        tempDiv.appendChild(resultsEl);
      }
      
      // Convert the div to canvas and add to PDF
      const canvas = await html2canvas(tempDiv, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
      });
      
      // Remove the temporary div
      document.body.removeChild(tempDiv);
      
      // Add the canvas to the PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save(`${title.replace(/\s+/g, '_')}_DSA_Problem.pdf`);
      
      console.log('PDF generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 px-6 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 shadow-sm border-b border-gray-700' 
        : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-sm border-b border-gray-200'
    } transition-colors duration-300`}>
      <div className="flex items-center space-x-4">
        <h1 className={`font-bold text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'} tracking-tight`}>
          {title}
        </h1>
        <span 
          className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyClasses(difficulty)}`}
          title={`${difficulty} difficulty problem`}
        >
          {difficulty}
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className={`group relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out overflow-hidden ${
            theme === 'dark'
              ? 'bg-gray-700/80 hover:bg-gray-600/90 text-gray-100 hover:text-white shadow-lg hover:shadow-gray-900/30'
              : 'bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 shadow-md hover:shadow-lg hover:shadow-gray-200/50 border border-gray-200 hover:border-gray-300'
          }`}
          title="View recent topics"
        >
          <span className="relative z-10 flex items-center">
            <FiClock className={`mr-2 w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-500'
            }`} />
            <span>Recent</span>
          </span>
            {/* Animated background effect on hover */}
          <span className={`absolute inset-0 w-0 transition-all duration-300 ease-out group-hover:w-full ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-600/20 to-blue-400/20' 
              : 'bg-gradient-to-r from-blue-50 to-blue-100/50'
          }`}></span>
        </button>
        
        {/* Regenerate Button */}
      
        <button 
          onClick={generatePDF}
          className={`${
            theme === 'dark' 
              ? 'text-blue-400 hover:bg-blue-900/30 hover:text-blue-300' 
              : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
          } p-2 rounded-full transition-all duration-300 ease-in-out`}
          title="Generate PDF"
        >
          <FiShare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

ProblemHeader.propTypes = {
  problemData: PropTypes.shape({
    title: PropTypes.string,
    difficulty: PropTypes.oneOf(['Easy', 'Medium', 'Hard', '']),
    description: PropTypes.string,
    examples: PropTypes.array,
    solution: PropTypes.string
  }),
  theme: PropTypes.oneOf(['light', 'dark']),
  editorCode: PropTypes.string,
  solutionCode: PropTypes.string,
  resultsData: PropTypes.string
};

ProblemHeader.defaultProps = {
  problemData: { title: 'Untitled Problem', difficulty: 'Unknown' },
  theme: 'light',
  editorCode: '',
  solutionCode: '',
  resultsData: ''
};

export default ProblemHeader;