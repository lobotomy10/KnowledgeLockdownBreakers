// ChatComponent.tsx
import './css/ChatComponent.css';
import './css/Sidebar.css';

// Import React
import * as React from 'react';

// Define Message interface
interface Message {
  text: string;
  sender: 'self' | 'bot';
}

// SpeechRecognition interfaces are defined in react-app-env.d.ts

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isListening, setIsListening] = React.useState(false);
    
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
    
    // send message 本実装時はelseは不要
    const sendMessage = () => {
        if (input.trim() !== '') {
          setMessages([...messages, { text: input, sender: 'self' }]);
        } else {
          setMessages([...messages, { text: 'Hellow!!', sender: 'bot' }]);
        }
        setInput('');
        // for backend　////api////
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
    
    return (
        <div id="chat-container">
          <div id="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender === 'self' ? 'right' : 'left'}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div id="input-container">
            <div className="input-row">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
                placeholder="Type a message..."
              />
              <div className="button-container">
                <button onClick={sendMessage}>Send</button>
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
