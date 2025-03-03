// ChatComponent.tsx
import './css/ChatComponent.css';
import './css/Sidebar.css';

// Define React for TypeScript
declare namespace React {
  interface FC<P = {}> {
    (props: P): JSX.Element | null;
  }
  
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
}

// Define JSX for TypeScript
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    div: any;
    input: any;
    button: any;
  }
}

// Define Message interface
interface Message {
  text: string;
  sender: 'self' | 'bot';
}

// Define SpeechRecognition interfaces
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// Define SpeechRecognition global types
declare global {
  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}

const ChatComponent: React.FC = () => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isListening, setIsListening] = React.useState(false);
    
    // Initialize speech recognition
    React.useEffect(() => {
      // Check if browser supports SpeechRecognition
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        console.error('Speech recognition not supported in this browser');
        return;
      }
    }, []);

    // Get SpeechRecognition constructor
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
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
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported');
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setInput((prev) => prev + transcriptResult);
      };
      
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
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
      if (!SpeechRecognition) return;
      
      const recognition = new SpeechRecognition();
      recognition.stop();
      setIsListening(false);
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
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Type a message..."
            />
            <div className="button-container">
              <button onClick={sendMessage}>Send</button>
              <button onClick={toggleListening} className="voice-button">
                {isListening ? 'Stop Voice' : 'Voice Message'}
              </button>
            </div>
          </div>
        </div>
    );
};

export default ChatComponent;
