import React from 'react';
import NewChatComponent from './components/chat/NewChatComponent';

/**
 * TestNewChat - A component to test the NewChatComponent with shadcn sidebar
 * Uses the shadcn sidebar-07 design
 */
const TestNewChat: React.FC = () => {
  return (
    <div className="test-chat h-screen">
      <NewChatComponent />
    </div>
  );
};

export default TestNewChat;
