import { useEffect } from 'react';
import DescriptionTab from '../../sections/LeftContainer/tabs/DescriptionTab';
import ResultsTab from '../../sections/LeftContainer/tabs/ResultsTab';
import SolutionTab from '../../sections/LeftContainer/tabs/SolutionTab';



const ProblemTabs = ({ problemData, activeTab, response, status, theme, isLoading }) => {
  switch (activeTab) {
    case 'description':
      return <DescriptionTab problemData={problemData} theme={theme} />;
    case 'results':
      return <ResultsTab response={response} status={status} theme={theme} isLoading={isLoading} />;
    case 'solution':
      return <SolutionTab problemData={problemData} theme={theme} />;
    default:
      return null;
  }
};

export default ProblemTabs;
