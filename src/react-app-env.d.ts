/// <reference types="react" />

// Define ReactFlow module
declare module '@xyflow/react' {
  export interface ReactFlowProps {
    nodes: any[];
    edges: any[];
    [key: string]: any;
  }
  
  export const ReactFlow: any;
}

// Make this file a module
export {};

// Add SpeechRecognition types
declare global {
  interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
  }

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

  interface Window {
    SpeechRecognition: {
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new(): SpeechRecognition;
    };
  }
}
