import React from 'react';
import '../css/Chat.css';

/**
 * NewResponder component - Displays the chat interface for the responder role (相談回答者)
 * This component shows the specific message: "利根さん、質問者から○○という相談が来ています。"
 */
const NewResponder: React.FC = () => {
  // Mock consultation data
  const consultation = "新しいプロジェクトの進め方について";

  return (
    <div className="chat-container bg-white rounded-lg shadow-sm p-4">
      <div className="chat-header border-b pb-2 mb-4">
        <h2 className="text-lg font-semibold">相談回答</h2>
      </div>
      
      <div className="chat-messages space-y-4">
        <div className="message system-message bg-gray-100 rounded-lg p-3">
          <div className="message-content">
            利根さん、質問者から{consultation}という相談が来ています。
          </div>
          <div className="message-sender text-sm text-gray-500 mt-1">
            システム
          </div>
        </div>
      </div>
      
      <div className="chat-input mt-4 pt-4 border-t">
        <textarea 
          placeholder="回答を入力してください..." 
          rows={3}
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end mt-2">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            送信
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewResponder;
