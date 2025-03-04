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
  | 'business_understanding' 
  | 'business_issue_inquiry' 
  | 'data_inquiry' 
  | 'budget_inquiry' 
  | 'requirements_inquiry' 
  | 'schedule_inquiry' 
  | 'summary_presentation';

// Define requirement data structure
interface RequirementsSummary {
  company_name?: string;
  company_industry?: string;
  company_main_business_content?: string;
  company_annual_sales?: string;
  business_issue?: string;
  business_issue_plan?: string;
  business_issue_status?: string;
  business_issue_value?: string;
  service?: string;
  tech_usage_image?: string;
  available_data?: string;
  budget?: string;
  introduction_schedule?: string;
  requirements?: string;
}

// SpeechRecognition interfaces are defined in react-app-env.d.ts

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isListening, setIsListening] = React.useState(false);
    const [conversationState, setConversationState] = React.useState<ConversationState>('initial');
    const [awaitingChoice, setAwaitingChoice] = React.useState<boolean>(false);
    const [requirementsSummary, setRequirementsSummary] = React.useState<RequirementsSummary>({
      company_name: '株式会社アンビション DX ホールディングス',
      company_industry: '不動産',
      company_main_business_content: '賃貸DXプロパティマネジメント事業、賃貸DX賃貸仲介事業、売買DXインベスト事業、インキュベーション事業',
      company_annual_sales: '30,486百万円（2024年06月期）',
      service: 'for Vision'
    });
    
    // Create refs to store the SpeechRecognition instance and last result
    const recognitionRef = React.useRef<any>(null);
    const lastResultRef = React.useRef<string>('');
    
    // Initialize speech recognition and welcome message
    React.useEffect(() => {
      // Check if browser supports SpeechRecognition
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        console.error('Speech recognition not supported in this browser');
      }
      
      // Add welcome message
      setMessages([
        { 
          text: 'こんにちは！商談支援AIアシスタントです。ご用件をお聞かせください。', 
          sender: 'bot' 
        }
      ]);
      
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
        const userMessage = { text: input === 'インプット' ? 'インプット' : input, sender: 'self' as const };
        setMessages(prev => [...prev, userMessage]);
        
        // Clear input field
        setInput('');
        
        // Process based on conversation state
        switch (conversationState) {
          case 'initial':
            // First user message triggers business understanding
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: 'エンドユーザからの問い合わせは、商談支援に関する内容と理解しました。この理解でよろしいでしょうか？', 
                sender: 'bot',
                type: 'choice',
                choices: ['はい', 'いいえ']
              }]);
              
              setConversationState('business_understanding');
              setAwaitingChoice(true);
            }, 500);
            break;
            
          case 'business_issue_inquiry':
            // User has provided business issue information
            setTimeout(() => {
              // Update requirements summary with business issue
              setRequirementsSummary(prev => ({
                ...prev,
                business_issue: '消費者の行動から購買の可能性のある消費者を検知し、的確に宣伝すること。',
                business_issue_plan: '消費者行動の検知技術を活用した購買可能性の高い消費者の検知と宣伝の最適化を検討中。',
                business_issue_status: '検討中',
                business_issue_value: '購買可能性の高い消費者を的確に特定し、宣伝効果を最大化することで売上の向上を図ること。',
                tech_usage_image: '消費者の行動をリアルタイムで分析し、購買可能性の高い消費者を特定してターゲティングする。'
              }));
              
              // Ask about available data
              setMessages(prev => [...prev, { 
                text: '消費者の行動から購買の可能性のある消費者を検知して的確に宣伝するための技術活用を検討されていますね。この目標を達成するためには、どのようなデータが利用可能かをお伺いしたいと思います。', 
                sender: 'bot'
              }]);
              
              setConversationState('data_inquiry');
              setAwaitingChoice(false);
            }, 500);
            break;
            
          case 'data_inquiry':
            // User has provided data information
            setTimeout(() => {
              // Update requirements summary with available data
              setRequirementsSummary(prev => ({
                ...prev,
                available_data: 'モデルハウスに設置している定置カメラの映像データ'
              }));
              
              // Ask about budget and schedule
              setMessages(prev => [...prev, { 
                text: 'プロジェクトの予算についてお伺いしてもよろしいでしょうか？また、導入スケジュールや特別な要件があれば教えてください。', 
                sender: 'bot'
              }]);
              
              setConversationState('budget_inquiry');
              setAwaitingChoice(false);
            }, 500);
            break;
            
          case 'budget_inquiry':
            // User has provided budget information
            setTimeout(() => {
              // Update requirements summary with budget info
              setRequirementsSummary(prev => ({
                ...prev,
                budget: 'まだ具体的に組まれておらず、お試しをしながら効果を検証したい'
              }));
              
              // Ask about special requirements
              setMessages(prev => [...prev, { 
                text: '予算についてはまだ具体的に組まれておらず、お試しをしながら効果を検証したいと考えているのですね。導入スケジュールや特別な要件についてもお伺いできますでしょうか？', 
                sender: 'bot'
              }]);
              
              setConversationState('requirements_inquiry');
              setAwaitingChoice(false);
            }, 500);
            break;
            
          case 'requirements_inquiry':
            // User has provided requirements information
            setTimeout(() => {
              // Update requirements summary with special requirements
              setRequirementsSummary(prev => ({
                ...prev,
                requirements: '既設のカメラを利用できる必要がある'
              }));
              
              // Ask about schedule
              setMessages(prev => [...prev, { 
                text: '特別な要件として、検討段階で既設のカメラを利用できる必要があるのですね。他に導入スケジュールについて明確な予定はありますでしょうか？', 
                sender: 'bot'
              }]);
              
              setConversationState('schedule_inquiry');
              setAwaitingChoice(false);
            }, 500);
            break;
            
          case 'schedule_inquiry':
            // User has provided schedule information
            setTimeout(() => {
              // Update requirements summary with schedule
              setRequirementsSummary(prev => ({
                ...prev,
                introduction_schedule: '来年度4月から検討を開始'
              }));
              
              // Present summary
              const summaryText = generateRequirementsSummary();
              
              setMessages(prev => [...prev, { 
                text: `プロジェクトの予算はまだ具体的に組まれておらず、まずはお試しをしながら効果を検証したいとのことです。導入スケジュールとしては、来年度4月から検討を開始したいと伺っています。特別な要件としては、既設のカメラを利用できる必要があります。他に必要な情報やご質問があればお知らせください。\n\n${summaryText}`, 
                sender: 'bot'
              }]);
              
              setConversationState('summary_presentation');
              setAwaitingChoice(false);
            }, 500);
            break;
            
          case 'summary_presentation':
            // After summary presentation, provide final recommendation
            setTimeout(() => {
              setMessages(prev => [...prev, { 
                text: '商談支援については、既に提供された情報を基に専門家が具体的な提案を行う準備が整っています。次のステップとして、具体的なソリューション提案やテスト導入に関する詳細な打ち合わせを設定することが重要です。必要に応じて、専門家との会議をスケジュールし、プロジェクトを円滑に進めるための支援を受けることをお勧めします。', 
                sender: 'bot'
              }]);
              
              // Reset to initial state for next conversation
              setConversationState('initial');
              setAwaitingChoice(false);
            }, 500);
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
      // Implementation will be added later when connected to backend API
    };

    // View messages received  
    const viewMessage = () => {
      // This is a placeholder function for testing
      setMessages([...messages, { text: '承知しました。', sender: 'bot' }]);
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
    
    // Helper function to generate requirements summary
    const generateRequirementsSummary = (): string => {
      const summary = requirementsSummary;
      return `---\n<ここまでの要件サマリ>\n` +
        Object.entries(summary)
          .filter(([_, value]) => value) // Only include non-empty values
          .map(([key, value]) => ` '${key}': '${value}'`)
          .join(',\n') +
        `\n---`;
    };
    
    // Helper function to generate business consultation responses based on user input
    const generateBusinessResponse = (userQuery: string): string => {
      // Simple keyword matching for demo purposes
      if (userQuery.includes('予算') || userQuery.includes('コスト')) {
        return '予算については、初期導入費用と運用コストを分けて考えることをお勧めします。初期費用には、システム構築費用、カメラ設置費用（既存カメラ利用の場合は不要）、ソフトウェアライセンス費用などが含まれます。運用コストには、クラウドサービス利用料、保守管理費、アップデート費用などが含まれます。';
      } else if (userQuery.includes('導入') || userQuery.includes('スケジュール')) {
        return '導入スケジュールとしては、一般的に以下のステップで進めることをお勧めします：\n1. 要件定義（1ヶ月）\n2. システム設計（1-2ヶ月）\n3. 開発・構築（2-3ヶ月）\n4. テスト運用（1ヶ月）\n5. 本番導入（1ヶ月）\n合計で約6-8ヶ月のスケジュールが一般的です。';
      } else if (userQuery.includes('技術') || userQuery.includes('カメラ')) {
        return '既存のカメラを活用する場合、カメラの仕様（解像度、フレームレート、設置位置など）によって検知精度が変わります。最低限、HD解像度（1280x720）以上、フレームレート15fps以上のカメラが望ましいです。また、人の動きを捉えやすい位置に設置されていることも重要です。';
      } else {
        return '消費者行動の検知技術としては、画像認識AI、動線分析、滞留時間分析、表情分析などがあります。これらを組み合わせることで、購買意欲の高い消費者を特定し、適切なタイミングでアプローチすることが可能になります。';
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
          case 'business_understanding':
            // User confirmed business understanding
            setTimeout(() => {
              setAwaitingChoice(false);
              // Ask about business issues
              setMessages(prev => [...prev, { 
                text: 'エンドユーザからの問い合わせは、商談支援に関する内容と理解しました。次に、業務課題について具体的にお伺いしてもよろしいでしょうか？どのような業務課題に直面されていますか？', 
                sender: 'bot' 
              }]);
              setConversationState('business_issue_inquiry');
            }, 500);
            break;
            
          default:
            // For any other state with "yes" response
            setTimeout(() => {
              setAwaitingChoice(false);
              setMessages(prev => [...prev, { 
                text: '承知しました。他に何かお手伝いできることはありますか？', 
                sender: 'bot' 
              }]);
            }, 500);
            break;
        }
      } else if (choice === 'いいえ') {
        // Handle "No" responses
        switch (conversationState) {
          case 'business_understanding':
            // User rejected business understanding
            setTimeout(() => {
              setAwaitingChoice(false);
              setMessages(prev => [...prev, { 
                text: '申し訳ありません。どのような内容でのお問い合わせでしょうか？より適切なサポートをご提供するために、詳細をお聞かせください。', 
                sender: 'bot' 
              }]);
              // Stay in the same state to try again
            }, 500);
            break;
            
          default:
            // For any other state with "no" response
            setTimeout(() => {
              setAwaitingChoice(false);
              setMessages(prev => [...prev, { 
                text: '承知しました。他に何かお手伝いできることはありますか？', 
                sender: 'bot' 
              }]);
              // Reset to initial state
              setConversationState('initial');
            }, 500);
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
              <textarea
                className="message-textarea"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize the textarea based on content
                  e.target.style.height = 'auto';
                  const newHeight = Math.min(e.target.scrollHeight, 96); // Max height for 4 lines (24px per line)
                  e.target.style.height = `${newHeight}px`;
                }}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter' && !e.shiftKey && !awaitingChoice) {
                    e.preventDefault();
                    sendMessage();
                  } else if (e.key === 'Enter' && e.shiftKey) {
                    // Allow Shift+Enter for line breaks
                    // No need to do anything special as the default behavior will insert a line break
                  }
                }}
                placeholder="メッセージを入力..."
                disabled={awaitingChoice}
                rows={1}
                ref={(textareaRef) => {
                  // Initialize height when component mounts
                  if (textareaRef) {
                    textareaRef.style.height = 'auto';
                    textareaRef.style.height = `${Math.min(textareaRef.scrollHeight, 96)}px`;
                  }
                }}
              />
              <div className="button-container">
                <button onClick={sendMessage} disabled={awaitingChoice}>Send</button>
                <button onClick={toggleListening} className="voice-button" aria-label={isListening ? '音声入力停止' : '音声入力'}>
                  <span className="voice-icon">{isListening ? '■' : '🎤'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
    );
};

export default ChatComponent;
