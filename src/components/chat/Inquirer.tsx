import React from 'react';
import '../css/Chat.css';

/**
 * Inquirer component - Displays the chat interface for the inquirer role (相談者)
 * This component shows the existing chat stub for the inquirer
 */
const Inquirer: React.FC = () => {
  // Mock data for demonstration purposes
  const messages = [
    { id: 1, text: "こんにちは、何かお手伝いできることはありますか？", sender: "system" },
    { id: 2, text: "新しいプロジェクトについて相談したいです。", sender: "user" },
    { id: 3, text: "どのようなプロジェクトですか？詳細を教えていただけますか？", sender: "system" }
  ];

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

export default Inquirer;
