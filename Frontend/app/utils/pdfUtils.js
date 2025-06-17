import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ReactDOMServer from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

export const generatePDF = async (title, difficulty, problemData, editorCode, solutionCode, resultsData) => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    pdf.setProperties({
      title: `${title} - DSA Practice Helper`,
      subject: `${difficulty} Problem`,
      creator: 'DSA Practice Helper',
      author: 'DSA Practice Helper'
    });

    const tempDiv = document.createElement('div');
    tempDiv.style.width = '210mm';
    tempDiv.style.padding = '10mm';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.color = 'black';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(tempDiv);

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

    if (problemData?.description) {
      const descriptionTitle = document.createElement('h2');
      descriptionTitle.textContent = 'Problem Description';
      descriptionTitle.style.fontSize = '18px';
      descriptionTitle.style.marginTop = '20px';
      descriptionTitle.style.marginBottom = '10px';
      tempDiv.appendChild(descriptionTitle);

      const descriptionEl = document.createElement('div');
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

    if (resultsData) {
      const resultsTitle = document.createElement('h2');
      resultsTitle.textContent = 'Results';
      resultsTitle.style.fontSize = '18px';
      resultsTitle.style.marginTop = '20px';
      resultsTitle.style.marginBottom = '10px';
      tempDiv.appendChild(resultsTitle);

      const resultsEl = document.createElement('div');
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

    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    document.body.removeChild(tempDiv);

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${title.replace(/\s+/g, '_')}_DSA_Problem.pdf`);
    console.log('PDF generated successfully');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};
