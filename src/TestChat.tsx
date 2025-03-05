import React from 'react';
import ChatComponent from './components/chat/ChatComponent';

/**
 * TestChat - A simple component to test the ChatComponent
 */
const TestChat: React.FC = () => {
  return (
    <div className="test-chat">
      <ChatComponent />
    </div>
  );
};

export default TestChat;
