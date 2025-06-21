import React, { useState, useRef, useEffect, use } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import InputContainer from '../../../components/problem/studywithai/InputContainer';
import MessageContainer from '../../../components/problem/studywithai/messageContainer';
import Header from '../../../components/problem/studywithai/Header';
import AskHelp from '../../../components/problem/studywithai/AskHelp'


function StudyWithAi({ problemData }) {

  const getInitialMessages = () => {
    const stored = localStorage.getItem('studyWithAiMessages');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  };

  const { theme } = useTheme();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState(getInitialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [askedHelp, setAskedHelp] = useState(
    JSON.parse(localStorage.getItem('askedHelp') || 'false')
  );


  useEffect(() => {
    localStorage.setItem('studyWithAiMessages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


 
  const handleAskHelp = () => {
    setAskedHelp(true);
    localStorage.setItem('askedHelp', 'true');
    const welcomeMsg = [
      {
        sender: 'ai',
        text: `Sure! I can help you with solving "${problemData.title}" DSA Problem. Please ask your question about the problem.`,
      },
    ];
    setMessages(welcomeMsg);
  };

  const handleClearChat = () => {
    setMessages([]);
    setInput('');
    setIsTyping(false);
    setAskedHelp(false);
    localStorage.removeItem('studyWithAiMessages');
  }

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input, problemData: problemData };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Prepare payload as expected by backend
      const payload = {
        sender: 'user',
        message: input,
        language: 'cpp',
        'problem Description': problemData.description || {},
        'problem Topic': problemData.realtopic || '',
      };
      console.log('Sending payload to AI:', payload);
      const response = await fetch('http://127.0.0.1:8000/api/ask-help-to-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        console.error('Failed to fetch AI response');
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('AI response:', data);
      // Add AI response to messages
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: data?.output || 'AI did not return a response.' }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Failed to get AI response.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Welcome screen
  if (!askedHelp && problemData) {
    return (
      <AskHelp handleAskHelp={handleAskHelp} theme={theme} />
    );
  }

  // Main chat screen
  return (
    <div
      className={`w-full h-full flex flex-col ${theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 to-slate-900'
          : 'bg-gradient-to-br from-slate-50  to-gray-50'
        } rounded-2xl shadow-2xl border ${theme === 'dark'
          ? 'border-slate-700/50 shadow-black/20'
          : 'border-slate-300 shadow-slate-400/30'
        } backdrop-blur-sm overflow-hidden`}
    >
      <Header theme={theme} onClearChat={handleClearChat}/>
      <MessageContainer
        messages={messages}
        isTyping={isTyping}
        theme={theme}
        messagesEndRef={messagesEndRef}
      />
      <InputContainer
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        theme={theme}
      />
    </div>
  );
}

export default StudyWithAi;
