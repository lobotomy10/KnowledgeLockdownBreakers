import React from 'react';
import '../css/Chat.css';

/**
 * Responder component - Displays the chat interface for the responder role (相談回答者)
 * This component shows the specific message: "利根さん、質問者から○○という相談が来ています。"
 */
const Responder: React.FC = () => {
  // Mock consultation data
  const consultation = "新しいプロジェクトの進め方について";

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

export default Responder;
