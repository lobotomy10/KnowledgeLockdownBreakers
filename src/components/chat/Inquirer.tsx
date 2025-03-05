import React, { useState, useEffect } from 'react';
import '../css/Chat.css';
import '../css/Sidebar.css';
import Sidebar from '../../components/Sidebar';

/**
 * Inquirer component - Displays the chat interface for the inquirer role (相談者)
 * This component shows the existing chat stub for the inquirer
 * and includes sidebars as per the user's request
 */
const Inquirer: React.FC = () => {
  // Mock data for demonstration purposes
  const messages = [
    { id: 1, text: "こんにちは、何かお手伝いできることはありますか？", sender: "system" },
    { id: 2, text: "新しいプロジェクトについて相談したいです。", sender: "user" },
    { id: 3, text: "どのようなプロジェクトですか？詳細を教えていただけますか？", sender: "system" }
  ];

  // menuItem ////api////
  const getMyHistory = () => {
    // Implementation would go here
  }

  const menuItems = ['商談推進', '技術検証', '営業支援', 'その他'];
  const leftSidebar = true;
  const rightSidebar = false;

  // Chat component for the inquirer view
  const InquirerChat = () => {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>相談チャット</h2>
        </div>
        
        <div className="chat-messages">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'system-message'}`}
            >
              <div className="message-content">
                {message.text}
              </div>
              <div className="message-sender">
                {message.sender === 'user' ? '相談者' : 'システム'}
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input">
          <textarea 
            placeholder="メッセージを入力してください..." 
            rows={3}
            className="input-field"
          />
          <button className="send-button">送信</button>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Left Sidebar */}
      <Sidebar items={menuItems} sidebar={leftSidebar} />
      
      {/* chat */}
      <div className="content">
        <h1>Agent Communication (inquirer)</h1>
        <p>Please ask your question.</p>
        <InquirerChat />
      </div>
      
      {/* Right Sidebar */}
      <Sidebar items={menuItems} sidebar={rightSidebar} />
    </div>
  );
};

export default Inquirer;
