import { useEffect } from 'react';
import DescriptionTab from '../../sections/LeftContainer/tabs/DescriptionTab';
import ResultsTab from '../../sections/LeftContainer/tabs/ResultsTab';
import SolutionTab from '../../sections/LeftContainer/tabs/SolutionTab';
import StudyWithAi from '@/sections/LeftContainer/tabs/StudyWithAi';



const ProblemTabs = ({ problemData, activeTab, response, status, theme, isLoading }) => {
  switch (activeTab) {
    case 'description':
      return <DescriptionTab problemData={problemData} theme={theme} />;
    case 'results':
      return <ResultsTab response={response} status={status} theme={theme} isLoading={isLoading} />;
    case 'solution':
      return <SolutionTab problemData={problemData} theme={theme} />;
    case 'studywithai':
      return <StudyWithAi />
    default:
      return null;
  }
};

export default ProblemTabs;
