import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import '../css/Chat.css';

// メッセージの型定義
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChatComponent: React.FC = () => {
  // メッセージ履歴の状態
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'こんにちは！どのようにお手伝いできますか？',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  
  // 入力メッセージの状態
  const [inputMessage, setInputMessage] = useState('');
  
  // AIの応答中かどうかの状態
  const [isAIResponding, setIsAIResponding] = useState(false);
  
  // エラーメッセージの状態
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // メッセージ履歴の参照
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // メッセージ送信時の処理
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    // ユーザーメッセージの追加
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsAIResponding(true);
    
    try {
      // 実際のAPIを使用する場合はここでAPIリクエストを行う
      // 現在はモックレスポンスを使用
      await simulateAIResponse(userMessage.content);
    } catch (error) {
      setErrorMessage('AIとの通信中にエラーが発生しました。もう一度お試しください。');
      setIsAIResponding(false);
    }
  };
  
  // AIの応答をシミュレート（実際のAPIを使用する場合は置き換え）
  const simulateAIResponse = async (userMessage: string) => {
    // 簡単な応答ロジック
    let aiResponse = '';
    
    if (userMessage.includes('こんにちは') || userMessage.includes('はじめまして')) {
      aiResponse = 'こんにちは！どのようにお手伝いできますか？';
    } else if (userMessage.includes('名前') || userMessage.includes('誰')) {
      aiResponse = '私はAIアシスタントです。何かお手伝いできることはありますか？';
    } else if (userMessage.includes('ありがとう') || userMessage.includes('感謝')) {
      aiResponse = 'どういたしまして！他に何かお手伝いできることはありますか？';
    } else if (userMessage.includes('さようなら') || userMessage.includes('バイバイ')) {
      aiResponse = 'さようなら！またお話しましょう。';
    } else {
      aiResponse = 'ご質問ありがとうございます。もう少し詳しく教えていただけますか？';
    }
    
    // ストリーミング応答をシミュレート
    let partialResponse = '';
    const aiMessageId = Date.now().toString();
    
    // 空のAIメッセージを追加
    setMessages(prevMessages => [
      ...prevMessages,
      {
        id: aiMessageId,
        content: '',
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    
    // 文字を一つずつ追加してストリーミングをシミュレート
    for (let i = 0; i < aiResponse.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      partialResponse += aiResponse[i];
      
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: partialResponse } 
            : msg
        )
      );
    }
    
    setIsAIResponding(false);
  };
  
  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Enterキーでメッセージを送信
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="chat-container h-full flex flex-col w-full border rounded-md shadow-sm">
      <CardContent className="flex-1 overflow-auto p-4 flex flex-col">
        {/* メッセージ履歴 */}
        <div className="chat-messages space-y-4 flex flex-col w-full">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'} p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}
              style={{ 
                maxWidth: '80%', 
                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                display: 'block',
                marginLeft: message.sender === 'user' ? 'auto' : '0',
                marginRight: message.sender === 'user' ? '0' : 'auto'
              }}
            >
              <div className="message-content">
                {message.content}
              </div>
              <div 
                className={`message-timestamp text-xs ${
                  message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                } mt-1`}
              >
                {message.timestamp.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* エラーメッセージ */}
        {errorMessage && (
          <div className="error-message text-red-500 text-sm mt-2 mb-2">
            {errorMessage}
          </div>
        )}
        
        {/* AIの応答中インジケーター */}
        {isAIResponding && (
          <div className="ai-typing text-gray-500 text-sm mt-2">
            AIが応答を作成中...
          </div>
        )}
      </CardContent>
      
      {/* メッセージ入力エリア */}
      <div className="chat-input p-4 border-t w-full">
        <div className="flex w-full">
          <textarea 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="メッセージを入力してください..."
            rows={2}
            className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isAIResponding}
            className="ml-2 self-end"
          >
            送信
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChatComponent;
