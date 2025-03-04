// ChatComponent.tsx
import './css/ChatComponent.css';
import './css/Sidebar.css';

// Import React
import * as React from 'react';

// Define Message interface with additional types for different message formats
interface Message {
  text: string;
  sender: 'self' | 'bot';
  type?: 'normal' | 'thinking' | 'choice'; // Message type for styling
  choices?: string[]; // For choice messages
}

// Define conversation states
type ConversationState = 
  | 'initial' 
  | 'thinking' 
  | 'agent_selection' 
  | 'information_request' 
  | 'dashboard_response' 
  | 'person_consultation';

// Define agent types
type AgentType = 'sales_support' | 'deal_promotion' | 'technical_consultation';

// SpeechRecognition interfaces are defined in react-app-env.d.ts

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isListening, setIsListening] = React.useState(false);
    const [conversationState, setConversationState] = React.useState<ConversationState>('initial');
    const [selectedAgent, setSelectedAgent] = React.useState<AgentType | null>(null);
    const [awaitingChoice, setAwaitingChoice] = React.useState<boolean>(false);
    
    // Create refs to store the SpeechRecognition instance and last result
    const recognitionRef = React.useRef<any>(null);
    const lastResultRef = React.useRef<string>('');
    
    // Initialize speech recognition
    React.useEffect(() => {
      // Check if browser supports SpeechRecognition
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        console.error('Speech recognition not supported in this browser');
        return;
      }
      
      // Clean up function
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }, []);
    
    // Send message and process conversation flow
    const sendMessage = () => {
        if (input.trim() === '') return;
        
        // Add user message to chat
        const userMessage = { text: input, sender: 'self' as const };
        setMessages(prev => [...prev, userMessage]);
        
        // Clear input field
        setInput('');
        
        // Process based on conversation state
        switch (conversationState) {
          case 'initial':
            // First user message triggers AI thinking process
            setTimeout(() => {
              // Add thinking process message
              setMessages(prev => [...prev, { 
                text: '思考中... 営業支援エージェントか、商談推進エージェントか、技術相談エージェントか考えています。', 
                sender: 'bot',
                type: 'thinking'
              }]);
              
              setConversationState('thinking');
              
              // After thinking, suggest an agent
              setTimeout(() => {
                setMessages(prev => [...prev, { 
                  text: '営業支援エージェントでよろしいですね？', 
                  sender: 'bot',
                  type: 'choice',
                  choices: ['はい', 'いいえ']
                }]);
                
                setSelectedAgent('sales_support');
                setConversationState('agent_selection');
                setAwaitingChoice(true);
              }, 2000);
            }, 1000);
            break;
            
          case 'information_request':
            // User has provided information request
            setTimeout(() => {
              // Add thinking process for KGI dashboard query
              setMessages(prev => [...prev, { 
                text: 'KGIダッシュボードに問い合わせています...', 
                sender: 'bot',
                type: 'thinking'
              }]);
              
              // After "querying", provide response
              setTimeout(() => {
                setMessages(prev => [...prev, { 
                  text: `KGIダッシュボードに問い合わせた結果、商談の返答としては以下の情報があります：\n\n${generateDashboardResponse(input)}`, 
                  sender: 'bot'
                }]);
                
                // Ask if user wants to consult with Tone-san
                setTimeout(() => {
                  setMessages(prev => [...prev, { 
                    text: '利根さんに聞いてよろしいですか？', 
                    sender: 'bot',
                    type: 'choice',
                    choices: ['はい', 'いいえ']
                  }]);
                  
                  setConversationState('dashboard_response');
                  setAwaitingChoice(true);
                }, 1000);
              }, 2000);
            }, 1000);
            break;
            
          default:
            // For any other state, just acknowledge
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: '承知しました。他に何かお手伝いできることはありますか？', 
                sender: 'bot' 
              }]);
            }, 500);
            break;
        }
    };

    // receive message ////api////
    const receiveMessage = () => {
      // Implementation will be added later
    };

    // View messages received  
    const viewMessage = () => {
          setMessages([...messages, { text: 'Hellow!!', sender: 'bot' }]);
          setInput('');   
    };
    
    // Voice input functions
    const startListening = () => {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        console.error('Speech recognition not supported');
        return;
      }
      
      // If we already have an instance, stop it first
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // Create a new instance and store it in the ref
      recognitionRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionRef.current;
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ja-JP';
      
      // Reset the last result ref when starting a new recognition session
      lastResultRef.current = '';
      
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        
        // Only update if this is a new result
        if (transcriptResult !== lastResultRef.current) {
          lastResultRef.current = transcriptResult;
          setInput((prev) => prev + ' ' + transcriptResult.trim());
        }
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    };
    
    const stopListening = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    };
    
    const toggleListening = () => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    };
    
    // Helper function to generate mock dashboard responses based on user input
    const generateDashboardResponse = (userQuery: string): string => {
      // Simple keyword matching for demo purposes
      if (userQuery.includes('売上') || userQuery.includes('収益')) {
        return '- 今四半期の売上: 1,250万円\n- 前年同期比: +15%\n- 主要顧客の売上貢献度: A社 35%, B社 22%, C社 18%';
      } else if (userQuery.includes('顧客') || userQuery.includes('クライアント')) {
        return '- 新規顧客獲得数: 12社\n- 顧客満足度: 4.2/5.0\n- 主要顧客との次回ミーティング: A社 3/15, B社 3/22';
      } else if (userQuery.includes('製品') || userQuery.includes('サービス')) {
        return '- 主力製品の販売状況: 好調\n- 新製品のローンチ予定: 4月中旬\n- 製品改善要望トップ3: UI改善, 連携機能強化, モバイル対応';
      } else {
        return '- 営業チームのKPI達成率: 87%\n- 今月の商談成約率: 35%\n- 重点フォロー案件: D社案件, E社提案, F社更新';
      }
    };
    
    // Function to handle newlines in messages for proper display
    const formatMessageText = (text: string): React.ReactNode => {
      return text.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    };
    
    // Handle user choice selection
    const handleChoiceSelection = (choice: string, questionText: string) => {
      // Add the user's choice as a message
      setMessages(prev => [...prev, { 
        text: choice, 
        sender: 'self' 
      }]);
      
      // Process the choice based on current conversation state
      if (choice === 'はい') {
        switch (conversationState) {
          case 'agent_selection':
            // User confirmed agent selection
            setTimeout(() => {
              setConversationState('information_request');
              setAwaitingChoice(false);
              // Add agent's information request message
              setMessages(prev => [...prev, { 
                text: 'どういった情報が欲しいですか？', 
                sender: 'bot' 
              }]);
            }, 500);
            break;
            
          case 'dashboard_response':
            // User confirmed to consult with Tone-san
            setTimeout(() => {
              setAwaitingChoice(false);
              // Add final response
              setMessages(prev => [...prev, { 
                text: '利根さんに問い合わせました。まもなく回答があります。', 
                sender: 'bot' 
              }]);
              // Reset conversation state for next interaction
              setConversationState('initial');
            }, 500);
            break;
            
          default:
            break;
        }
      } else if (choice === 'いいえ') {
        // Handle "No" responses
        switch (conversationState) {
          case 'agent_selection':
            // User rejected agent selection
            setTimeout(() => {
              setAwaitingChoice(false);
              // Add thinking message for reconsidering agent
              setMessages(prev => [...prev, { 
                text: '別のエージェントを検討しています...', 
                sender: 'bot',
                type: 'thinking'
              }]);
              
              // Simulate reconsideration and offer new agent
              setTimeout(() => {
                setMessages(prev => [...prev, { 
                  text: '商談推進エージェントでよろしいですか？', 
                  sender: 'bot',
                  type: 'choice',
                  choices: ['はい', 'いいえ']
                }]);
                setSelectedAgent('deal_promotion');
                setAwaitingChoice(true);
              }, 1500);
            }, 500);
            break;
            
          case 'dashboard_response':
            // User rejected consulting with Tone-san
            setTimeout(() => {
              setAwaitingChoice(false);
              setMessages(prev => [...prev, { 
                text: '承知しました。他に何かお手伝いできることはありますか？', 
                sender: 'bot' 
              }]);
              // Reset conversation state for next interaction
              setConversationState('initial');
            }, 500);
            break;
            
          default:
            break;
        }
      }
    };
    
    return (
        <div id="chat-container">
          <div id="messages">
            {messages.map((msg, index) => {
              if (msg.type === 'choice') {
                return (
                  <div key={index} className="message choice">
                    <div>{msg.text}</div>
                    <div className="choice-buttons">
                      {msg.choices?.map((choice, choiceIndex) => (
                        <button 
                          key={choiceIndex} 
                          className={`choice-button ${choice.toLowerCase() === 'はい' ? 'yes' : choice.toLowerCase() === 'いいえ' ? 'no' : ''}`}
                          onClick={() => handleChoiceSelection(choice, msg.text)}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className={`message ${msg.sender === 'self' ? 'right' : 'left'} ${msg.type || ''}`}>
                    {formatMessageText(msg.text)}
                  </div>
                );
              }
            })}
          </div>
          <div id="input-container">
            <div className="input-row">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => { 
                  if (e.key === 'Enter' && !awaitingChoice) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                disabled={awaitingChoice}
              />
              <div className="button-container">
                <button onClick={sendMessage} disabled={awaitingChoice}>Send</button>
                <button onClick={toggleListening} className="voice-button" aria-label={isListening ? 'Stop Voice' : 'Voice Message'}>
                  <span className="voice-icon">{isListening ? '⏹' : '🎤'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    );
};

export default ChatComponent;
