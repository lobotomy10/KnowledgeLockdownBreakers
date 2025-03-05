import React, { useState, useEffect } from 'react';
import '../css/Chat.css';
import Responder from './Responder';
import Inquirer from './Inquirer';

/**
 * ChatComponent - Main component that handles tab switching between Inquirer and Responder modes
 * Implements tab switching functionality as per the user's request
 */
const ChatComponent: React.FC = () => {
  // Header title
  const title = 'Fujitsu';
  
  // State to track which tab is active (true = inquirer, false = responder)
  const [isInquirerActive, setIsInquirerActive] = useState(true);

  useEffect(() => {
    // Get references to the tab elements
    const inquirerTab = document.getElementById('inquirer');
    const responderTab = document.getElementById('responder');

    // Function to handle tab switching
    const handleTabChange = (isInquirer: boolean) => {
      setIsInquirerActive(isInquirer);
      
      // Update tab styling
      if (isInquirer) {
        responderTab?.classList.remove('select');
        inquirerTab?.classList.add('select');
      } else {
        inquirerTab?.classList.remove('select');
        responderTab?.classList.add('select');
      }
    };

    // Add event listeners to tabs
    const inquirerClickHandler = () => handleTabChange(true);
    const responderClickHandler = () => handleTabChange(false);
    
    inquirerTab?.addEventListener('click', inquirerClickHandler);
    responderTab?.addEventListener('click', responderClickHandler);

    // Cleanup function to remove event listeners
    return () => {
      inquirerTab?.removeEventListener('click', inquirerClickHandler);
      responderTab?.removeEventListener('click', responderClickHandler);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="chat-component">
      <div className="header">
        <div className="title">{title}</div>
        <div id="inquirer" className="tab select">相談者</div>
        <div id="responder" className="tab">相談回答者</div>
      </div>
      
      {/* Render either Inquirer or Responder based on active tab */}
      {isInquirerActive ? <Inquirer /> : <Responder />}
    </div>
  );
};

export default ChatComponent;
