import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = ({ theme = 'light' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg transition-colors duration-200 border-2 focus:outline-none focus:ring-2 focus:ring-blue-400
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-blue-300 hover:bg-gray-700' : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50'}`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={22} />
    </button>
  ) : null;
};

export default ScrollToTopButton;
