import * as React from 'react';
import { useState, useEffect } from 'react';
import '../css/Chat.css';
import '../css/Sidebar.css';
import Sidebar from '../../components/Sidebar';

/**
 * Responder component - Displays the chat interface for the responder role (相談回答者)
 * This component shows the specific message: "利根さん、質問者から○○という相談が来ています。"
 * and includes sidebars as per the user's request
 */
const Responder: React.FC = () => {
  // Mock consultation data
  const consultation = "新しいプロジェクトの進め方について";

  // menuItem ////api////
  const getMyHistory = () => {
    // Implementation would go here
  };

  const menuItems = ['商談推進', '技術検証', '営業支援', 'その他'];
  const leftSidebar = true;
  const rightSidebar = false;

  // Chat component for the responder view
  const ResponderChat: React.FC = () => {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>相談回答</h2>
        </div>
        
        <div className="chat-messages">
          <div className="message system-message">
            <div className="message-content">
              利根さん、質問者から{consultation}という相談が来ています。
            </div>
            <div className="message-sender">
              システム
            </div>
          </div>
        </div>
        
        <div className="chat-input">
          <textarea 
            placeholder="回答を入力してください..." 
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
        <h1>Agent Communication (responder)</h1>
        <p>Please answer the question.</p>
        <ResponderChat />
      </div>
      
      {/* Right Sidebar */}
      <Sidebar items={menuItems} sidebar={rightSidebar} />
    </div>
  );
};

export default Responder;
